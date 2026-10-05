import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Books01Icon,
  Github01Icon,
  Linkedin01Icon,
  GlobalIcon,
} from "@hugeicons/core-free-icons";

const columns = [
  {
    title: "Product",
    links: [
      { name: "Platform", href: "/#platform" },
      { name: "Capabilities", href: "/#capabilities" },
      { name: "Use Cases", href: "/#use-cases" },
      { name: "FAQs", href: "/#faqs" },
    ],
  },
  {
    title: "Resources",
    links: [{ name: "Documentation", href: "/docs" }],
  },
];

const socials = [
  { icon: Github01Icon, label: "GitHub", href: "https://github.com/Elite-Dev-Repo" },
  {
    icon: Linkedin01Icon,
    label: "LinkedIn",
    href: "https://linkedin.com/in/oyenekan-emmanuel",
  },
  {
    icon: GlobalIcon,
    label: "Website",
    href: "https://www.oyenekanemmanuel.xyz",
  },
];

export function Footer() {
  return (
    <footer className="w-full px-3 pt-6 pb-3">
      <div className="cont rounded-xl bg-secondary px-6 py-12 text-background md:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <HugeiconsIcon icon={Books01Icon} />
              <span className="text-lg font-medium tracking-wider">Kora</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-background/60">
              Personalized AI agent for your website. Give every visitor
              instant, accurate answers about your work.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-9 items-center justify-center rounded-full bg-background/10 text-background/70 transition-colors hover:bg-primary hover:text-background"
                >
                  <HugeiconsIcon icon={s.icon} size={18} />
                </a>
              ))}
            </div>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-8 sm:grid-cols-4"
          >
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-xs font-semibold tracking-[0.2em] text-background/50 uppercase">
                  {col.title}
                </p>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-sm text-background/75 transition-colors hover:text-background"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-background/10 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-background/50">
            © {new Date().getFullYear()} Kora. All rights reserved. Built by{" "}
            <a
              href="https://www.oyenekanemmanuel.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-background/75 transition-colors hover:text-background"
            >
              EliteDEV
            </a>
          </p>
          <p className="flex items-center gap-2 text-xs text-background/50">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            All systems operational
          </p>
        </div>
      </div>
    </footer>
  );
}
