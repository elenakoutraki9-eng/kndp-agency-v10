import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Loader2, Plus, Trash2, FolderKanban, RefreshCw, Check, ExternalLink, Calendar } from "lucide-react";
import {
  API, authCfg, PROJECT_STATUSES, PROJECT_STATUS_META, PROJECT_TYPES,
  inputCls, Labeled, Modal, SectionHeader, EmptyState, eur, fmtDate,
} from "./shared";

const emptyProject = {
  name: "", client_id: "", type: "Ιστοσελίδα", status: "Νέο", description: "",
  budget: 0, deadline: "", start_date: "", staging_url: "", live_url: "", login_notes: "",
};

function TaskList({ token, projectId }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/admin/tasks`, { ...authCfg(token), params: { project_id: projectId } });
      setTasks(res.data);
    } finally { setLoading(false); }
  }, [token, projectId]);
  useEffect(() => { load(); }, [load]);

  const add = async () => {
    if (!title.trim()) return;
    const res = await axios.post(`${API}/admin/tasks`, { project_id: projectId, title: title.trim() }, authCfg(token));
    setTasks((t) => [...t, res.data]); setTitle("");
  };
  const toggle = async (t) => {
    const res = await axios.patch(`${API}/admin/tasks/${t.id}`, { done: !t.done }, authCfg(token));
    setTasks((list) => list.map((x) => (x.id === t.id ? res.data : x)));
  };
  const remove = async (id) => {
    await axios.delete(`${API}/admin/tasks/${id}`, authCfg(token));
    setTasks((list) => list.filter((x) => x.id !== id));
  };

  const done = tasks.filter((t) => t.done).length;

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-ink/45">Εργασίες (Checklist)</span>
        {tasks.length > 0 && <span className="text-xs font-bold text-ink/50">{done}/{tasks.length}</span>}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          data-testid="task-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder="Νέα εργασία…"
          className={inputCls}
        />
        <button onClick={add} data-testid="task-add" className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-ink px-3 text-xs font-bold text-white"><Plus className="h-4 w-4" /></button>
      </div>
      {loading ? (
        <div className="mt-3 flex justify-center text-ink/40"><Loader2 className="h-4 w-4 animate-spin" /></div>
      ) : (
        <ul className="mt-2 space-y-1.5">
          {tasks.map((t) => (
            <li key={t.id} data-testid={`task-${t.id}`} className="flex items-center gap-2 rounded-xl bg-mist/50 px-3 py-2">
              <button onClick={() => toggle(t)} data-testid={`task-toggle-${t.id}`} className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${t.done ? "bg-emerald-500 border-emerald-500 text-white" : "border-ink/25 text-transparent"}`}><Check className="h-3 w-3" /></button>
              <span className={`flex-1 text-sm ${t.done ? "line-through text-ink/40" : "text-ink/80"}`}>{t.title}</span>
              <button onClick={() => remove(t.id)} className="text-ink/30 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
            </li>
          ))}
          {tasks.length === 0 && <li className="py-2 text-center text-xs text-ink/40">Καμία εργασία ακόμη.</li>}
        </ul>
      )}
    </div>
  );
}

function ProjectModal({ token, initial, clients, paid, onClose, onSaved }) {
  const [form, setForm] = useState({ ...emptyProject, ...initial });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const isEdit = Boolean(initial?.id);

  const save = async () => {
    if (!form.name.trim()) { setErr("Ο τίτλος είναι υποχρεωτικός."); return; }
    if (saving) return;
    setSaving(true); setErr("");
    const payload = { ...form, budget: parseFloat(form.budget) || 0, client_id: form.client_id || null };
    try {
      if (isEdit) await axios.patch(`${API}/admin/projects/${initial.id}`, payload, authCfg(token));
      else await axios.post(`${API}/admin/projects`, payload, authCfg(token));
      onSaved();
    } catch { setErr("Η αποθήκευση απέτυχε."); } finally { setSaving(false); }
  };

  return (
    <Modal
      title={isEdit ? "Έργο" : "Νέο Έργο"}
      onClose={onClose}
      wide
      testid="project-modal"
      footer={
        <>
          <button onClick={onClose} className="rounded-full border border-ink/12 px-4 py-2 text-xs font-bold text-ink/60 hover:bg-mist">Κλείσιμο</button>
          <button onClick={save} disabled={saving} data-testid="project-save" className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2 text-xs font-bold text-white hover:scale-[1.02] transition-transform disabled:opacity-50">
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}Αποθήκευση
          </button>
        </>
      }
    >
      {err && <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2 text-sm font-semibold text-red-600">{err}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Labeled label="Τίτλος έργου *"><input data-testid="project-name" className={inputCls} value={form.name} onChange={set("name")} /></Labeled>
        <Labeled label="Πελάτης">
          <select className={inputCls} value={form.client_id || ""} onChange={set("client_id")}>
            <option value="">— Χωρίς —</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Labeled>
        <Labeled label="Τύπος">
          <select className={inputCls} value={form.type || ""} onChange={set("type")}>
            {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </Labeled>
        <Labeled label="Κατάσταση">
          <select className={inputCls} value={form.status} onChange={set("status")}>
            {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Labeled>
        <Labeled label="Προϋπολογισμός (€)"><input type="number" className={inputCls} value={form.budget} onChange={set("budget")} /></Labeled>
        <Labeled label="Προθεσμία"><input type="date" className={inputCls} value={form.deadline || ""} onChange={set("deadline")} /></Labeled>
        <Labeled label="Staging URL"><input className={inputCls} value={form.staging_url || ""} onChange={set("staging_url")} /></Labeled>
        <Labeled label="Live URL"><input className={inputCls} value={form.live_url || ""} onChange={set("live_url")} /></Labeled>
      </div>
      <Labeled label="Περιγραφή"><textarea rows={2} className={inputCls} value={form.description || ""} onChange={set("description")} /></Labeled>
      <Labeled label="Στοιχεία πρόσβασης πελάτη (logins / notes)"><textarea rows={2} className={inputCls} value={form.login_notes || ""} onChange={set("login_notes")} /></Labeled>

      {isEdit && (
        <div className="rounded-xl border border-ink/8 bg-mist/40 px-3 py-2 text-sm">
          <span className="text-ink/50">Πληρωμένο από τιμολόγια: </span>
          <span className="font-bold text-emerald-600">{eur(paid)}</span>
          <span className="text-ink/40"> / {eur(form.budget)}</span>
        </div>
      )}

      {isEdit && <div className="border-t border-ink/8 pt-4"><TaskList token={token} projectId={initial.id} /></div>}
    </Modal>
  );
}

export default function Projects({ token }) {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [pr, cl, inv] = await Promise.all([
        axios.get(`${API}/admin/projects`, authCfg(token)),
        axios.get(`${API}/admin/clients`, authCfg(token)),
        axios.get(`${API}/admin/invoices`, authCfg(token)),
      ]);
      setProjects(pr.data); setClients(cl.data); setInvoices(inv.data);
    } finally { setLoading(false); }
  }, [token]);
  useEffect(() => { load(); }, [load]);

  const clientName = (id) => clients.find((c) => c.id === id)?.name;
  const paidFor = (pid) => invoices.filter((i) => i.project_id === pid).reduce((s, i) => s + (Number(i.amount_paid) || 0), 0);

  const changeStatus = async (p, status) => {
    setProjects((list) => list.map((x) => (x.id === p.id ? { ...x, status } : x)));
    await axios.patch(`${API}/admin/projects/${p.id}`, { status }, authCfg(token));
  };
  const remove = async (id) => {
    if (!window.confirm("Διαγραφή έργου (και των εργασιών του);")) return;
    await axios.delete(`${API}/admin/projects/${id}`, authCfg(token));
    setProjects((list) => list.filter((p) => p.id !== id));
  };

  const columns = useMemo(
    () => PROJECT_STATUSES.map((status) => ({ status, items: projects.filter((p) => (p.status || "Νέο") === status) })),
    [projects]
  );

  return (
    <div data-testid="projects-section">
      <SectionHeader
        title="Έργα"
        subtitle="Pipeline έργων — σύρε την κατάσταση, άνοιξε ένα έργο για εργασίες & στοιχεία."
        action={
          <div className="flex items-center gap-2">
            <button onClick={load} className="inline-flex items-center gap-2 rounded-full border border-ink/12 px-4 py-2 text-xs font-bold text-ink hover:bg-mist"><RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />Ανανέωση</button>
            <button onClick={() => setModal({})} data-testid="projects-add" className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-sm font-bold text-white hover:scale-[1.02] transition-transform"><Plus className="h-4 w-4" />Νέο Έργο</button>
          </div>
        }
      />

      {loading ? (
        <div className="mt-20 flex justify-center text-ink/40"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : projects.length === 0 ? (
        <EmptyState icon={FolderKanban} title="Κανένα έργο ακόμη" subtitle="Δημιούργησε το πρώτο σου έργο." testid="projects-empty" />
      ) : (
        <div className="mt-6 flex gap-4 overflow-x-auto pb-4">
          {columns.map(({ status, items }) => {
            const meta = PROJECT_STATUS_META[status];
            return (
              <div key={status} data-testid={`projects-column-${status}`} className="flex w-80 shrink-0 flex-col rounded-2xl border border-ink/8 bg-mist/40">
                <div className={`flex items-center justify-between rounded-t-2xl border-b px-4 py-3 ${meta.head}`}>
                  <div className="flex items-center gap-2"><span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} /><span className="text-sm font-bold">{status}</span></div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${meta.chip}`}>{items.length}</span>
                </div>
                <div className="flex flex-col gap-2.5 p-3 min-h-[120px]">
                  {items.map((p) => {
                    const paid = paidFor(p.id);
                    return (
                      <div key={p.id} data-testid={`project-card-${p.id}`} className="group rounded-xl border border-ink/8 bg-white p-3.5 shadow-sm transition-shadow hover:shadow-md">
                        <div className="flex items-start justify-between gap-2">
                          <button onClick={() => setModal(p)} data-testid={`project-open-${p.id}`} className="min-w-0 text-left">
                            <p className="truncate font-semibold text-sm text-ink">{p.name}</p>
                            {clientName(p.client_id) && <p className="mt-0.5 truncate text-xs text-ink/50">{clientName(p.client_id)}</p>}
                          </button>
                          <button onClick={() => remove(p.id)} data-testid={`project-delete-${p.id}`} className="shrink-0 text-ink/25 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          {p.type && <span className="rounded-full bg-baby-light border border-baby/40 px-2 py-0.5 text-[10px] font-bold text-baby-dark">{p.type}</span>}
                          {p.budget > 0 && <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[10px] font-bold text-ink/60">{eur(paid)} / {eur(p.budget)}</span>}
                          {p.deadline && <span className="inline-flex items-center gap-1 rounded-full bg-ink/5 px-2 py-0.5 text-[10px] font-bold text-ink/60"><Calendar className="h-3 w-3" />{fmtDate(p.deadline)}</span>}
                        </div>
                        <div className="mt-2.5 flex items-center justify-between gap-2">
                          <select
                            value={p.status}
                            data-testid={`project-status-${p.id}`}
                            onChange={(e) => changeStatus(p, e.target.value)}
                            className="rounded-lg border border-ink/10 bg-white px-2 py-1 text-[11px] font-bold text-ink outline-none"
                          >
                            {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                          {(p.live_url || p.staging_url) && (
                            <a href={p.live_url || p.staging_url} target="_blank" rel="noreferrer" className="text-ink/30 hover:text-baby-dark"><ExternalLink className="h-3.5 w-3.5" /></a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {items.length === 0 && <div className="rounded-xl border border-dashed border-ink/10 py-6 text-center text-xs text-ink/30">Κενό</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && <ProjectModal token={token} initial={modal} clients={clients} paid={modal.id ? paidFor(modal.id) : 0} onClose={() => setModal(null)} onSaved={() => { setModal(null); load(); }} />}
    </div>
  );
}
