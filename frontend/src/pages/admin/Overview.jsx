import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Users, FolderKanban, Wallet, AlertCircle, Calendar, RefreshCw } from "lucide-react";
import { API, authCfg, SectionHeader, eur, fmtDate, INVOICE_STATUS_LABEL, INVOICE_STATUS_CHIP } from "./shared";

function Stat({ icon: Icon, label, value, tone }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-ink/8 bg-white px-4 py-4">
      <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone || "bg-baby-light text-baby-dark"}`}><Icon className="h-4 w-4" /></span>
      <div className="min-w-0">
        <p className="truncate text-[11px] uppercase tracking-[0.15em] font-semibold text-ink/45">{label}</p>
        <p className="text-xl font-bold text-ink">{value}</p>
      </div>
    </div>
  );
}

export default function Overview({ token, clientNameById }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/admin/overview`, authCfg(token));
      setData(res.data);
    } finally { setLoading(false); }
  }, [token]);
  useEffect(() => { load(); }, [load]);

  if (loading || !data) {
    return <div className="mt-20 flex justify-center text-ink/40"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div data-testid="overview-section">
      <SectionHeader
        title="Επισκόπηση"
        subtitle="Μια γρήγορη ματιά στο πρακτορείο σου."
        action={<button onClick={load} className="inline-flex items-center gap-2 rounded-full border border-ink/12 px-4 py-2 text-xs font-bold text-ink hover:bg-mist"><RefreshCw className="h-3.5 w-3.5" />Ανανέωση</button>}
      />

      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat icon={FolderKanban} label="Ενεργά έργα" value={data.active_projects} />
        <Stat icon={Users} label="Πελάτες" value={data.clients_total} />
        <Stat icon={Wallet} label="Έσοδα (μήνας)" value={eur(data.revenue_this_month)} tone="bg-emerald-100 text-emerald-700" />
        <Stat icon={AlertCircle} label="Εκκρεμότητες" value={eur(data.outstanding)} tone="bg-rose-100 text-rose-600" />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-ink/8 bg-white p-5">
          <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-baby-dark" /><h3 className="font-display text-lg font-semibold">Επερχόμενες προθεσμίες</h3></div>
          <div className="mt-3 space-y-2" data-testid="overview-deadlines">
            {data.upcoming_deadlines.length === 0 ? (
              <p className="py-6 text-center text-sm text-ink/40">Καμία προθεσμία.</p>
            ) : data.upcoming_deadlines.map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-xl bg-mist/50 px-3.5 py-2.5">
                <div className="min-w-0"><p className="truncate text-sm font-semibold text-ink">{d.name}</p>{clientNameById && clientNameById(d.client_id) && <p className="truncate text-xs text-ink/50">{clientNameById(d.client_id)}</p>}</div>
                <span className="shrink-0 text-xs font-bold text-ink/60">{fmtDate(d.deadline)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-ink/8 bg-white p-5">
          <div className="flex items-center gap-2"><Wallet className="h-4 w-4 text-baby-dark" /><h3 className="font-display text-lg font-semibold">Απλήρωτα τιμολόγια</h3></div>
          <div className="mt-3 space-y-2" data-testid="overview-unpaid">
            {data.unpaid_invoices.length === 0 ? (
              <p className="py-6 text-center text-sm text-ink/40">Καμία εκκρεμότητα.</p>
            ) : data.unpaid_invoices.map((i) => (
              <div key={i.id} className="flex items-center justify-between rounded-xl bg-mist/50 px-3.5 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{i.number || "Τιμολόγιο"}{clientNameById && clientNameById(i.client_id) ? ` · ${clientNameById(i.client_id)}` : ""}</p>
                  <p className="text-xs text-ink/50">Λήξη: {fmtDate(i.due_date)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-sm font-bold text-ink">{eur((i.amount || 0) - (i.amount_paid || 0))}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${INVOICE_STATUS_CHIP[i.status]}`}>{INVOICE_STATUS_LABEL[i.status] || i.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
