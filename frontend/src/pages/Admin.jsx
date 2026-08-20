import { useCallback, useEffect, useState } from "react";
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
} from "lucide-react";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const TOKEN_KEY = "kndp_admin_token";

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

function Dashboard({ token, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          <div className="shrink-0 rounded-2xl border border-ink/8 bg-white px-5 py-3 text-center shadow-sm">
            <p data-testid="admin-count" className="font-display text-2xl font-semibold text-baby-dark leading-none">
              {messages.length}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.2em] font-semibold text-ink/45">
              Leads
            </p>
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
        ) : messages.length === 0 ? (
          <div
            data-testid="admin-empty"
            className="mt-10 rounded-[1.75rem] border border-dashed border-ink/15 bg-white/60 px-8 py-16 text-center"
          >
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-mist text-ink/40">
              <Inbox className="h-6 w-6" />
            </span>
            <p className="mt-4 font-display text-lg font-medium">Κανένα μήνυμα ακόμη</p>
            <p className="mt-1 text-sm text-ink/50">
              Τα νέα μηνύματα από τη φόρμα θα εμφανίζονται εδώ.
            </p>
          </div>
        ) : (
          <>
            {/* Table on desktop */}
            <div className="mt-8 hidden md:block overflow-hidden rounded-[1.5rem] border border-ink/8 bg-white shadow-sm">
              <table data-testid="admin-table" className="w-full text-left">
                <thead>
                  <tr className="border-b border-ink/8 bg-mist/60 text-[11px] uppercase tracking-[0.15em] text-ink/45">
                    <th className="px-5 py-3.5 font-semibold">Όνομα</th>
                    <th className="px-5 py-3.5 font-semibold">Email</th>
                    <th className="px-5 py-3.5 font-semibold">Υπηρεσία</th>
                    <th className="px-5 py-3.5 font-semibold">Μήνυμα</th>
                    <th className="px-5 py-3.5 font-semibold whitespace-nowrap">Ημ/νία</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((m, i) => (
                    <tr
                      key={m.id}
                      data-testid={`admin-row-${i}`}
                      className="border-b border-ink/5 last:border-b-0 align-top transition-colors hover:bg-baby-light/40"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-sm">{m.name}</p>
                        {m.company && (
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-ink/45">
                            <Building2 className="h-3 w-3" />
                            {m.company}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <a
                          href={`mailto:${m.email}`}
                          className="text-sm font-medium text-baby-dark hover:underline"
                        >
                          {m.email}
                        </a>
                      </td>
                      <td className="px-5 py-4">
                        {m.service ? (
                          <span className="inline-flex rounded-full bg-baby-light border border-baby/40 px-3 py-1 text-xs font-bold text-baby-dark whitespace-nowrap">
                            {m.service}
                          </span>
                        ) : (
                          <span className="text-xs text-ink/30">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 max-w-md">
                        <p className="text-sm text-ink/70 leading-relaxed">{m.message}</p>
                      </td>
                      <td className="px-5 py-4 text-xs text-ink/45 whitespace-nowrap">
                        {formatDate(m.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards on mobile */}
            <div className="mt-8 space-y-3 md:hidden">
              {messages.map((m, i) => (
                <div
                  key={m.id}
                  data-testid={`admin-card-${i}`}
                  className="rounded-2xl border border-ink/8 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{m.name}</p>
                      {m.company && (
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-ink/45">
                          <Building2 className="h-3 w-3" />
                          {m.company}
                        </p>
                      )}
                    </div>
                    {m.service && (
                      <span className="shrink-0 inline-flex rounded-full bg-baby-light border border-baby/40 px-3 py-1 text-[11px] font-bold text-baby-dark">
                        {m.service}
                      </span>
                    )}
                  </div>
                  <a
                    href={`mailto:${m.email}`}
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-baby-dark"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    {m.email}
                  </a>
                  <p className="mt-3 text-sm text-ink/70 leading-relaxed">{m.message}</p>
                  <p className="mt-3 text-xs text-ink/40">{formatDate(m.created_at)}</p>
                </div>
              ))}
            </div>
          </>
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
