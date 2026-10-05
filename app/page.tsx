"use client";
import { MyAvatar } from "@/components/MyAvatar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PlatformSection } from "@/components/sections/PlatformSection";
import { CapabilitiesSection } from "@/components/sections/CapabilitiesSection";
import { UseCasesSection } from "@/components/sections/UseCasesSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowUpRight01Icon,
  FolderCloudIcon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";

const targets = [
  // Technical & Engineering
  "Developers",
  "Engineers",
  "Architects",

  // Business & Corporate
  "Businesses",
  "Institutions",
  "Enterprises",
  "Startups",
  "Founders",
  "Executives",

  // Specialized Roles
  "Researchers",
  "Analysts",
  "Marketers",
  "Recruiters",
  "Educators",
  "Students",
  "Freelancers",
  "Consumers",
];

export default function Landing() {
  const [visibleTarget, setVisibleTarget] = useState("Developers");

  useEffect(() => {
    const id = setInterval(() => {
      const index = Math.floor(Math.random() * targets.length);
      setVisibleTarget(targets[index]);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <section className="w-full min-h-svh px-3 py-1.5">
        <div className=" w-full h-full">
          <Navbar />

          <div className="min-h-[calc(100svh-55px)] bg-primary rounded-xl flex flex-col gap-6 sm:gap-9 items-center justify-center px-5 sm:px-4 py-12 text-center overflow-hidden">
            {/* <div className="flex w-full gap-3 items-center justify-center">
              <MyAvatar></MyAvatar>{" "}
              <p className="text-sm text-background font-medium">
                <span className="text-2xl">|</span> Used by hundreds of
                developers worldwide.
              </p>
            </div> */}
            <div className="w-fit max-w-full min-h-8 h-auto flex items-center justify-center gap-2 sm:gap-3 border-1 border-background rounded-sm bg-background">
              <div className="px-3 flex font-semibold items-center gap-2 rounded-sm justify-center h-7 shrink-0 bg-primary text-background text-sm">
                Elite{" "}
                <HugeiconsIcon
                  icon={FolderCloudIcon}
                  size={19}
                  strokeWidth={2.5}
                />
              </div>
              <div className="px-2 sm:px-4 text-[11px] sm:text-sm font-semibold leading-tight text-center">
                Definitely not backed by Y-combinator
              </div>
            </div>
            <div className="flex flex-col gap-6 items-center justify-center w-full max-w-full">
              <h1 className="font-light leading-[1.15] sm:leading-normal text-[2rem] sm:text-5xl md:text-6xl tracking-wide text-center text-balance text-background w-full max-w-full">
                Personalized AI Agent, <br className="hidden sm:block" /> For{" "}
                <span
                  key={visibleTarget}
                  className="bg-background text-primary font-light tracking-wide px-3 sm:px-4 inline-block whitespace-nowrap mt-2 sm:mt-0"
                >
                  {visibleTarget}.
                </span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-background/70 leading-relaxed w-[600px] max-w-full text-center text-pretty px-1">
                Kora is an embeddable AI assistant built to give your website
                visitors instant, accurate information about your work and
                services.
              </p>
              <Link href={"/dashboard"}>
                <div className="flex items-center h-11 group cursor-pointer rounded-full overflow-hidden">
                  <button className="px-5 h-full bg-secondary text-background font-medium ">
                    {" "}
                    Start Now
                  </button>
                  <div className="w-11 h-full bg-secondary text-background/70 flex items-center justify-center">
                    {" "}
                    <HugeiconsIcon icon={ArrowUpRight01Icon} />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main>
        <PlatformSection />
        <CapabilitiesSection />
        <UseCasesSection />
        <FaqSection />
      </main>

      <Footer />
    </>
  );
}
