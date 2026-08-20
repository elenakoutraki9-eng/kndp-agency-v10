from fastapi import FastAPI, APIRouter, HTTPException, Header, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
import json
import re
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'kndp2025')
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

# Categories KNDP can build for a business (Greek labels shown to the user).
IDEA_CATEGORIES = [
    "Ιστοσελίδες",
    "Web Apps",
    "Mobile Apps",
    "Έξυπνα Εργαλεία",
    "Web Tools",
    "Automations",
    "Προγράμματα",
]
# How many ideas we show inline before pushing the user to the contact form.
IDEAS_INLINE_LIMIT = 15

app = FastAPI()
api_router = APIRouter(prefix="/api")


class AdminLogin(BaseModel):
    password: str


def verify_admin(x_admin_token: Optional[str] = Header(default=None)):
    if x_admin_token != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True


class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    phone: Optional[str] = None
    company: Optional[str] = None
    service: Optional[str] = None
    message: str
    status: str = "New"
    notes: str = ""
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ContactMessageCreate(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    company: Optional[str] = None
    service: Optional[str] = None
    message: str


class ContactUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None


@api_router.get("/")
async def root():
    return {"message": "KNDP API"}


class IdeaRequest(BaseModel):
    business: str


class Idea(BaseModel):
    category: str
    title: str
    description: str = ""


def _extract_json(text: str) -> dict:
    """Best-effort extraction of a JSON object from an LLM response."""
    if not text:
        return {}
    # Strip markdown code fences if present.
    fenced = re.search(r"```(?:json)?\s*(\{.*\}|\[.*\])\s*```", text, re.DOTALL)
    if fenced:
        candidate = fenced.group(1)
    else:
        # Grab the first {...} or [...] block.
        match = re.search(r"(\{.*\}|\[.*\])", text, re.DOTALL)
        candidate = match.group(1) if match else text
    try:
        return json.loads(candidate)
    except json.JSONDecodeError:
        return {}


@api_router.post("/generate-ideas")
async def generate_ideas(req: IdeaRequest):
    business = (req.business or "").strip()
    if not business:
        raise HTTPException(status_code=400, detail="Παρακαλώ γράψε το είδος της επιχείρησής σου.")
    if len(business) > 120:
        business = business[:120]
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="Η υπηρεσία δεν είναι διαθέσιμη αυτή τη στιγμή.")

    categories_str = ", ".join(IDEA_CATEGORIES)
    system_message = (
        "Είσαι σύμβουλος ψηφιακών λύσεων για το ψηφιακό στούντιο KNDP. "
        "Ο χρήστης θα σου δώσει το είδος της επιχείρησής του και εσύ προτείνεις ΟΛΕΣ τις "
        "ψηφιακές λύσεις που θα μπορούσε να φτιάξει η KNDP ειδικά για αυτή την επιχείρηση: "
        "ιστοσελίδες, web apps, mobile apps, έξυπνα εργαλεία, web tools, automations και προγράμματα. "
        f"Χρησιμοποίησε ΜΟΝΟ αυτές τις κατηγορίες (πεδίο category): {categories_str}. "
        "Δώσε συγκεκριμένες, πρακτικές και σχετικές προτάσεις για το συγκεκριμένο είδος επιχείρησης — όχι γενικόλογες. "
        "Πρότεινε όσο το δυνατόν περισσότερες σχετικές ιδέες (ιδανικά 12 έως 20), καλύπτοντας πολλές κατηγορίες. "
        "Απάντησε ΑΠΟΚΛΕΙΣΤΙΚΑ στα Ελληνικά. "
        "ΜΗΝ αναφέρεις ποτέ τις λέξεις 'AI', 'τεχνητή νοημοσύνη' ή παρόμοια — μίλα σαν να τα φτιάχνει η ομάδα της KNDP. "
        "Επίστρεψε ΜΟΝΟ έγκυρο JSON, χωρίς επεξηγήσεις, με αυτή τη μορφή: "
        '{\"ideas\": [{\"category\": \"<μία από τις κατηγορίες>\", \"title\": \"<σύντομος τίτλος 2-5 λέξεις>\", '
        '\"description\": \"<μία σύντομη πρόταση με το όφελος>\"}]}'
    )

    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"ideas-{uuid.uuid4()}",
        system_message=system_message,
    ).with_model("gemini", "gemini-3-flash-preview")

    try:
        response = await chat.send_message(
            UserMessage(text=f"Η επιχείρησή μου: {business}")
        )
    except Exception as exc:  # noqa: BLE001
        logging.getLogger(__name__).exception("LLM idea generation failed")
        raise HTTPException(status_code=502, detail="Δεν μπορέσαμε να δημιουργήσουμε ιδέες αυτή τη στιγμή. Δοκίμασε ξανά.") from exc

    data = _extract_json(response if isinstance(response, str) else str(response))
    raw_ideas = data.get("ideas") if isinstance(data, dict) else (data if isinstance(data, list) else [])
    if not isinstance(raw_ideas, list):
        raw_ideas = []

    ideas: List[dict] = []
    seen = set()
    for item in raw_ideas:
        if not isinstance(item, dict):
            continue
        title = str(item.get("title", "")).strip()
        if not title or title.lower() in seen:
            continue
        seen.add(title.lower())
        category = str(item.get("category", "")).strip()
        if category not in IDEA_CATEGORIES:
            category = IDEA_CATEGORIES[0]
        ideas.append({
            "category": category,
            "title": title,
            "description": str(item.get("description", "")).strip(),
        })

    if not ideas:
        raise HTTPException(status_code=502, detail="Δεν μπορέσαμε να δημιουργήσουμε ιδέες αυτή τη στιγμή. Δοκίμασε ξανά.")

    total = len(ideas)
    visible = ideas[:IDEAS_INLINE_LIMIT]
    has_more = total > IDEAS_INLINE_LIMIT

    return {
        "business": business,
        "ideas": visible,
        "total": total,
        "has_more": has_more,
        "limit": IDEAS_INLINE_LIMIT,
    }


@api_router.post("/contact", response_model=ContactMessage)
async def create_contact_message(input: ContactMessageCreate):
    msg = ContactMessage(**input.model_dump())
    doc = msg.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.contact_messages.insert_one(doc)
    return msg


@api_router.get("/contact", response_model=List[ContactMessage])
async def get_contact_messages():
    messages = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for m in messages:
        if isinstance(m.get('created_at'), str):
            m['created_at'] = datetime.fromisoformat(m['created_at'])
    return messages


@api_router.post("/admin/login")
async def admin_login(body: AdminLogin):
    if body.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Λάθος κωδικός")
    return {"token": ADMIN_PASSWORD}


@api_router.get("/admin/contacts", response_model=List[ContactMessage])
async def admin_contacts(_: bool = Depends(verify_admin)):
    messages = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    for m in messages:
        if isinstance(m.get('created_at'), str):
            m['created_at'] = datetime.fromisoformat(m['created_at'])
    return messages


@api_router.patch("/admin/contacts/{contact_id}", response_model=ContactMessage)
async def update_contact(contact_id: str, body: ContactUpdate, _: bool = Depends(verify_admin)):
    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    result = await db.contact_messages.update_one({"id": contact_id}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    doc = await db.contact_messages.find_one({"id": contact_id}, {"_id": 0})
    if isinstance(doc.get('created_at'), str):
        doc['created_at'] = datetime.fromisoformat(doc['created_at'])
    return doc


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
