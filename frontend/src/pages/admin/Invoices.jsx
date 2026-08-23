import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Loader2, Plus, Trash2, Pencil, Receipt, RefreshCw, Check } from "lucide-react";
import {
  API, authCfg, INVOICE_STATUSES, INVOICE_STATUS_LABEL, INVOICE_STATUS_CHIP,
  inputCls, Labeled, Modal, SectionHeader, EmptyState, eur, fmtDate,
} from "./shared";

const emptyInvoice = { client_id: "", project_id: "", number: "", amount: 0, amount_paid: 0, status: "Unpaid", issued_date: "", due_date: "", notes: "" };

function InvoiceModal({ token, initial, clients, projects, onClose, onSaved }) {
  const [form, setForm] = useState({ ...emptyInvoice, ...initial });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    if (saving) return;
    setSaving(true);
    const payload = {
      ...form,
      amount: parseFloat(form.amount) || 0,
      amount_paid: parseFloat(form.amount_paid) || 0,
      client_id: form.client_id || null,
      project_id: form.project_id || null,
    };
    try {
      if (initial?.id) await axios.patch(`${API}/admin/invoices/${initial.id}`, payload, authCfg(token));
      else await axios.post(`${API}/admin/invoices`, payload, authCfg(token));
      onSaved();
    } finally { setSaving(false); }
  };

  return (
    <Modal
      title={initial?.id ? "Επεξεργασία Τιμολογίου" : "Νέο Τιμολόγιο"}
      onClose={onClose}
      testid="invoice-modal"
      footer={
        <>
          <button onClick={onClose} className="rounded-full border border-ink/12 px-4 py-2 text-xs font-bold text-ink/60 hover:bg-mist">Άκυρο</button>
          <button onClick={save} disabled={saving} data-testid="invoice-save" className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2 text-xs font-bold text-white hover:scale-[1.02] transition-transform disabled:opacity-50">
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}Αποθήκευση
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Labeled label="Πελάτης">
          <select className={inputCls} value={form.client_id || ""} onChange={set("client_id")}>
            <option value="">— Χωρίς —</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Labeled>
        <Labeled label="Έργο">
          <select className={inputCls} value={form.project_id || ""} onChange={set("project_id")}>
            <option value="">— Χωρίς —</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </Labeled>
        <Labeled label="Αριθμός τιμολογίου"><input className={inputCls} value={form.number || ""} onChange={set("number")} placeholder="π.χ. 2026-001" /></Labeled>
        <Labeled label="Κατάσταση">
          <select className={inputCls} value={form.status} onChange={set("status")}>
            {INVOICE_STATUSES.map((s) => <option key={s} value={s}>{INVOICE_STATUS_LABEL[s]}</option>)}
          </select>
        </Labeled>
        <Labeled label="Ποσό (€)"><input type="number" className={inputCls} value={form.amount} onChange={set("amount")} /></Labeled>
        <Labeled label="Πληρωμένο (€)"><input type="number" className={inputCls} value={form.amount_paid} onChange={set("amount_paid")} /></Labeled>
        <Labeled label="Ημ. έκδοσης"><input type="date" className={inputCls} value={form.issued_date || ""} onChange={set("issued_date")} /></Labeled>
        <Labeled label="Ημ. λήξης"><input type="date" className={inputCls} value={form.due_date || ""} onChange={set("due_date")} /></Labeled>
      </div>
      <Labeled label="Σημειώσεις"><textarea rows={2} className={inputCls} value={form.notes || ""} onChange={set("notes")} /></Labeled>
    </Modal>
  );
}

export default function Invoices({ token }) {
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [inv, cl, pr] = await Promise.all([
        axios.get(`${API}/admin/invoices`, authCfg(token)),
        axios.get(`${API}/admin/clients`, authCfg(token)),
        axios.get(`${API}/admin/projects`, authCfg(token)),
      ]);
      setInvoices(inv.data); setClients(cl.data); setProjects(pr.data);
    } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const clientName = (id) => clients.find((c) => c.id === id)?.name || "—";
  const projectName = (id) => projects.find((p) => p.id === id)?.name || "—";

  const totals = useMemo(() => {
    const billed = invoices.reduce((s, i) => s + (Number(i.amount) || 0), 0);
    const collected = invoices.reduce((s, i) => s + (Number(i.amount_paid) || 0), 0);
    return { billed, collected, outstanding: Math.max(billed - collected, 0) };
  }, [invoices]);

  const remove = async (id) => {
    if (!window.confirm("Διαγραφή τιμολογίου;")) return;
    await axios.delete(`${API}/admin/invoices/${id}`, authCfg(token));
    setInvoices((p) => p.filter((i) => i.id !== id));
  };
  const markPaid = async (inv) => {
    await axios.patch(`${API}/admin/invoices/${inv.id}`, { amount_paid: inv.amount, status: "Paid" }, authCfg(token));
    load();
  };

  return (
    <div data-testid="invoices-section">
      <SectionHeader
        title="Τιμολόγια"
        subtitle="Παρακολούθησε πληρωμές και εκκρεμότητες."
        action={
          <div className="flex items-center gap-2">
            <button onClick={load} className="inline-flex items-center gap-2 rounded-full border border-ink/12 px-4 py-2 text-xs font-bold text-ink hover:bg-mist"><RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />Ανανέωση</button>
            <button onClick={() => setModal({})} data-testid="invoices-add" className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-sm font-bold text-white hover:scale-[1.02] transition-transform"><Plus className="h-4 w-4" />Νέο Τιμολόγιο</button>
          </div>
        }
      />

      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-ink/8 bg-white px-4 py-3.5"><p className="text-[11px] uppercase tracking-[0.15em] font-semibold text-ink/45">Σύνολο</p><p className="text-lg font-bold">{eur(totals.billed)}</p></div>
        <div className="rounded-2xl border border-ink/8 bg-white px-4 py-3.5"><p className="text-[11px] uppercase tracking-[0.15em] font-semibold text-ink/45">Εισπραχθέντα</p><p className="text-lg font-bold text-emerald-600">{eur(totals.collected)}</p></div>
        <div className="rounded-2xl border border-ink/8 bg-white px-4 py-3.5"><p className="text-[11px] uppercase tracking-[0.15em] font-semibold text-ink/45">Εκκρεμότητες</p><p className="text-lg font-bold text-rose-500">{eur(totals.outstanding)}</p></div>
      </div>

      {loading ? (
        <div className="mt-20 flex justify-center text-ink/40"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : invoices.length === 0 ? (
        <EmptyState icon={Receipt} title="Κανένα τιμολόγιο ακόμη" subtitle="Δημιούργησε ένα τιμολόγιο για έναν πελάτη ή έργο." testid="invoices-empty" />
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-ink/8 bg-white">
          <table data-testid="invoices-table" className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink/8 text-[11px] uppercase tracking-[0.15em] font-semibold text-ink/45">
                <th className="px-4 py-3">Αριθμός</th><th className="px-4 py-3">Πελάτης</th><th className="px-4 py-3">Έργο</th>
                <th className="px-4 py-3">Ποσό</th><th className="px-4 py-3">Πληρωμένο</th><th className="px-4 py-3">Κατάσταση</th>
                <th className="px-4 py-3">Λήξη</th><th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {invoices.map((i) => (
                <tr key={i.id} data-testid={`invoice-row-${i.id}`} className="border-b border-ink/6 last:border-b-0 hover:bg-mist/40">
                  <td className="px-4 py-3 font-semibold text-ink">{i.number || "—"}</td>
                  <td className="px-4 py-3 text-ink/70">{clientName(i.client_id)}</td>
                  <td className="px-4 py-3 text-ink/70">{projectName(i.project_id)}</td>
                  <td className="px-4 py-3 text-ink/70">{eur(i.amount)}</td>
                  <td className="px-4 py-3 text-ink/70">{eur(i.amount_paid)}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${INVOICE_STATUS_CHIP[i.status]}`}>{INVOICE_STATUS_LABEL[i.status] || i.status}</span></td>
                  <td className="px-4 py-3 text-ink/60">{fmtDate(i.due_date)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {i.status !== "Paid" && <button onClick={() => markPaid(i)} data-testid={`invoice-markpaid-${i.id}`} title="Σήμανση ως πληρωμένο" className="inline-flex h-8 w-8 items-center justify-center rounded-full text-ink/40 hover:bg-emerald-50 hover:text-emerald-600"><Check className="h-3.5 w-3.5" /></button>}
                      <button onClick={() => setModal(i)} data-testid={`invoice-edit-${i.id}`} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-ink/40 hover:bg-mist hover:text-ink"><Pencil className="h-3.5 w-3.5" /></button>
                      <button onClick={() => remove(i.id)} data-testid={`invoice-delete-${i.id}`} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-ink/40 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && <InvoiceModal token={token} initial={modal} clients={clients} projects={projects} onClose={() => setModal(null)} onSaved={() => { setModal(null); load(); }} />}
    </div>
  );
}
