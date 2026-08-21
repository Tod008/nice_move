import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { OFFICE } from "@/lib/office";
import { OfficeMapLoader } from "./OfficeMapLoader";
import { Container } from "./Container";

const navKeys = ["home", "about", "services", "partners", "contact"] as const;
const navPaths: Record<(typeof navKeys)[number], string> = {
  home: "",
  about: "/about",
  services: "/services",
  partners: "/partners",
  contact: "/contact",
};

function Bilingual({ en, mn }: { en: string; mn: string }) {
  return (
    <>
      {en} <span className="text-paper/45">{mn}</span>
    </>
  );
}

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();
  const en = getDictionary("en");
  const mn = getDictionary("mn");

  return (
    <footer className="border-t border-hairline bg-indigo-deep text-paper">
      <Container className="grid gap-10 py-16 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2 md:col-span-2">
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <Image
              src="/mark.png"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 brightness-0 invert"
            />
            <span className="font-display text-lg font-black uppercase tracking-tight">
              Nice Move Logistics
            </span>
          </Link>
          <p className="mt-4 max-w-xs font-mono text-xs uppercase tracking-[0.15em] text-paper/60">
            <Bilingual en={en.footer.tagline} mn={mn.footer.tagline} />
          </p>
        </div>

        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/50">
            <Bilingual en={en.footer.navTitle} mn={mn.footer.navTitle} />
          </div>
          <ul className="mt-4 space-y-2">
            {navKeys.map((key) => (
              <li key={key}>
                <Link
                  href={`/${locale}${navPaths[key]}`}
                  className="text-sm text-paper/80 transition-colors hover:text-orange"
                >
                  <Bilingual en={en.nav[key]} mn={mn.nav[key]} />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/50">
            <Bilingual en={en.footer.addressLabel} mn={mn.footer.addressLabel} />
          </div>
          <div className="mt-4">
            <OfficeMapLoader dict={dict.footer.office} />
          </div>
          <p className="mt-4 text-sm text-paper/80">
            {OFFICE.lines.map((line, i) => (
              <span key={line}>
                {line}
                {i < OFFICE.lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>
      </Container>

      <Container className="flex flex-col gap-2 border-t border-paper/10 py-6 text-xs text-paper/50 sm:flex-row sm:items-center sm:justify-between">
        <span>
          © {year} Nice Move Logistics. <Bilingual en={en.footer.rights} mn={mn.footer.rights} />
        </span>
      </Container>
    </footer>
  );
}
