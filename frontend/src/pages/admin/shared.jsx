import React from "react";
import { X } from "lucide-react";

export const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
export const authCfg = (token) => ({ headers: { "X-Admin-Token": token } });

export const PROJECT_STATUSES = ["Νέο", "Σχεδιασμός", "Ανάπτυξη", "Έλεγχος", "Ολοκληρωμένο"];
export const PROJECT_STATUS_META = {
  "Νέο": { dot: "bg-sky-400", head: "bg-sky-50 border-sky-200", chip: "bg-sky-100 text-sky-700" },
  "Σχεδιασμός": { dot: "bg-violet-400", head: "bg-violet-50 border-violet-200", chip: "bg-violet-100 text-violet-700" },
  "Ανάπτυξη": { dot: "bg-amber-400", head: "bg-amber-50 border-amber-200", chip: "bg-amber-100 text-amber-700" },
  "Έλεγχος": { dot: "bg-orange-400", head: "bg-orange-50 border-orange-200", chip: "bg-orange-100 text-orange-700" },
  "Ολοκληρωμένο": { dot: "bg-emerald-500", head: "bg-emerald-50 border-emerald-200", chip: "bg-emerald-100 text-emerald-700" },
};
export const PROJECT_TYPES = ["Ιστοσελίδα", "Web App", "Mobile App", "Εργαλείο", "Automation", "Άλλο"];

export const CLIENT_STATUSES = ["Active", "Past", "Prospect"];
export const CLIENT_STATUS_LABEL = { Active: "Ενεργός", Past: "Παλιός", Prospect: "Υποψήφιος" };
export const CLIENT_STATUS_CHIP = {
  Active: "bg-emerald-100 text-emerald-700",
  Past: "bg-ink/10 text-ink/60",
  Prospect: "bg-sky-100 text-sky-700",
};

export const INVOICE_STATUSES = ["Unpaid", "Partial", "Paid"];
export const INVOICE_STATUS_LABEL = { Unpaid: "Απλήρωτο", Partial: "Μερικώς", Paid: "Πληρωμένο" };
export const INVOICE_STATUS_CHIP = {
  Unpaid: "bg-rose-100 text-rose-600",
  Partial: "bg-amber-100 text-amber-700",
  Paid: "bg-emerald-100 text-emerald-700",
};

export const eur = (n) =>
  new Intl.NumberFormat("el-GR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(Number(n) || 0);

export const fmtDate = (v) => {
  if (!v) return "—";
  try {
    return new Date(v).toLocaleDateString("el-GR", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return v;
  }
};

export const inputCls =
  "w-full rounded-xl border border-ink/10 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/35 outline-none transition-[border-color,box-shadow] duration-300 focus:border-baby-dark focus:ring-4 focus:ring-baby/20";

export function Labeled({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] uppercase tracking-[0.2em] font-semibold text-ink/45">{label}</span>
      {children}
    </label>
  );
}

export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm text-ink/55">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Modal({ title, onClose, children, footer, wide, testid }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/40 backdrop-blur-sm p-0 sm:p-6"
      onClick={onClose}
      data-testid={testid}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${wide ? "sm:max-w-2xl" : "sm:max-w-lg"} max-h-[92vh] overflow-y-auto rounded-t-[1.75rem] sm:rounded-[1.75rem] bg-white shadow-2xl`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-ink/8 bg-white/90 backdrop-blur px-6 py-4">
          <h2 className="font-display text-xl font-semibold tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            data-testid="modal-close"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/10 text-ink/60 transition-colors hover:bg-mist"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">{children}</div>
        {footer && (
          <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t border-ink/8 bg-white/90 backdrop-blur px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, subtitle, testid }) {
  return (
    <div data-testid={testid} className="mt-10 rounded-[1.75rem] border border-dashed border-ink/15 bg-white/60 px-8 py-16 text-center">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-mist text-ink/40">
        <Icon className="h-6 w-6" />
      </span>
      <p className="mt-4 font-display text-lg font-medium">{title}</p>
      {subtitle && <p className="mt-1 text-sm text-ink/50">{subtitle}</p>}
    </div>
  );
}
