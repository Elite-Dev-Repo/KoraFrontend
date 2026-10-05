"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUpRight01Icon,
  Books01Icon,
  MenuTwoLineIcon,
} from "@hugeicons/core-free-icons";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ACCESS } from "@/api/constants";

export const navLinks = [
  { name: "Platform", href: "#platform" },
  { name: "Capabilities", href: "#capabilities" },
  { name: "Use Cases", href: "#use-cases" },
  { name: "FAQs", href: "#faqs" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthed(!!localStorage.getItem(ACCESS));
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    window.addEventListener("kora-auth-change", checkAuth);
    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("kora-auth-change", checkAuth);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
    <nav className="h-11">
      <div className="cont flex h-full items-center justify-between">
        <Link href="/">
          <p className="flex items-center justify-center gap-3">
            <HugeiconsIcon icon={Books01Icon} />
            <span className="text-lg font-medium tracking-wider">Kora</span>
          </p>
        </Link>

        <ul className="hidden items-center justify-center gap-5 md:flex">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                className="tracking-wider transition-colors hover:text-primary"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link href={isAuthed ? "/dashboard" : "/auth"}>
            <button className="hidden md:flex gap-2 items-center justify-between rounded-full bg-secondary px-4 py-2 tracking-wide text-background transition-colors hover:bg-primary md:block">
              <span>{isAuthed ? "Dashboard" : "Get Started"}</span>
              <HugeiconsIcon size={22} icon={ArrowUpRight01Icon} />
            </button>
          </Link>
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="flex size-10 items-center justify-center md:hidden"
          >
            <HugeiconsIcon
              icon={MenuTwoLineIcon}
              size={23}
              className="w-full h-full"
            />
          </button>
        </div>
      </div>
    </nav>

      <div
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-50 flex min-h-dvh w-full flex-col bg-background px-5 pt-2 pb-8 transition-all duration-300 md:hidden",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <div className="flex h-11 items-center justify-between">
          <Link href="/" onClick={() => setOpen(false)}>
            <p className="flex items-center justify-center gap-3">
              <HugeiconsIcon icon={Books01Icon} />
              <span className="text-lg font-medium tracking-wider">Kora</span>
            </p>
          </Link>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex size-10 items-center justify-center rounded-full bg-secondary/5 transition-colors hover:bg-secondary/10 active:scale-95"
          >
            <X className="size-5" />
          </button>
        </div>

        <ul className="mt-10 flex flex-col items-start gap-1 text-left">
          {navLinks.map((link, i) => (
            <li
              key={link.name}
              className={cn(
                "w-full transition-all duration-500",
                open
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0",
              )}
              style={{ transitionDelay: open ? `${100 + i * 70}ms` : "0ms" }}
            >
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="group flex w-full items-center gap-4 rounded-lg px-2 py-3 text-left text-4xl font-light leading-none tracking-wide transition-all duration-300 hover:translate-x-2 hover:bg-secondary/5 hover:text-primary active:translate-x-2 active:text-primary"
              >
                <span className="text-sm font-normal tabular-nums text-foreground/40 transition-colors group-hover:text-primary">
                  0{i + 1}
                </span>
                {link.name}
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  size={28}
                  strokeWidth={2}
                  className="-translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                />
              </a>
            </li>
          ))}
        </ul>

        <div
          className={cn(
            "mt-auto transition-all delay-300 duration-500",
            open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
          )}
        >
          <Link
            href={isAuthed ? "/dashboard" : "/auth"}
            onClick={() => setOpen(false)}
          >
            <button className="flex w-full items-center justify-center gap-2 rounded-full bg-secondary px-6 py-3.5 tracking-wide text-background transition-colors hover:bg-primary active:scale-[0.98]">
              {isAuthed ? "Dashboard" : "Get Started"}
              <HugeiconsIcon size={22} icon={ArrowUpRight01Icon} />
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
