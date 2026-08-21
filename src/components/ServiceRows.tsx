import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";

export function ServiceRows({
  locale,
  items,
}: {
  locale: Locale;
  items: Dictionary["services"]["items"];
}) {
  return (
    <div className="border-t border-hairline">
      {items.map((item) => (
        <Link
          key={item.code}
          href={`/${locale}/services#${item.code.toLowerCase()}`}
          className="group relative flex min-h-[88px] items-center border-b border-hairline bg-paper px-3 py-5 text-ink transition-[background-color,color] duration-[420ms] ease-out hover:bg-indigo-deep hover:text-paper sm:px-6 sm:py-7"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-[420ms] ease-out group-hover:opacity-100"
          >
            <Image src={item.image} alt="" fill sizes="100vw" className="object-cover" />
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-deep/90 to-indigo-deep/55" />
          </span>

          <div className="relative z-10 flex w-full items-center gap-4 sm:gap-8">
            <div className="relative h-[56px] w-[76px] shrink-0 border border-hairline sm:h-[88px] sm:w-[132px]">
              <Image
                src={item.image}
                alt=""
                fill
                sizes="(min-width: 640px) 132px, 76px"
                className="object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-orange">
                {item.code}
              </span>
              <h3 className="font-display text-xl font-semibold uppercase leading-tight text-current sm:text-3xl">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-current opacity-70 sm:text-[15px]">
                {item.summary}
              </p>
            </div>

            <span className="font-mono text-current opacity-55">→</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
