import Link from "next/link";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { CorridorRoute, CorridorRule } from "@/components/Corridor";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <section className="pt-16 pb-20 sm:pt-24 sm:pb-28">
        <Container>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-orange">
            {dict.hero.eyebrow}
          </p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl font-black uppercase leading-[0.95] tracking-tight text-ink sm:text-6xl md:text-7xl">
            {dict.hero.headline}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/70 sm:text-lg">
            {dict.hero.sub}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={`/${locale}/contact`}
              className="rounded-sm bg-indigo px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-paper transition-colors hover:bg-indigo-deep"
            >
              {dict.hero.ctaPrimary}
            </Link>
            <Link
              href={`/${locale}/services`}
              className="rounded-sm border border-hairline px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-ink transition-colors hover:border-ink"
            >
              {dict.hero.ctaSecondary}
            </Link>
          </div>
        </Container>

        <Container className="mt-16">
          <div className="rounded-sm border border-hairline bg-white/60 p-6 sm:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-mist">
              {dict.corridor.eyebrow}
            </p>
            <h2 className="mt-2 max-w-2xl font-display text-2xl font-bold uppercase leading-tight text-ink sm:text-3xl">
              {dict.corridor.title}
            </h2>
            <div className="mt-10">
              <CorridorRoute nodes={dict.corridor.nodes} />
            </div>
          </div>
        </Container>
      </section>

      <Container>
        <CorridorRule />
      </Container>

      <section className="py-20 sm:py-28">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-orange">
                {dict.services.eyebrow}
              </p>
              <h2 className="mt-2 max-w-xl font-display text-3xl font-black uppercase leading-tight text-ink sm:text-4xl">
                {dict.services.title}
              </h2>
            </div>
            <Link
              href={`/${locale}/services`}
              className="font-mono text-xs uppercase tracking-[0.15em] text-indigo hover:text-indigo-deep"
            >
              {dict.services.viewAll} →
            </Link>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-sm border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
            {dict.services.items.map((item) => (
              <div key={item.code} className="flex flex-col gap-3 bg-paper p-6">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-orange">
                  {item.code}
                </span>
                <h3 className="font-display text-xl font-bold uppercase leading-tight text-ink">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-ink/70">{item.summary}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-hairline bg-white/60 py-20 sm:py-28">
        <Container className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:gap-16">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-orange">
              {dict.coverage.eyebrow}
            </p>
            <h2 className="mt-2 font-display text-3xl font-black uppercase leading-tight text-ink sm:text-4xl">
              {dict.coverage.title}
            </h2>
          </div>
          <p className="text-base leading-relaxed text-ink/70 sm:text-lg">{dict.coverage.body}</p>
        </Container>
      </section>

      <section className="bg-indigo-deep py-20 text-paper sm:py-24">
        <Container className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <h2 className="max-w-lg font-display text-3xl font-black uppercase leading-tight sm:text-4xl">
              {dict.ctaBand.title}
            </h2>
            <p className="mt-4 max-w-md text-paper/70">{dict.ctaBand.body}</p>
          </div>
          <Link
            href={`/${locale}/contact`}
            className="shrink-0 rounded-sm bg-orange px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-paper transition-colors hover:bg-orange/90"
          >
            {dict.ctaBand.cta}
          </Link>
        </Container>
      </section>
    </>
  );
}
