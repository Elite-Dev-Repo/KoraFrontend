"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUpRight01Icon,
  Copy01Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";

function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-secondary/10 bg-secondary text-background">
      <div className="flex items-center justify-between border-b border-background/10 px-4 py-2">
        <span className="text-xs font-medium tracking-widest text-background/50 uppercase">
          {language}
        </span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 rounded-full bg-background/10 px-3 py-1 text-xs transition-colors hover:bg-primary"
        >
          <HugeiconsIcon icon={copied ? Tick01Icon : Copy01Icon} size={14} />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

const installCode = `npm install kora-agent`;

const usageCode = `import AIAgent from "kora-agent";

export default function App() {
  return (
    <AIAgent
      base_url="https://your-backend/api/agent"
      api_key="your-api-key"
    />
  );
}`;

export default function Docs() {
  return (
    <>
      <section className="w-screen px-3 py-1.5">
        <Navbar />
      </section>

      <main className="cont w-full px-4 py-10 md:py-16">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            Documentation
          </p>
          <h1 className="mt-2 text-3xl font-medium tracking-wide md:text-5xl">
            Use the Kora agent
          </h1>
          <p className="mt-4 leading-relaxed text-secondary/70">
            Add the Kora AI chat widget to any React app in two steps: install
            the package, then drop in the{" "}
            <code className="rounded bg-secondary/5 px-1.5 py-0.5 text-sm font-medium text-primary">
              AIAgent
            </code>{" "}
            component with your{" "}
            <code className="rounded bg-secondary/5 px-1.5 py-0.5 text-sm font-medium">
              base_url
            </code>{" "}
            and{" "}
            <code className="rounded bg-secondary/5 px-1.5 py-0.5 text-sm font-medium">
              api_key
            </code>
            .
          </p>

          {/* Step 1 */}
          <div className="mt-10">
            <div className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-background">
                1
              </span>
              <h2 className="text-xl font-medium tracking-wide">Install</h2>
            </div>
            <div className="mt-4">
              <CodeBlock code={installCode} language="bash" />
            </div>
          </div>

          {/* Step 2 */}
          <div className="mt-10">
            <div className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-background">
                2
              </span>
              <h2 className="text-xl font-medium tracking-wide">
                Add the component
              </h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-secondary/70">
              Import{" "}
              <code className="rounded bg-secondary/5 px-1.5 py-0.5 font-medium">
                AIAgent
              </code>{" "}
              from{" "}
              <code className="rounded bg-secondary/5 px-1.5 py-0.5 font-medium">
                kora-agent
              </code>{" "}
              and render it anywhere in your app. It renders a floating chat
              button with a chat window.
            </p>
            <div className="mt-4">
              <CodeBlock code={usageCode} language="jsx" />
            </div>
          </div>

          {/* Props */}
          <div className="mt-10">
            <div className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-background">
                3
              </span>
              <h2 className="text-xl font-medium tracking-wide">Props</h2>
            </div>
            <div className="mt-4 overflow-hidden rounded-xl border border-secondary/10">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-secondary/5 text-xs tracking-widest uppercase">
                    <th className="px-4 py-3 font-semibold">Prop</th>
                    <th className="px-4 py-3 font-semibold">Required</th>
                    <th className="px-4 py-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-secondary/10">
                    <td className="px-4 py-3 font-mono font-medium text-primary">
                      base_url
                    </td>
                    <td className="px-4 py-3">Yes</td>
                    <td className="px-4 py-3 text-secondary/70">
                      Your agent backend endpoint URL.
                    </td>
                  </tr>
                  <tr className="border-t border-secondary/10">
                    <td className="px-4 py-3 font-mono font-medium text-primary">
                      api_key
                    </td>
                    <td className="px-4 py-3">Yes</td>
                    <td className="px-4 py-3 text-secondary/70">
                      Your API key. Sent as{" "}
                      <code className="rounded bg-secondary/5 px-1 py-0.5 text-xs">
                        Authorization: Api-Key {"<key>"}
                      </code>
                      .
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-secondary/70">
              Get both values from your{" "}
              <Link
                href="/dashboard"
                className="font-medium text-primary hover:underline"
              >
                Kora dashboard
              </Link>
              .
            </p>
          </div>

          {/* CTA */}
          <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-xl bg-primary p-6 text-background md:flex-row md:items-center">
            <div>
              <p className="text-lg font-medium">Need an API key?</p>
              <p className="mt-1 text-sm text-background/70">
                Create an agent on your dashboard to get your base_url and
                api_key.
              </p>
            </div>
            <Link href="/dashboard">
              <div className="flex cursor-pointer items-center rounded-full bg-background px-4 py-2 font-medium text-secondary">
                <span>Go to Dashboard</span>
                <HugeiconsIcon icon={ArrowUpRight01Icon} size={20} />
              </div>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
