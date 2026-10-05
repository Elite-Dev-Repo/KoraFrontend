import {
  Zap,
  MessagesSquare,
  BarChart3,
  ShieldCheck,
  Palette,
  Globe,
} from "lucide-react";

const capabilities = [
  {
    icon: Zap,
    title: "Instant, accurate answers",
    text: "Grounded in your own content — not generic AI guesses. Kora cites your work so visitors trust every reply.",
  },
  {
    icon: MessagesSquare,
    title: "Natural conversations",
    text: "Follow-ups, clarifications, and context handled gracefully. It feels like talking to you, minus the inbox overload.",
  },
  {
    icon: Palette,
    title: "Fully customizable",
    text: "Match your brand with themes, tone controls, avatar, and greeting. Your site, your voice.",
  },
  {
    icon: BarChart3,
    title: "Visitor analytics",
    text: "See top questions, drop-offs, and leads. Learn what your audience actually wants.",
  },
  {
    icon: ShieldCheck,
    title: "Private & secure",
    text: "Your data stays yours. Scoped knowledge bases, redaction controls, and no training on private content.",
  },
  {
    icon: Globe,
    title: "Always on, anywhere",
    text: "24/7 availability across devices and locales. Lightweight widget that never slows your site down.",
  },
];

export function CapabilitiesSection() {
  return (
    <section id="capabilities" className="w-full scroll-mt-20 px-3 py-6">
      <div className="cont rounded-xl bg-primary px-6 py-12 md:px-10 md:py-16">
        <p className="text-sm font-medium tracking-[0.2em] text-background/70 uppercase">
          Capabilities
        </p>
        <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-xl text-4xl font-medium tracking-tight text-background md:text-5xl">
            Everything you need to answer at scale.
          </h2>
          <p className="max-w-md text-base leading-relaxed text-background/70">
            One embeddable assistant that handles discovery, support, and lead
            qualification — while you focus on the work.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c) => (
            <article
              key={c.title}
              className="rounded-xl bg-background p-6 transition-transform hover:-translate-y-1"
            >
              <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <c.icon className="size-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-secondary">
                {c.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-secondary/60">
                {c.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
