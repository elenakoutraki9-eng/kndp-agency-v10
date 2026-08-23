import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import {
  Lock,
  ArrowLeft,
  LogOut,
  RefreshCw,
  Inbox,
  Mail,
  Phone,
  Loader2,
  Download,
  Check,
  ChevronDown,
  X,
  Search,
  Users,
  TrendingUp,
  Clock,
  Calendar,
} from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const TOKEN_KEY = "kndp_admin_token";

const STATUS_OPTIONS = ["New", "Contacted", "Converted", "Not Interested"];
const STATUS_META = {
  New: { dot: "bg-sky-400", head: "bg-sky-50 border-sky-200", chip: "bg-sky-100 text-sky-700" },
  Contacted: { dot: "bg-amber-400", head: "bg-amber-50 border-amber-200", chip: "bg-amber-100 text-amber-700" },
  Converted: { dot: "bg-emerald-500", head: "bg-emerald-50 border-emerald-200", chip: "bg-emerald-100 text-emerald-700" },
  "Not Interested": { dot: "bg-ink/30", head: "bg-mist border-ink/10", chip: "bg-ink/10 text-ink/60" },
};
const STATUS_RING = {
  New: "border-sky-300 bg-sky-50",
  Contacted: "border-amber-300 bg-amber-50",
  Converted: "border-emerald-300 bg-emerald-50",
  "Not Interested": "border-ink/15 bg-mist",
};
const STATUS_DOT = {
  New: "bg-sky-400",
  Contacted: "bg-amber-400",
  Converted: "bg-emerald-500",
  "Not Interested": "bg-ink/25",
};

const safeId = (s) => s.replace(/\s+/g, "-");

function formatDate(value) {
  try {
    const d = new Date(value);
    return d.toLocaleString("el-GR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

function shortDate(value) {
  try {
    return new Date(value).toLocaleDateString("el-GR", {
      day: "2-digit",
      month: "short",
    });
  } catch {
    return value;
  }
}

function LoginScreen({ onSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${API}/admin/login`, { password });
      localStorage.setItem(TOKEN_KEY, res.data.token);
      onSuccess(res.data.token);
    } catch {
      setError("Λάθος κωδικός. Δοκίμασε ξανά.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-body antialiased flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link
          to="/"
          data-testid="admin-back-home"
          className="inline-flex items-center gap-2 text-xs font-semibold text-ink/50 hover:text-ink transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Πίσω στο site
        </Link>
        <form
          onSubmit={submit}
          data-testid="admin-login-form"
          className="mt-5 rounded-[1.75rem] border border-ink/8 bg-white shadow-2xl shadow-ink/10 p-8"
        >
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-baby text-ink">
            <Lock className="h-5 w-5" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-semibold tracking-tight">Admin Login</h1>
          <p className="mt-1.5 text-sm text-ink/55">
            Εισάγετε τον κωδικό για να δείτε τα μηνύματα επικοινωνίας.
          </p>
          <label htmlFor="admin-password" className="mt-6 mb-1.5 block text-xs uppercase tracking-[0.2em] font-semibold text-ink/50">
            Κωδικός
          </label>
          <input
            id="admin-password"
            data-testid="admin-password-input"
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl border border-ink/10 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink/35 outline-none transition-[border-color,box-shadow] duration-300 focus:border-baby-dark focus:ring-4 focus:ring-baby/25"
          />
          {error && (
            <p data-testid="admin-login-error" className="mt-3 text-sm font-semibold text-red-500">{error}</p>
          )}
          <button
            type="submit"
            data-testid="admin-login-button"
            disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white transition-[transform,opacity] duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Σύνδεση…" : "Σύνδεση"}
          </button>
        </form>
      </div>
    </div>
  );
}

function StatusSelect({ value, onChange, disabled, testid }) {
  const status = value || "New";
  return (
    <div className={`relative inline-flex items-center gap-2 rounded-full border pl-3 pr-2 py-1.5 text-xs font-bold transition-colors ${STATUS_RING[status]}`}>
      <span className={`h-2 w-2 rounded-full ${STATUS_DOT[status]}`} />
      <select
        data-testid={testid}
        value={status}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-transparent pr-4 text-ink outline-none cursor-pointer disabled:cursor-wait"
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-ink/40" />
    </div>
  );
}

function KanbanCard({ lead, onOpen, onDragStart, onDragEnd, dragging, selected, onToggleSelect }) {
  return (
    <div
      data-testid={`admin-kanban-card-${lead.id}`}
      draggable
      onDragStart={(e) => onDragStart(e, lead.id)}
      onDragEnd={onDragEnd}
      onClick={() => onOpen(lead.id)}
      className={`group cursor-pointer rounded-xl border bg-white p-3.5 shadow-sm transition-[box-shadow,transform,opacity] hover:shadow-md hover:-translate-y-0.5 ${
        dragging ? "opacity-40" : ""
      } ${selected ? "border-baby-dark ring-2 ring-baby/40" : "border-ink/8"}`}
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect(lead.id);
          }}
          data-testid={`admin-select-${lead.id}`}
          aria-pressed={selected}
          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
            selected ? "bg-ink border-ink text-white" : "border-ink/25 text-transparent hover:border-ink/50"
          }`}
        >
          <Check className="h-3 w-3" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-sm text-ink">{lead.company || lead.name}</p>
          {lead.company && (
            <p className="mt-0.5 truncate text-xs text-ink/50">{lead.name}</p>
          )}
          <div className="mt-1.5 space-y-1">
            {lead.phone ? (
              <a
                href={`tel:${lead.phone}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 text-xs font-medium text-ink/70 hover:text-baby-dark"
              >
                <Phone className="h-3 w-3 shrink-0 text-baby-dark" />
                <span className="truncate">{lead.phone}</span>
              </a>
            ) : (
              <p className="flex items-center gap-1.5 text-xs text-ink/30">
                <Phone className="h-3 w-3 shrink-0" />
                —
              </p>
            )}
            <a
              href={`mailto:${lead.email}`}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-xs text-ink/55 hover:text-baby-dark"
            >
              <Mail className="h-3 w-3 shrink-0" />
              <span className="truncate">{lead.email}</span>
            </a>
          </div>
          <div className="mt-2.5 flex items-center justify-end gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] text-ink/40">
              <Calendar className="h-3 w-3" />
              {shortDate(lead.created_at)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailModal({ lead, onClose, onUpdate }) {
  const [notes, setNotes] = useState(lead.notes || "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [savedNotes, setSavedNotes] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);

  useEffect(() => {
    setNotes(lead.notes || "");
  }, [lead.id, lead.notes]);

  const notesDirty = notes !== (lead.notes || "");

  const changeStatus = async (status) => {
    setSavingStatus(true);
    await onUpdate(lead.id, { status });
    setSavingStatus(false);
  };
  const saveNotes = async () => {
    setSavingNotes(true);
    await onUpdate(lead.id, { notes });
    setSavingNotes(false);
    setSavedNotes(true);
    setTimeout(() => setSavedNotes(false), 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/40 backdrop-blur-sm p-0 sm:p-6"
      onClick={onClose}
      data-testid="admin-detail-modal"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-[1.75rem] sm:rounded-[1.75rem] bg-white shadow-2xl"
      >
        <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-ink/8 bg-white/90 backdrop-blur px-6 py-5">
          <div>
            <h2 className="font-display text-xl font-semibold tracking-tight">{lead.company || lead.name}</h2>
            {lead.company && (
              <p className="mt-0.5 text-xs text-ink/50">{lead.name}</p>
            )}
          </div>
          <button
            onClick={onClose}
            data-testid="admin-detail-close"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/10 text-ink/60 transition-colors hover:bg-mist"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
            <div>
              <span className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-ink/45">Εταιρεία</span>
              <p className="mt-1 text-sm font-medium text-ink">{lead.company || "—"}</p>
            </div>
            <div>
              <span className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-ink/45">Όνομα</span>
              <p className="mt-1 text-sm font-medium text-ink">{lead.name}</p>
            </div>
            <div>
              <span className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-ink/45">Email</span>
              <a href={`mailto:${lead.email}`} className="mt-1 flex items-center gap-1.5 text-sm font-medium text-baby-dark hover:underline break-all">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                {lead.email}
              </a>
            </div>
            <div>
              <span className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-ink/45">Τηλέφωνο</span>
              {lead.phone ? (
                <a href={`tel:${lead.phone}`} className="mt-1 flex items-center gap-1.5 text-sm font-medium text-baby-dark hover:underline">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  {lead.phone}
                </a>
              ) : (
                <p className="mt-1 text-sm text-ink/40">—</p>
              )}
            </div>
            <div>
              <span className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-ink/45">Ημερομηνία</span>
              <p className="mt-1 text-sm text-ink/70">{formatDate(lead.created_at)}</p>
            </div>
            <div>
              <span className="block text-[11px] uppercase tracking-[0.2em] font-semibold text-ink/45">Επικοινωνία</span>
              <p className="mt-1 text-sm text-ink/70">{lead.contacted_at ? formatDate(lead.contacted_at) : "—"}</p>
            </div>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-ink/45">Μήνυμα</span>
            <p className="mt-1.5 rounded-xl bg-mist/50 px-4 py-3 text-sm text-ink/75 leading-relaxed whitespace-pre-line">
              {lead.message}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-ink/45">Κατάσταση</span>
            <div className="flex items-center gap-2">
              {savingStatus && <Loader2 className="h-3.5 w-3.5 animate-spin text-ink/40" />}
              <StatusSelect value={lead.status} disabled={savingStatus} onChange={changeStatus} testid="admin-detail-status" />
            </div>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-ink/45">Σημειώσεις</span>
            <textarea
              data-testid="admin-detail-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Πρόσθεσε σημειώσεις για αυτό το lead…"
              className="mt-1.5 w-full resize-y rounded-xl border border-ink/10 bg-mist/40 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/35 outline-none transition-[border-color,box-shadow] duration-300 focus:border-baby-dark focus:bg-white focus:ring-4 focus:ring-baby/20"
            />
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                data-testid="admin-detail-notes-save"
                onClick={saveNotes}
                disabled={!notesDirty || savingNotes}
                className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-1.5 text-xs font-bold text-white transition-[transform,opacity] duration-300 hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
              >
                {savingNotes ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : savedNotes ? <Check className="h-3.5 w-3.5" /> : null}
                {savedNotes ? "Αποθηκεύτηκε" : "Αποθήκευση"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options, testid }) {
  return (
    <div className="relative">
      <label className="mb-1 block text-[10px] uppercase tracking-[0.2em] font-semibold text-ink/45">{label}</label>
      <div className="relative">
        <select
          data-testid={testid}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none w-full rounded-xl border border-ink/10 bg-white pl-3.5 pr-9 py-2.5 text-sm font-medium text-ink outline-none cursor-pointer transition-[border-color,box-shadow] duration-300 focus:border-baby-dark focus:ring-4 focus:ring-baby/20"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, testid }) {
  return (
    <div data-testid={testid} className="flex items-center gap-3 rounded-2xl border border-ink/8 bg-white px-4 py-3.5">
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-baby-light text-baby-dark">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[11px] uppercase tracking-[0.15em] font-semibold text-ink/45">{label}</p>
        <p className="text-lg font-bold text-ink">{value}</p>
      </div>
    </div>
  );
}

function LeadsChart({ data }) {
  return (
    <div data-testid="admin-leads-chart" className="rounded-2xl border border-ink/8 bg-white p-4">
      <p className="mb-2 text-[11px] uppercase tracking-[0.15em] font-semibold text-ink/45">
        Μηνύματα · τελευταίες 14 μέρες
      </p>
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
          <defs>
            <linearGradient id="leadsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4FB3E3" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#4FB3E3" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#9199a6" }} axisLine={false} tickLine={false} interval={1} />
          <YAxis hide allowDecimals={false} />
          <Tooltip formatter={(v) => [v, "Μηνύματα"]} labelStyle={{ fontSize: 12 }} contentStyle={{ fontSize: 12, borderRadius: 10 }} />
          <Area type="monotone" dataKey="count" stroke="#4FB3E3" strokeWidth={2} fill="url(#leadsFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function Dashboard({ token, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedId, setSelectedId] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API}/admin/contacts`, { headers: { "X-Admin-Token": token } });
      setMessages(res.data);
    } catch (err) {
      if (err?.response?.status === 401) {
        onLogout();
        return;
      }
      setError("Δεν ήταν δυνατή η φόρτωση των μηνυμάτων.");
    } finally {
      setLoading(false);
    }
  }, [token, onLogout]);

  useEffect(() => {
    load();
  }, [load]);

  const updateLead = useCallback(
    async (id, patch) => {
      const prev = messages;
      // optimistic update for snappy drag/drop
      setMessages((cur) => cur.map((m) => (m.id === id ? { ...m, ...patch } : m)));
      try {
        const res = await axios.patch(`${API}/admin/contacts/${id}`, patch, {
          headers: { "X-Admin-Token": token },
        });
        setMessages((cur) => cur.map((m) => (m.id === id ? res.data : m)));
      } catch (err) {
        setMessages(prev); // rollback
        if (err?.response?.status === 401) onLogout();
        else setError("Η αποθήκευση απέτυχε. Δοκίμασε ξανά.");
      }
    },
    [token, onLogout, messages]
  );

  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);
  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);
  const bulkSetStatus = useCallback(
    async (status) => {
      const ids = Array.from(selectedIds);
      await Promise.all(ids.map((id) => updateLead(id, { status })));
      clearSelection();
    },
    [selectedIds, updateLead, clearSelection]
  );

  const visible = useMemo(() => {
    return messages.filter((m) => {
      if (search) {
        const q = search.trim().toLowerCase();
        const haystack = `${m.name} ${m.email} ${m.company || ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (dateFrom && new Date(m.created_at) < new Date(dateFrom)) return false;
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999);
        if (new Date(m.created_at) > to) return false;
      }
      return true;
    });
  }, [messages, search, dateFrom, dateTo]);

  const stats = useMemo(() => {
    const total = messages.length;
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const newThisWeek = messages.filter((m) => new Date(m.created_at).getTime() >= weekAgo).length;
    const converted = messages.filter((m) => m.status === "Converted").length;
    const conversionRate = total ? Math.round((converted / total) * 100) : 0;
    const responded = messages.filter((m) => m.contacted_at);
    let avgResponse = "—";
    if (responded.length) {
      const totalMinutes = responded.reduce(
        (sum, m) => sum + (new Date(m.contacted_at).getTime() - new Date(m.created_at).getTime()) / 60000,
        0
      );
      const avgMinutes = totalMinutes / responded.length;
      avgResponse = avgMinutes < 60 ? `${Math.round(avgMinutes)} λεπτά` : `${(avgMinutes / 60).toFixed(1)} ώρες`;
    }
    return { total, newThisWeek, conversionRate: `${conversionRate}%`, avgResponse };
  }, [messages]);

  const chartData = useMemo(() => {
    const days = 14;
    const buckets = [];
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(start);
      d.setDate(d.getDate() - i);
      buckets.push({
        key: d.toISOString().slice(0, 10),
        label: d.toLocaleDateString("el-GR", { day: "2-digit", month: "2-digit" }),
        count: 0,
      });
    }
    const byKey = new Map(buckets.map((b) => [b.key, b]));
    messages.forEach((m) => {
      const key = new Date(m.created_at).toISOString().slice(0, 10);
      const bucket = byKey.get(key);
      if (bucket) bucket.count += 1;
    });
    return buckets;
  }, [messages]);

  const columns = useMemo(() => {
    const byDate = (a, b) => {
      const da = new Date(a.created_at).getTime();
      const db2 = new Date(b.created_at).getTime();
      return sortOrder === "newest" ? db2 - da : da - db2;
    };
    return STATUS_OPTIONS.map((status) => ({
      status,
      items: visible.filter((m) => (m.status || "New") === status).sort(byDate),
    }));
  }, [visible, sortOrder]);

  const selectedLead = useMemo(
    () => messages.find((m) => m.id === selectedId) || null,
    [messages, selectedId]
  );

  const onDragStart = (e, id) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
    setDraggingId(id);
  };
  const onDragEnd = () => {
    setDraggingId(null);
    setDragOverCol(null);
  };
  const onDropTo = (status, e) => {
    const id = draggingId || (e && e.dataTransfer && e.dataTransfer.getData("text/plain"));
    setDragOverCol(null);
    setDraggingId(null);
    if (!id) return;
    const lead = messages.find((m) => m.id === id);
    if (lead && (lead.status || "New") !== status) updateLead(id, { status });
  };

  const exportCSV = () => {
    const headers = ["Όνομα", "Email", "Τηλέφωνο", "Εταιρεία", "Status", "Μήνυμα", "Σημειώσεις", "Ημερομηνία", "Επικοινωνία"];
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = visible.map((m) => [
      m.name, m.email, m.phone || "", m.company || "", m.status || "New", m.message, m.notes || "", formatDate(m.created_at), m.contacted_at ? formatDate(m.contacted_at) : "",
    ]);
    const csv = [headers, ...rows].map((r) => r.map(esc).join(",")).join("\r\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kndp-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const sortOptions = [
    { value: "newest", label: "Νεότερα πρώτα" },
    { value: "oldest", label: "Παλαιότερα πρώτα" },
  ];

  return (
    <div className="min-h-screen bg-paper text-ink font-body antialiased">
      <header className="sticky top-0 z-20 border-b border-ink/8 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 md:px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-2xl tracking-tighter flex items-center gap-1">
              KNDP<span className="h-2.5 w-2.5 rounded-full bg-baby translate-y-1" />
            </span>
            <span className="hidden sm:inline text-sm font-semibold text-ink/45">/ Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={load} data-testid="admin-refresh-button" className="inline-flex items-center gap-2 rounded-full border border-ink/12 px-4 py-2 text-xs font-bold text-ink transition-colors hover:bg-mist">
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />Ανανέωση
            </button>
            <Link to="/" className="hidden sm:inline-flex items-center gap-2 rounded-full border border-ink/12 px-4 py-2 text-xs font-bold text-ink transition-colors hover:bg-mist">
              <ArrowLeft className="h-3.5 w-3.5" />Site
            </Link>
            <button onClick={onLogout} data-testid="admin-logout-button" className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-bold text-white transition-transform hover:scale-105">
              <LogOut className="h-3.5 w-3.5" />Έξοδος
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 md:px-10 py-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">Μηνύματα Επικοινωνίας</h1>
            <p className="mt-1.5 text-sm text-ink/55">Σύρε μια κάρτα για να αλλάξεις κατάσταση · κάνε κλικ για λεπτομέρειες.</p>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <div className="w-40">
              <FilterSelect label="Ταξινόμηση" value={sortOrder} onChange={setSortOrder} options={sortOptions} testid="admin-sort" />
            </div>
            <button type="button" onClick={exportCSV} data-testid="admin-export-csv" disabled={visible.length === 0} className="inline-flex items-center justify-center gap-2 rounded-xl bg-baby px-5 py-2.5 text-sm font-bold text-ink transition-[transform,opacity] duration-300 hover:scale-[1.03] disabled:opacity-40 disabled:hover:scale-100">
              <Download className="h-4 w-4" />Export CSV
            </button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard icon={Users} label="Σύνολο Leads" value={stats.total} testid="admin-stat-total" />
          <StatCard icon={TrendingUp} label="Νέα (7 μέρες)" value={stats.newThisWeek} testid="admin-stat-new" />
          <StatCard icon={Check} label="Ποσοστό Μετατροπής" value={stats.conversionRate} testid="admin-stat-conversion" />
          <StatCard icon={Clock} label="Μέσος Χρόνος Απάντησης" value={stats.avgResponse} testid="admin-stat-response" />
        </div>

        <div className="mt-4">
          <LeadsChart data={chartData} />
        </div>

        <div className="mt-6 flex flex-wrap items-end gap-3">
          <div className="relative w-full max-w-xs">
            <label className="mb-1 block text-[10px] uppercase tracking-[0.2em] font-semibold text-ink/45">Αναζήτηση</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
              <input
                data-testid="admin-search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Όνομα, email ή εταιρεία…"
                className="w-full rounded-xl border border-ink/10 bg-white pl-9 pr-3.5 py-2.5 text-sm text-ink placeholder:text-ink/35 outline-none transition-[border-color,box-shadow] duration-300 focus:border-baby-dark focus:ring-4 focus:ring-baby/20"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-[0.2em] font-semibold text-ink/45">Από</label>
            <input
              type="date"
              data-testid="admin-date-from"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="rounded-xl border border-ink/10 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-[border-color,box-shadow] duration-300 focus:border-baby-dark focus:ring-4 focus:ring-baby/20"
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-[0.2em] font-semibold text-ink/45">Έως</label>
            <input
              type="date"
              data-testid="admin-date-to"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="rounded-xl border border-ink/10 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-[border-color,box-shadow] duration-300 focus:border-baby-dark focus:ring-4 focus:ring-baby/20"
            />
          </div>
          {(search || dateFrom || dateTo) && (
            <button
              type="button"
              data-testid="admin-clear-filters"
              onClick={() => { setSearch(""); setDateFrom(""); setDateTo(""); }}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink/12 px-4 py-2.5 text-xs font-bold text-ink/60 transition-colors hover:bg-mist"
            >
              <X className="h-3.5 w-3.5" />Καθαρισμός
            </button>
          )}
        </div>

        {selectedIds.size > 0 && (
          <div data-testid="admin-bulk-bar" className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-baby/40 bg-baby-light px-5 py-3.5">
            <span className="text-sm font-bold text-ink">{selectedIds.size} επιλεγμένα</span>
            <div className="flex flex-wrap items-center gap-2">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  data-testid={`admin-bulk-${safeId(s)}`}
                  onClick={() => bulkSetStatus(s)}
                  className="rounded-full bg-white border border-ink/10 px-3.5 py-1.5 text-xs font-bold text-ink transition-colors hover:border-baby-dark"
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              type="button"
              data-testid="admin-bulk-clear"
              onClick={clearSelection}
              className="ml-auto inline-flex items-center gap-1.5 text-xs font-bold text-ink/50 hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />Άκυρο
            </button>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">{error}</div>
        )}

        {loading ? (
          <div className="mt-20 flex flex-col items-center justify-center text-ink/40">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="mt-3 text-sm font-semibold">Φόρτωση…</p>
          </div>
        ) : messages.length === 0 ? (
          <div data-testid="admin-empty" className="mt-10 rounded-[1.75rem] border border-dashed border-ink/15 bg-white/60 px-8 py-16 text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-mist text-ink/40"><Inbox className="h-6 w-6" /></span>
            <p className="mt-4 font-display text-lg font-medium">Κανένα μήνυμα ακόμη</p>
            <p className="mt-1 text-sm text-ink/50">Τα νέα μηνύματα από τη φόρμα θα εμφανίζονται εδώ.</p>
          </div>
        ) : visible.length === 0 ? (
          <div data-testid="admin-no-results" className="mt-10 rounded-[1.75rem] border border-dashed border-ink/15 bg-white/60 px-8 py-16 text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-mist text-ink/40"><Search className="h-6 w-6" /></span>
            <p className="mt-4 font-display text-lg font-medium">Δεν βρέθηκαν αποτελέσματα</p>
            <p className="mt-1 text-sm text-ink/50">Δοκίμασε διαφορετική αναζήτηση ή εύρος ημερομηνιών.</p>
          </div>
        ) : (
          <div data-testid="admin-kanban" className="mt-8 flex gap-4 overflow-x-auto pb-4 scrollbar-none">
            {columns.map(({ status, items }) => {
              const meta = STATUS_META[status];
              const isOver = dragOverCol === status;
              return (
                <div
                  key={status}
                  data-testid={`admin-column-${safeId(status)}`}
                  onDragOver={(e) => { e.preventDefault(); setDragOverCol(status); }}
                  onDragLeave={(e) => { if (e.currentTarget === e.target) setDragOverCol(null); }}
                  onDrop={(e) => onDropTo(status, e)}
                  className={`flex w-72 shrink-0 flex-col rounded-2xl border transition-colors ${
                    isOver ? "border-baby-dark bg-baby-light/40" : "border-ink/8 bg-mist/40"
                  }`}
                >
                  <div className={`flex items-center justify-between gap-2 rounded-t-2xl border-b px-4 py-3 ${meta.head}`}>
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} />
                      <span className="text-sm font-bold text-ink">{status}</span>
                    </div>
                    <span className={`inline-flex min-w-6 items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold ${meta.chip}`}>
                      {items.length}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-2.5 p-3 min-h-[120px]">
                    {items.length === 0 ? (
                      <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-ink/10 py-8 text-xs text-ink/30">
                        {isOver ? "Άφησε εδώ" : "Κενό"}
                      </div>
                    ) : (
                      items.map((lead) => (
                        <KanbanCard
                          key={lead.id}
                          lead={lead}
                          onOpen={setSelectedId}
                          onDragStart={onDragStart}
                          onDragEnd={onDragEnd}
                          dragging={draggingId === lead.id}
                          selected={selectedIds.has(lead.id)}
                          onToggleSelect={toggleSelect}
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {selectedLead && (
        <DetailModal lead={selectedLead} onClose={() => setSelectedId(null)} onUpdate={updateLead} />
      )}
    </div>
  );
}

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  if (!token) return <LoginScreen onSuccess={setToken} />;
  return <Dashboard token={token} onLogout={logout} />;
}
