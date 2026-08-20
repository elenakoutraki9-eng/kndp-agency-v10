import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Lock,
  ArrowLeft,
  LogOut,
  RefreshCw,
  Inbox,
  Mail,
  Building2,
  Loader2,
  Download,
  Check,
  ChevronDown,
} from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const TOKEN_KEY = "kndp_admin_token";

const STATUS_OPTIONS = ["New", "Contacted", "Converted", "Not Interested"];
const STATUS_DOT = {
  New: "bg-sky-400",
  Contacted: "bg-amber-400",
  Converted: "bg-emerald-500",
  "Not Interested": "bg-ink/25",
};
const STATUS_RING = {
  New: "border-sky-300 bg-sky-50",
  Contacted: "border-amber-300 bg-amber-50",
  Converted: "border-emerald-300 bg-emerald-50",
  "Not Interested": "border-ink/15 bg-mist",
};

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
      const token = res.data.token;
      localStorage.setItem(TOKEN_KEY, token);
      onSuccess(token);
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
          <h1 className="mt-5 font-display text-2xl font-semibold tracking-tight">
            Admin Login
          </h1>
          <p className="mt-1.5 text-sm text-ink/55">
            Εισάγετε τον κωδικό για να δείτε τα μηνύματα επικοινωνίας.
          </p>

          <label
            htmlFor="admin-password"
            className="mt-6 mb-1.5 block text-xs uppercase tracking-[0.2em] font-semibold text-ink/50"
          >
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
            <p data-testid="admin-login-error" className="mt-3 text-sm font-semibold text-red-500">
              {error}
            </p>
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
    <div
      className={`relative inline-flex items-center gap-2 rounded-full border pl-3 pr-2 py-1.5 text-xs font-bold transition-colors ${STATUS_RING[status]}`}
    >
      <span className={`h-2 w-2 rounded-full ${STATUS_DOT[status]}`} />
      <select
        data-testid={testid}
        value={status}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-transparent pr-4 text-ink outline-none cursor-pointer disabled:cursor-wait"
      >
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-ink/40" />
    </div>
  );
}

function LeadCard({ lead, index, onUpdate }) {
  const [notes, setNotes] = useState(lead.notes || "");
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [savedNotes, setSavedNotes] = useState(false);
  const isNew = (lead.status || "New") === "New";

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
      data-testid={`admin-card-${index}`}
      className={`relative rounded-[1.5rem] p-5 md:p-6 shadow-sm transition-shadow hover:shadow-md ${
        isNew
          ? "border-2 border-baby-dark bg-baby-light/30 ring-4 ring-baby/20"
          : "border border-ink/8 bg-white"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-display text-lg font-semibold tracking-tight">{lead.name}</p>
            {isNew && (
              <span
                data-testid={`admin-new-badge-${index}`}
                className="inline-flex items-center gap-1 rounded-full bg-baby-dark px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                New
              </span>
            )}
          </div>
          {lead.company && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-ink/45">
              <Building2 className="h-3 w-3" />
              {lead.company}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          {lead.service ? (
            <span className="inline-flex rounded-full bg-baby-light border border-baby/40 px-3 py-1 text-xs font-bold text-baby-dark">
              {lead.service}
            </span>
          ) : (
            <span className="text-xs text-ink/30">—</span>
          )}
          <span className="text-xs text-ink/40">{formatDate(lead.created_at)}</span>
        </div>
      </div>

      <a
        href={`mailto:${lead.email}`}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-baby-dark hover:underline"
      >
        <Mail className="h-3.5 w-3.5" />
        {lead.email}
      </a>

      <p className="mt-3 text-sm text-ink/70 leading-relaxed whitespace-pre-line">{lead.message}</p>

      <div className="mt-5 border-t border-ink/8 pt-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-ink/45">
            Κατάσταση
          </span>
          <div className="flex items-center gap-2">
            {savingStatus && <Loader2 className="h-3.5 w-3.5 animate-spin text-ink/40" />}
            <StatusSelect
              value={lead.status}
              disabled={savingStatus}
              onChange={changeStatus}
              testid={`admin-status-select-${index}`}
            />
          </div>
        </div>

        <div className="mt-4">
          <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-ink/45">
            Σημειώσεις
          </span>
          <textarea
            data-testid={`admin-notes-${index}`}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Πρόσθεσε σημειώσεις για αυτό το lead…"
            className="mt-1.5 w-full resize-y rounded-xl border border-ink/10 bg-mist/40 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/35 outline-none transition-[border-color,box-shadow] duration-300 focus:border-baby-dark focus:bg-white focus:ring-4 focus:ring-baby/20"
          />
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              data-testid={`admin-notes-save-${index}`}
              onClick={saveNotes}
              disabled={!notesDirty || savingNotes}
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-1.5 text-xs font-bold text-white transition-[transform,opacity] duration-300 hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
            >
              {savingNotes ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : savedNotes ? (
                <Check className="h-3.5 w-3.5" />
              ) : null}
              {savedNotes ? "Αποθηκεύτηκε" : "Αποθήκευση"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options, testid }) {
  return (
    <div className="relative">
      <label className="mb-1 block text-[10px] uppercase tracking-[0.2em] font-semibold text-ink/45">
        {label}
      </label>
      <div className="relative">
        <select
          data-testid={testid}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none w-full rounded-xl border border-ink/10 bg-white pl-3.5 pr-9 py-2.5 text-sm font-medium text-ink outline-none cursor-pointer transition-[border-color,box-shadow] duration-300 focus:border-baby-dark focus:ring-4 focus:ring-baby/20"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
      </div>
    </div>
  );
}

function Dashboard({ token, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [serviceFilter, setServiceFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API}/admin/contacts`, {
        headers: { "X-Admin-Token": token },
      });
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
      try {
        const res = await axios.patch(`${API}/admin/contacts/${id}`, patch, {
          headers: { "X-Admin-Token": token },
        });
        setMessages((prev) => prev.map((m) => (m.id === id ? res.data : m)));
      } catch (err) {
        if (err?.response?.status === 401) onLogout();
        else setError("Η αποθήκευση απέτυχε. Δοκίμασε ξανά.");
      }
    },
    [token, onLogout]
  );

  const services = useMemo(() => {
    const set = new Set(messages.map((m) => m.service).filter(Boolean));
    return Array.from(set).sort();
  }, [messages]);

  const newCount = useMemo(
    () => messages.filter((m) => (m.status || "New") === "New").length,
    [messages]
  );

  const filtered = useMemo(() => {
    let list = messages.filter((m) => {
      const s = m.status || "New";
      const okStatus = statusFilter === "All" || s === statusFilter;
      const okService = serviceFilter === "All" || m.service === serviceFilter;
      return okStatus && okService;
    });
    list = [...list].sort((a, b) => {
      const aNew = (a.status || "New") === "New" ? 0 : 1;
      const bNew = (b.status || "New") === "New" ? 0 : 1;
      if (aNew !== bNew) return aNew - bNew; // New leads always first
      const da = new Date(a.created_at).getTime();
      const db2 = new Date(b.created_at).getTime();
      return sortOrder === "newest" ? db2 - da : da - db2;
    });
    return list;
  }, [messages, statusFilter, serviceFilter, sortOrder]);

  const exportCSV = () => {
    const headers = [
      "Όνομα",
      "Εταιρεία",
      "Email",
      "Υπηρεσία",
      "Status",
      "Μήνυμα",
      "Σημειώσεις",
      "Ημερομηνία",
    ];
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = filtered.map((m) => [
      m.name,
      m.company || "",
      m.email,
      m.service || "",
      m.status || "New",
      m.message,
      m.notes || "",
      formatDate(m.created_at),
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

  const statusOptions = [
    { value: "All", label: "Όλα τα status" },
    ...STATUS_OPTIONS.map((s) => ({ value: s, label: s })),
  ];
  const serviceOptions = [
    { value: "All", label: "Όλες οι υπηρεσίες" },
    ...services.map((s) => ({ value: s, label: s })),
  ];
  const sortOptions = [
    { value: "newest", label: "Νεότερα πρώτα" },
    { value: "oldest", label: "Παλαιότερα πρώτα" },
  ];

  return (
    <div className="min-h-screen bg-paper text-ink font-body antialiased">
      <header className="sticky top-0 z-10 border-b border-ink/8 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 md:px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-2xl tracking-tighter flex items-center gap-1">
              KNDP
              <span className="h-2.5 w-2.5 rounded-full bg-baby translate-y-1" />
            </span>
            <span className="hidden sm:inline text-sm font-semibold text-ink/45">
              / Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              data-testid="admin-refresh-button"
              className="inline-flex items-center gap-2 rounded-full border border-ink/12 px-4 py-2 text-xs font-bold text-ink transition-colors hover:bg-mist"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Ανανέωση
            </button>
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-2 rounded-full border border-ink/12 px-4 py-2 text-xs font-bold text-ink transition-colors hover:bg-mist"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Site
            </Link>
            <button
              onClick={onLogout}
              data-testid="admin-logout-button"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-bold text-white transition-transform hover:scale-105"
            >
              <LogOut className="h-3.5 w-3.5" />
              Έξοδος
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 md:px-10 py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
              Μηνύματα Επικοινωνίας
            </h1>
            <p className="mt-1.5 text-sm text-ink/55">
              Όλα τα leads από τη φόρμα επικοινωνίας.
            </p>
          </div>
          <div className="flex shrink-0 items-stretch gap-3">
            <button
              type="button"
              data-testid="admin-new-chip"
              onClick={() =>
                setStatusFilter((prev) => (prev === "New" ? "All" : "New"))
              }
              className={`rounded-2xl border px-5 py-3 text-center transition-colors ${
                statusFilter === "New"
                  ? "border-baby-dark bg-baby-dark text-white"
                  : newCount > 0
                  ? "border-baby-dark bg-baby-light text-ink hover:bg-baby"
                  : "border-ink/8 bg-white text-ink/40"
              }`}
            >
              <p
                data-testid="admin-new-count"
                className={`font-display text-2xl font-semibold leading-none ${
                  statusFilter === "New" ? "text-white" : "text-baby-dark"
                }`}
              >
                {newCount}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.2em] font-semibold">
                {statusFilter === "New" ? "Νέα ✕" : "Νέα"}
              </p>
            </button>
            <div className="rounded-2xl border border-ink/8 bg-white px-5 py-3 text-center shadow-sm">
              <p data-testid="admin-count" className="font-display text-2xl font-semibold text-ink leading-none">
                {filtered.length}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.2em] font-semibold text-ink/45">
                {statusFilter === "New" ? "Σε προβολή" : "Σύνολο"}
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-8 rounded-[1.5rem] border border-ink/8 bg-white p-4 md:p-5 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
              <FilterSelect
                label="Status"
                value={statusFilter}
                onChange={setStatusFilter}
                options={statusOptions}
                testid="admin-status-filter"
              />
              <FilterSelect
                label="Υπηρεσία"
                value={serviceFilter}
                onChange={setServiceFilter}
                options={serviceOptions}
                testid="admin-service-filter"
              />
              <FilterSelect
                label="Ταξινόμηση"
                value={sortOrder}
                onChange={setSortOrder}
                options={sortOptions}
                testid="admin-sort"
              />
            </div>
            <button
              type="button"
              onClick={exportCSV}
              data-testid="admin-export-csv"
              disabled={filtered.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-baby px-5 py-2.5 text-sm font-bold text-ink transition-[transform,opacity] duration-300 hover:scale-[1.03] disabled:opacity-40 disabled:hover:scale-100"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-16 flex flex-col items-center justify-center text-ink/40">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="mt-3 text-sm font-semibold">Φόρτωση…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div
            data-testid="admin-empty"
            className="mt-8 rounded-[1.75rem] border border-dashed border-ink/15 bg-white/60 px-8 py-16 text-center"
          >
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-mist text-ink/40">
              <Inbox className="h-6 w-6" />
            </span>
            <p className="mt-4 font-display text-lg font-medium">
              {messages.length === 0 ? "Κανένα μήνυμα ακόμη" : "Κανένα lead με αυτά τα φίλτρα"}
            </p>
            <p className="mt-1 text-sm text-ink/50">
              {messages.length === 0
                ? "Τα νέα μηνύματα από τη φόρμα θα εμφανίζονται εδώ."
                : "Δοκίμασε να αλλάξεις τα φίλτρα παραπάνω."}
            </p>
          </div>
        ) : (
          <div data-testid="admin-leads" className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((lead, i) => (
              <LeadCard key={lead.id} lead={lead} index={i} onUpdate={updateLead} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  if (!token) {
    return <LoginScreen onSuccess={setToken} />;
  }
  return <Dashboard token={token} onLogout={logout} />;
}
