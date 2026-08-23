import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Plus, Trash2, Pencil, Users, Mail, Phone, Globe, RefreshCw } from "lucide-react";
import {
  API, authCfg, CLIENT_STATUSES, CLIENT_STATUS_LABEL, CLIENT_STATUS_CHIP,
  inputCls, Labeled, Modal, SectionHeader, EmptyState,
} from "./shared";

const emptyClient = { name: "", contact_name: "", email: "", phone: "", website: "", address: "", status: "Active", notes: "" };

function ClientModal({ token, initial, onClose, onSaved }) {
  const [form, setForm] = useState({ ...emptyClient, ...initial });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    if (!form.name.trim() || saving) { if (!form.name.trim()) setErr("Το όνομα είναι υποχρεωτικό."); return; }
    setSaving(true); setErr("");
    try {
      if (initial?.id) await axios.patch(`${API}/admin/clients/${initial.id}`, form, authCfg(token));
      else await axios.post(`${API}/admin/clients`, form, authCfg(token));
      onSaved();
    } catch { setErr("Η αποθήκευση απέτυχε."); } finally { setSaving(false); }
  };

  return (
    <Modal
      title={initial?.id ? "Επεξεργασία Πελάτη" : "Νέος Πελάτης"}
      onClose={onClose}
      testid="client-modal"
      footer={
        <>
          <button onClick={onClose} className="rounded-full border border-ink/12 px-4 py-2 text-xs font-bold text-ink/60 hover:bg-mist">Άκυρο</button>
          <button onClick={save} disabled={saving} data-testid="client-save" className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2 text-xs font-bold text-white hover:scale-[1.02] transition-transform disabled:opacity-50">
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}Αποθήκευση
          </button>
        </>
      }
    >
      {err && <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2 text-sm font-semibold text-red-600">{err}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Labeled label="Επωνυμία / Εταιρεία *"><input data-testid="client-name" className={inputCls} value={form.name} onChange={set("name")} /></Labeled>
        <Labeled label="Υπεύθυνος επικοινωνίας"><input className={inputCls} value={form.contact_name || ""} onChange={set("contact_name")} /></Labeled>
        <Labeled label="Email"><input className={inputCls} value={form.email || ""} onChange={set("email")} /></Labeled>
        <Labeled label="Τηλέφωνο"><input className={inputCls} value={form.phone || ""} onChange={set("phone")} /></Labeled>
        <Labeled label="Ιστοσελίδα"><input className={inputCls} value={form.website || ""} onChange={set("website")} /></Labeled>
        <Labeled label="Κατάσταση">
          <select className={inputCls} value={form.status} onChange={set("status")}>
            {CLIENT_STATUSES.map((s) => <option key={s} value={s}>{CLIENT_STATUS_LABEL[s]}</option>)}
          </select>
        </Labeled>
      </div>
      <Labeled label="Διεύθυνση"><input className={inputCls} value={form.address || ""} onChange={set("address")} /></Labeled>
      <Labeled label="Σημειώσεις"><textarea rows={3} className={inputCls} value={form.notes || ""} onChange={set("notes")} /></Labeled>
    </Modal>
  );
}

export default function Clients({ token }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | {} | client

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/admin/clients`, authCfg(token));
      setClients(res.data);
    } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const remove = async (id) => {
    if (!window.confirm("Διαγραφή πελάτη;")) return;
    await axios.delete(`${API}/admin/clients/${id}`, authCfg(token));
    setClients((p) => p.filter((c) => c.id !== id));
  };

  return (
    <div data-testid="clients-section">
      <SectionHeader
        title="Πελάτες"
        subtitle="Διαχειρίσου τις εταιρείες και τις επαφές σου."
        action={
          <div className="flex items-center gap-2">
            <button onClick={load} className="inline-flex items-center gap-2 rounded-full border border-ink/12 px-4 py-2 text-xs font-bold text-ink hover:bg-mist">
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />Ανανέωση
            </button>
            <button onClick={() => setModal({})} data-testid="clients-add" className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-sm font-bold text-white hover:scale-[1.02] transition-transform">
              <Plus className="h-4 w-4" />Νέος Πελάτης
            </button>
          </div>
        }
      />

      {loading ? (
        <div className="mt-20 flex justify-center text-ink/40"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : clients.length === 0 ? (
        <EmptyState icon={Users} title="Κανένας πελάτης ακόμη" subtitle="Πρόσθεσε πελάτη ή μετάτρεψε ένα lead/υποψήφιο." testid="clients-empty" />
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {clients.map((c) => (
            <div key={c.id} data-testid={`client-card-${c.id}`} className="rounded-2xl border border-ink/8 bg-white p-5 transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display text-lg font-semibold tracking-tight truncate">{c.name}</p>
                  {c.contact_name && <p className="text-xs text-ink/50 truncate">{c.contact_name}</p>}
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${CLIENT_STATUS_CHIP[c.status] || "bg-ink/10 text-ink/60"}`}>
                  {CLIENT_STATUS_LABEL[c.status] || c.status}
                </span>
              </div>
              <div className="mt-3 space-y-1.5 text-sm">
                {c.email && <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-ink/70 hover:text-baby-dark"><Mail className="h-3.5 w-3.5 shrink-0 text-baby-dark" /><span className="truncate">{c.email}</span></a>}
                {c.phone && <a href={`tel:${c.phone}`} className="flex items-center gap-2 text-ink/70 hover:text-baby-dark"><Phone className="h-3.5 w-3.5 shrink-0 text-baby-dark" />{c.phone}</a>}
                {c.website && <a href={c.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-ink/70 hover:text-baby-dark"><Globe className="h-3.5 w-3.5 shrink-0 text-baby-dark" /><span className="truncate">{c.website}</span></a>}
              </div>
              {c.notes && <p className="mt-3 line-clamp-2 rounded-xl bg-mist/50 px-3 py-2 text-xs text-ink/60">{c.notes}</p>}
              <div className="mt-4 flex items-center justify-end gap-2">
                <button onClick={() => setModal(c)} data-testid={`client-edit-${c.id}`} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-ink/40 hover:bg-mist hover:text-ink"><Pencil className="h-3.5 w-3.5" /></button>
                <button onClick={() => remove(c.id)} data-testid={`client-delete-${c.id}`} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-ink/40 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && <ClientModal token={token} initial={modal} onClose={() => setModal(null)} onSaved={() => { setModal(null); load(); }} />}
    </div>
  );
}
