import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import { Container } from "./Container";

const navKeys = ["home", "about", "services", "partners", "contact"] as const;
const navPaths: Record<(typeof navKeys)[number], string> = {
  home: "",
  about: "/about",
  services: "/services",
  partners: "/partners",
  contact: "/contact",
};

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();

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
            {dict.footer.tagline}
          </p>
        </div>

        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/50">
            {dict.footer.navTitle}
          </div>
          <ul className="mt-4 space-y-2">
            {navKeys.map((key) => (
              <li key={key}>
                <Link
                  href={`/${locale}${navPaths[key]}`}
                  className="text-sm text-paper/80 transition-colors hover:text-orange"
                >
                  {dict.nav[key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/50">
            {dict.footer.addressLabel}
          </div>
          <p className="mt-4 text-sm text-paper/80">{dict.footer.address}</p>
        </div>
      </Container>

      <Container className="flex flex-col gap-2 border-t border-paper/10 py-6 text-xs text-paper/50 sm:flex-row sm:items-center sm:justify-between">
        <span>
          © {year} Nice Move Logistics. {dict.footer.rights}
        </span>
      </Container>
    </footer>
  );
}
