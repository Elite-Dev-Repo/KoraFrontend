import {
  Briefcase,
  Code2,
  GraduationCap,
  Rocket,
  Search,
  Users,
} from "lucide-react";

const useCases = [
  {
    icon: Code2,
    audience: "Developers & Engineers",
    text: "Let visitors ask about your stack, projects, and open-source work instead of digging through READMEs.",
    examples: ["Explain this project", "Show API usage", "Hiring availability"],
  },
  {
    icon: Briefcase,
    audience: "Businesses & Enterprises",
    text: "Deflect repetitive support tickets and qualify leads with answers pulled from your docs and pricing pages.",
    examples: ["Pricing & plans", "Onboarding help", "Book a demo"],
  },
  {
    icon: Rocket,
    audience: "Startups & Founders",
    text: "Look bigger than you are. A Kora widget answers investor, customer, and hiring questions around the clock.",
    examples: ["What do you do?", "Talk to a founder", "Join the waitlist"],
  },
  {
    icon: GraduationCap,
    audience: "Educators & Students",
    text: "Turn portfolios, course sites, and research pages into interactive guides for peers and recruiters.",
    examples: ["Course overview", "Research summary", "Office hours"],
  },
  {
    icon: Search,
    audience: "Researchers & Analysts",
    text: "Make reports and datasets explorable. Visitors query findings in plain language and get cited answers.",
    examples: ["Key findings", "Methodology", "Download data"],
  },
  {
    icon: Users,
    audience: "Freelancers & Marketers",
    text: "Convert portfolio lurkers into clients by answering scope, rate, and timeline questions instantly.",
    examples: ["Your services", "Past results", "Start a project"],
  },
];

export function UseCasesSection() {
  return (
    <section id="use-cases" className="w-full scroll-mt-20 px-3 py-6">
      <div className="cont">
        <p className="text-sm font-medium tracking-[0.2em] text-primary uppercase">
          Use Cases
        </p>
        <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-xl text-4xl font-medium tracking-tight text-secondary md:text-5xl">
            Built for anyone with something to share.
          </h2>
          <p className="max-w-md text-base leading-relaxed text-secondary/60">
            From personal portfolios to company knowledge bases — if visitors
            have questions, Kora has answers.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {useCases.map((u) => (
            <article
              key={u.audience}
              className="flex flex-col rounded-xl border border-secondary/10 bg-white p-6 transition-colors hover:border-primary/40"
            >
              <div className="flex size-11 items-center justify-center rounded-lg bg-secondary text-background">
                <u.icon className="size-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-secondary">
                {u.audience}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-secondary/60">
                {u.text}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {u.examples.map((e) => (
                  <span
                    key={e}
                    className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  >
                    “{e}”
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
