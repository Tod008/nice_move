"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n/config";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? `/${locale}`;
  const rest = pathname.split("/").slice(2).join("/");

  return (
    <div className="flex items-center gap-1 font-mono text-xs uppercase tracking-[0.15em]">
      {locales.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span className="mx-1 text-hairline">/</span>}
          <Link
            href={`/${l}${rest ? `/${rest}` : ""}`}
            className={l === locale ? "text-orange" : "text-ink/50 hover:text-ink"}
            aria-current={l === locale ? "true" : undefined}
          >
            {l.toUpperCase()}
          </Link>
        </span>
      ))}
    </div>
  );
}
