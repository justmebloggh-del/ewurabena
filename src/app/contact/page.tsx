import { ContactForm } from "@/components/contact-form";

export default function ContactPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <section className="card space-y-4">
        <h1 className="section-title">Contact & Booking</h1>
        <p className="section-subtitle">
          Submit an inquiry for ministry invitations, events, partnerships, and media opportunities.
        </p>
        <p className="text-sm text-[color:var(--text-muted)]">
          Messages are delivered through Formspree and logged to the internal inbox when Supabase is configured.
        </p>
        <div className="space-y-2 rounded-xl border border-[color:var(--border-soft)] p-4 text-sm">
          <p className="text-[color:var(--gold)]">Booking/Info.</p>
          <a className="block hover:text-[color:var(--gold)]" href="tel:+447921459335">
            +447921 459335
          </a>
          <a className="block hover:text-[color:var(--gold)]" href="tel:+233540993540">
            +233540993540
          </a>
          <a className="block hover:text-[color:var(--gold)]" href="mailto:nustylerecordz@gmail.com">
            nustylerecordz@gmail.com
          </a>
        </div>
      </section>
      <ContactForm />
    </div>
  );
}
