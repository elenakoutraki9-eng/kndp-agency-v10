import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { ArrowUpRight, Mail, CalendarClock, Send, Check } from "lucide-react";
import { WordMask, Reveal, Kicker, Magnetic } from "@/components/Reveal";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const serviceOptions = [
  { value: "Website", label: "Website" },
  { value: "Web Tool", label: "Web Tool" },
  { value: "App", label: "Mobile App" },
  { value: "Web App", label: "Web App" },
  { value: "Program", label: "Πρόγραμμα" },
  { value: "Custom Tool", label: "Έξυπνο Εργαλείο" },
  { value: "Automation", label: "Automation" },
  { value: "Something Else", label: "Κάτι Άλλο" },
];

const inputCls =
  "w-full rounded-xl border border-ink/10 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink/35 outline-none transition-[border-color,box-shadow] duration-300 focus:border-baby-dark focus:ring-4 focus:ring-baby/25";

export default function ContactSection(props) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", message: "" });
  const [service, setService] = useState(null);
  const [sending, setSending] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    try {
      await axios.post(`${API}/contact`, { ...form, service });
      toast.success("Το μήνυμα εστάλη — θα επικοινωνήσουμε σύντομα μαζί σου.");
      setForm({ name: "", email: "", phone: "", company: "", message: "" });
      setService(null);
    } catch {
      toast.error("Κάτι πήγε στραβά. Δοκίμασε ξανά.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="contact"
      data-testid="contact-section"
      className="py-14 md:py-16 relative bg-baby rounded-t-[2.5rem] overflow-hidden grain"
    >
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/30 blur-3xl pointer-events-none" />
      <div className="mx-auto max-w-6xl px-6 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 relative">
          <div className="lg:col-span-6">
            <Kicker className="text-ink/70">Επικοινωνία</Kicker>
            <h2
              data-testid="contact-headline"
              className="mt-3 font-display font-bold tracking-tighter leading-[0.95] text-4xl md:text-5xl"
            >
              <WordMask text="Ας" className="block" />
              <WordMask text="μιλήσουμε." accent={["μιλήσουμε."]} delay={0.2} className="block" />
            </h2>
            <Reveal delay={0.3}>
              <p className="mt-4 max-w-md text-sm md:text-base leading-relaxed text-ink/70">
                Πες μας τι θέλεις να χτίσεις ή να διορθώσεις. Δωρεάν προσφορά,
                χωρίς καμία δέσμευση — απαντάμε εντός 2 ωρών τις εργάσιμες μέρες.
              </p>
            </Reveal>

            <Reveal delay={0.4} className="mt-6 space-y-3">
              <a
                href="mailto:hello@kndp.studio"
                data-testid="contact-email-link"
                className="group flex items-center justify-between rounded-2xl border border-white/60 bg-white/80 backdrop-blur p-4 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/10"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-baby-light text-baby-dark">
                    <Mail className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] font-semibold text-ink/50">Στείλε μας email</p>
                    <p className="text-sm font-semibold">hello@kndp.studio</p>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-ink/30 transition-transform duration-300 group-hover:rotate-45 group-hover:text-baby-dark" />
              </a>

              <div
                data-testid="contact-booking-card"
                className="flex items-center justify-between rounded-2xl border border-dashed border-ink/25 bg-white/50 backdrop-blur p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-baby-dark">
                    <CalendarClock className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] font-semibold text-ink/50">Κλείσε ένα ραντεβού</p>
                    <p className="text-sm font-semibold">30-λεπτη γνωριμία</p>
                  </div>
                </div>
                <span className="rounded-full bg-white border border-ink/10 px-3 py-1 text-[11px] font-bold text-baby-dark">
                  Σύνδεσμος ημερολογίου έρχεται σύντομα
                </span>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            <Reveal delay={0.25}>
              <form
                data-testid="contact-form"
                onSubmit={submit}
                className="mx-auto max-w-md rounded-[1.5rem] bg-white border border-white/60 shadow-xl shadow-ink/5 p-5 md:p-7"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="contact-name" className="mb-1.5 block text-xs uppercase tracking-[0.2em] font-semibold text-ink/50">
                      Όνομα *
                    </label>
                    <input
                      id="contact-name"
                      data-testid="contact-name-input"
                      required
                      value={form.name}
                      onChange={set("name")}
                      placeholder="Το όνομά σου"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="mb-1.5 block text-xs uppercase tracking-[0.2em] font-semibold text-ink/50">
                      Email *
                    </label>
                    <input
                      id="contact-email"
                      data-testid="contact-email-input"
                      required
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      placeholder="you@company.com"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="contact-phone" className="mb-1.5 block text-xs uppercase tracking-[0.2em] font-semibold text-ink/50">
                      Τηλέφωνο *
                    </label>
                    <input
                      id="contact-phone"
                      data-testid="contact-phone-input"
                      required
                      type="tel"
                      value={form.phone}
                      onChange={set("phone")}
                      placeholder="π.χ. 69XXXXXXXX"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-company" className="mb-1.5 block text-xs uppercase tracking-[0.2em] font-semibold text-ink/50">
                      Εταιρεία *
                    </label>
                    <input
                      id="contact-company"
                      data-testid="contact-company-input"
                      required
                      value={form.company}
                      onChange={set("company")}
                      placeholder="Η εταιρεία σου"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <p className="mb-2 text-xs uppercase tracking-[0.2em] font-semibold text-ink/50">
                    Τι χρειάζεσαι;
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {serviceOptions.map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        data-testid={`service-chip-${s.value.toLowerCase().replace(/\s+/g, "-")}`}
                        onClick={() => setService(service === s.value ? null : s.value)}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-[background-color,border-color,color,transform] duration-300 hover:scale-105 active:scale-95 ${
                          service === s.value
                            ? "bg-ink text-white border-ink"
                            : "bg-white text-ink/70 border-ink/10 hover:border-baby-dark"
                        }`}
                      >
                        {service === s.value && <Check className="h-3 w-3" />}
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="contact-message" className="mb-1.5 block text-xs uppercase tracking-[0.2em] font-semibold text-ink/50">
                    Πες μας περισσότερα *
                  </label>
                  <textarea
                    id="contact-message"
                    data-testid="contact-message-input"
                    required
                    rows={3}
                    value={form.message}
                    onChange={set("message")}
                    placeholder="Τι θέλεις να χτίσεις ή να διορθώσεις; Μια αρχική ιδέα είναι απόλυτα εντάξει."
                    className={`${inputCls} resize-none`}
                  />
                </div>

                <Magnetic strength={0.2}>
                  <button
                    type="submit"
                    data-testid="contact-submit-button"
                    disabled={sending}
                    className="btn-shine group mt-5 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-ink px-7 py-3 text-sm font-bold text-white transition-[transform,opacity] duration-300 hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
                  >
                    {sending ? "Αποστολή…" : "Αποστολή Μηνύματος"}
                    <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </button>
                </Magnetic>
                <p
                  data-testid="contact-promise-line"
                  className="mt-3 flex items-center gap-2 text-xs font-semibold text-ink/55"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-baby-dark" />
                  Δωρεάν προσφορά χωρίς δέσμευση — απαντάμε εντός 2 ωρών τις εργάσιμες μέρες.
                </p>
              </form>
            </Reveal>
          </div>
      </div>
    </section>
  );
}
