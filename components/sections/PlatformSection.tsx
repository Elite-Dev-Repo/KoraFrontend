import { Code2, Database, LayoutDashboard, ArrowUpRight } from "lucide-react";

const steps = [
  {
    icon: Database,
    step: "01",
    title: "Connect your knowledge",
    text: "Point Kora at your docs, portfolio, Notion, GitHub, or website. It indexes your work so answers stay accurate and on-brand.",
  },
  {
    icon: Code2,
    step: "02",
    title: "Embed with one snippet",
    text: "Drop a lightweight script on any site. No heavy SDKs, no rebuilds — Kora renders a fast, customizable chat widget.",
  },
  {
    icon: LayoutDashboard,
    step: "03",
    title: "Monitor & improve",
    text: "See what visitors ask, fill content gaps, and tune responses from a simple dashboard built for makers.",
  },
];

export function PlatformSection() {
  return (
    <section id="platform" className="w-full scroll-mt-20 px-3 py-6">
      <div className="cont">
        <p className="text-sm font-medium tracking-[0.2em] text-primary uppercase">
          Platform
        </p>
        <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-xl text-4xl font-medium tracking-tight text-secondary md:text-5xl">
            Turn your website into a conversation.
          </h2>
          <p className="max-w-md text-base leading-relaxed text-secondary/60">
            Kora sits on top of your existing site and answers visitors
            instantly — about your projects, pricing, services, and availability.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((s) => (
            <article
              key={s.step}
              className="group rounded-xl border border-secondary/10 bg-white p-6 transition-colors hover:border-primary/40"
            >
              <div className="flex items-center justify-between">
                <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <s.icon className="size-5" />
                </div>
                <span className="text-sm font-semibold tracking-widest text-secondary/30">
                  {s.step}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-secondary">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-secondary/60">
                {s.text}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-4 overflow-hidden rounded-xl bg-secondary text-background">
          <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
            <div>
              <p className="font-mono text-xs tracking-widest text-background/50 uppercase">
                Embed in seconds
              </p>
              <pre className="mt-3 overflow-x-auto rounded-lg bg-background/10 p-4 font-mono text-[13px] leading-relaxed">
                <code>{`<script src="https://kora.ai/widget.js"\n  data-site="your-site-id" async />`}</code>
              </pre>
            </div>
            <a
              href="#faqs"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-background px-6 py-2.5 text-sm font-medium text-secondary transition-colors hover:bg-primary hover:text-background"
            >
              How it works
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
