"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "What is Kora?",
    a: "Kora is an embeddable AI assistant that lives on your website and answers visitors' questions about your work, projects, services, and pricing — using your own content as its source of truth.",
  },
  {
    q: "How do I add Kora to my website?",
    a: "Paste a single <script> snippet into your site's HTML and point Kora at your knowledge sources (docs, URLs, Notion, GitHub). No rebuilds or heavy SDKs required — most sites are live in minutes.",
  },
  {
    q: "Where does Kora get its answers from?",
    a: "Only from the sources you connect. Kora indexes your portfolio, documentation, and pages, then grounds every answer in that content so it stays accurate and on-brand.",
  },
  {
    q: "Can I customize how Kora looks and sounds?",
    a: "Yes. You control the theme, avatar, greeting, and tone of voice, so the widget feels like a native part of your site rather than a third-party add-on.",
  },
  {
    q: "Is my data used to train models?",
    a: "No. Your private content is never used for model training. Knowledge bases are scoped to your site with redaction and access controls.",
  },
  {
    q: "How much does Kora cost?",
    a: "Kora starts free for personal sites and side projects. Paid plans unlock higher message volumes, analytics, team seats, and custom domains. Click Get Started to pick the plan that fits.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faqs" className="w-full scroll-mt-20 px-3 py-6">
      <div className="cont grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="rounded-xl bg-secondary p-8 text-background md:p-10">
          <p className="text-sm font-medium tracking-[0.2em] text-background/60 uppercase">
            FAQs
          </p>
          <h2 className="mt-3 text-4xl font-medium tracking-tight md:text-5xl">
            Questions? Answered.
          </h2>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-background/70">
            Everything visitors (and you) usually ask before embedding Kora.
            Still curious? Talk to us.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-background px-6 py-2.5 text-sm font-medium text-secondary transition-colors hover:bg-primary hover:text-background"
          >
            Contact support
            <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={f.q}
                className={cn(
                  "overflow-hidden rounded-xl border transition-colors",
                  isOpen
                    ? "border-primary/40 bg-white"
                    : "border-secondary/10 bg-white hover:border-secondary/25",
                )}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-[15px] font-semibold text-secondary">
                    {f.q}
                  </span>
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full transition-transform",
                      isOpen
                        ? "rotate-45 bg-primary text-background"
                        : "bg-secondary/5 text-secondary",
                    )}
                  >
                    <Plus className="size-4" />
                  </span>
                </button>
                <div
                  className={cn(
                    "grid transition-all",
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-sm leading-relaxed text-secondary/60">
                      {f.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
