"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import { Container } from "./Container";
import { LanguageSwitcher } from "./LanguageSwitcher";

const navKeys = ["home", "about", "services", "partners"] as const;
const navPaths: Record<(typeof navKeys)[number], string> = {
  home: "",
  about: "/about",
  services: "/services",
  partners: "/partners",
};

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-paper/90 backdrop-blur">
      <Container className="flex h-20 items-center justify-between">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/mark.png"
            alt=""
            width={40}
            height={40}
            className="h-9 w-9"
            priority
          />
          <span className="font-display text-xl font-black uppercase tracking-tight text-ink">
            Nice Move <span className="text-orange">Logistics</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navKeys.map((key) => {
            const href = `/${locale}${navPaths[key]}`;
            const active = pathname === href;
            return (
              <Link
                key={key}
                href={href}
                className={`font-mono text-xs uppercase tracking-[0.15em] transition-colors ${
                  active ? "text-orange" : "text-ink/70 hover:text-ink"
                }`}
              >
                {dict.nav[key]}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          <LanguageSwitcher locale={locale} />
          <Link
            href={`/${locale}/contact`}
            className="rounded-sm bg-indigo px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] text-paper transition-colors hover:bg-indigo-deep"
          >
            {dict.nav.contact}
          </Link>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-4 w-6">
            <span
              className={`absolute left-0 top-0 h-0.5 w-6 bg-ink transition-transform ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] h-0.5 w-6 bg-ink transition-opacity ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[14px] h-0.5 w-6 bg-ink transition-transform ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </Container>

      <div
        className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out md:hidden ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="overflow-hidden border-t border-hairline bg-paper">
          <Container className="flex flex-col gap-1 py-4">
            {navKeys.map((key) => {
              const href = `/${locale}${navPaths[key]}`;
              return (
                <Link
                  key={key}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="py-2 font-mono text-xs uppercase tracking-[0.15em] text-ink/80"
                >
                  {dict.nav[key]}
                </Link>
              );
            })}
            <Link
              href={`/${locale}/contact`}
              onClick={() => setOpen(false)}
              className="py-2 font-mono text-xs uppercase tracking-[0.15em] text-orange"
            >
              {dict.nav.contact}
            </Link>
            <div className="pt-2">
              <LanguageSwitcher locale={locale} />
            </div>
          </Container>
        </div>
      </div>
    </header>
  );
}
