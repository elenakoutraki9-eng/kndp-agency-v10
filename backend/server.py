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
import httpx
import asyncio
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'kndp2025')
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')
GOOGLE_PLACES_API_KEY = os.environ.get('GOOGLE_PLACES_API_KEY')
PLACES_BASE = "https://places.googleapis.com/v1"
PLACES_DETAILS_MASK = "id,displayName,formattedAddress,nationalPhoneNumber,internationalPhoneNumber,websiteUri,rating,googleMapsUri"

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
    contacted_at: Optional[datetime] = None


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


class PlaceResult(BaseModel):
    place_id: str
    name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    rating: Optional[float] = None
    maps_url: Optional[str] = None


class PlaceSearchResponse(BaseModel):
    query: str
    results: List[PlaceResult]


class ProspectCreate(BaseModel):
    place_id: str
    name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    rating: Optional[float] = None
    maps_url: Optional[str] = None
    source_query: Optional[str] = None


class ProspectBulkCreate(BaseModel):
    prospects: List[ProspectCreate]


class Prospect(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    place_id: str
    name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    rating: Optional[float] = None
    maps_url: Optional[str] = None
    source_query: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


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
        if isinstance(m.get('contacted_at'), str):
            m['contacted_at'] = datetime.fromisoformat(m['contacted_at'])
    return messages


@api_router.patch("/admin/contacts/{contact_id}", response_model=ContactMessage)
async def update_contact(contact_id: str, body: ContactUpdate, _: bool = Depends(verify_admin)):
    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    if updates.get("status") == "Contacted":
        existing = await db.contact_messages.find_one({"id": contact_id}, {"_id": 0, "contacted_at": 1})
        if existing is not None and not existing.get("contacted_at"):
            updates["contacted_at"] = datetime.now(timezone.utc).isoformat()
    result = await db.contact_messages.update_one({"id": contact_id}, {"$set": updates})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    doc = await db.contact_messages.find_one({"id": contact_id}, {"_id": 0})
    if isinstance(doc.get('created_at'), str):
        doc['created_at'] = datetime.fromisoformat(doc['created_at'])
    if isinstance(doc.get('contacted_at'), str):
        doc['contacted_at'] = datetime.fromisoformat(doc['contacted_at'])
    return doc


async def _get_place_details(client: httpx.AsyncClient, place_id: str) -> PlaceResult:
    resp = await client.get(
        f"{PLACES_BASE}/places/{place_id}",
        headers={"X-Goog-Api-Key": GOOGLE_PLACES_API_KEY, "X-Goog-FieldMask": PLACES_DETAILS_MASK},
    )
    if resp.is_error:
        raise HTTPException(status_code=502, detail="Google Place Details error")
    p = resp.json()
    display = p.get("displayName") or {}
    return PlaceResult(
        place_id=p.get("id", place_id),
        name=display.get("text"),
        address=p.get("formattedAddress"),
        phone=p.get("internationalPhoneNumber") or p.get("nationalPhoneNumber"),
        website=p.get("websiteUri"),
        rating=p.get("rating"),
        maps_url=p.get("googleMapsUri"),
    )


@api_router.get("/admin/places/search", response_model=PlaceSearchResponse)
async def search_places(q: str, _: bool = Depends(verify_admin)):
    query = (q or "").strip()
    if len(query) < 2:
        raise HTTPException(status_code=400, detail="Η αναζήτηση χρειάζεται τουλάχιστον 2 χαρακτήρες")
    if not GOOGLE_PLACES_API_KEY:
        raise HTTPException(status_code=500, detail="Το Google Places API key δεν έχει ρυθμιστεί")

    all_place_ids: List[str] = []
    async with httpx.AsyncClient(timeout=20.0) as client:
        page_token = None
        # Loop through every page Google returns (no artificial result cap);
        # a generous page-count safety net just guards against a runaway loop.
        for _page in range(10):
            body = {"textQuery": query, "pageSize": 20, "languageCode": "el"}
            if page_token:
                body["pageToken"] = page_token
            search_resp = await client.post(
                f"{PLACES_BASE}/places:searchText",
                headers={
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
                    "X-Goog-FieldMask": "places.id,nextPageToken",
                },
                json=body,
            )
            if search_resp.is_error:
                if not all_place_ids:
                    detail = search_resp.json().get("error", {}).get("message", "Google Text Search error") if search_resp.text else "Google Text Search error"
                    raise HTTPException(status_code=502, detail=detail)
                break

            data = search_resp.json()
            all_place_ids.extend(p["id"] for p in data.get("places", []) if p.get("id"))
            page_token = data.get("nextPageToken")
            if not page_token:
                break
            # A freshly issued pageToken needs a moment before Google accepts it.
            await asyncio.sleep(2)

        seen = set()
        unique_ids = [pid for pid in all_place_ids if not (pid in seen or seen.add(pid))]

        results: List[PlaceResult] = []
        batch_size = 10
        for i in range(0, len(unique_ids), batch_size):
            batch = unique_ids[i:i + batch_size]
            batch_results = await asyncio.gather(
                *(_get_place_details(client, pid) for pid in batch), return_exceptions=True
            )
            results.extend(r for r in batch_results if isinstance(r, PlaceResult))

    return PlaceSearchResponse(query=query, results=results)


@api_router.post("/admin/prospects/bulk", response_model=List[Prospect])
async def add_prospects(body: ProspectBulkCreate, _: bool = Depends(verify_admin)):
    if not body.prospects:
        raise HTTPException(status_code=400, detail="Δεν στάλθηκαν υποψήφιοι πελάτες")
    created: List[Prospect] = []
    for item in body.prospects:
        existing = await db.prospects.find_one({"place_id": item.place_id}, {"_id": 0})
        if existing:
            continue
        prospect = Prospect(**item.model_dump())
        doc = prospect.model_dump()
        doc["created_at"] = doc["created_at"].isoformat()
        await db.prospects.insert_one(doc)
        created.append(prospect)
    return created


@api_router.get("/admin/prospects", response_model=List[Prospect])
async def get_prospects(_: bool = Depends(verify_admin)):
    docs = await db.prospects.find({}, {"_id": 0}).sort("created_at", -1).to_list(5000)
    for d in docs:
        if isinstance(d.get('created_at'), str):
            d['created_at'] = datetime.fromisoformat(d['created_at'])
    return docs


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
