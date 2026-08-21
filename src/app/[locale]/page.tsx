import Link from "next/link";
import Image from "next/image";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { CorridorRoute, CorridorRule } from "@/components/Corridor";
import { ServiceRows } from "@/components/ServiceRows";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <section className="relative flex min-h-[clamp(560px,84vh,780px)] items-center justify-center overflow-hidden">
        <Image
          src="/hero-zamyn-uud.jpg"
          alt=""
          fill
          preload
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_20%,rgba(27,10,77,0.35),rgba(12,5,36,0.86))]" />
        <Container className="relative z-10 flex flex-col items-center text-center">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-orange">
            {dict.hero.eyebrow}
          </p>
          <h1 className="mt-5 max-w-4xl text-balance font-display text-[clamp(38px,7.4vw,84px)] font-bold uppercase leading-[0.95] text-paper">
            {dict.hero.headline}
          </h1>
          <p className="mt-6 max-w-[36em] text-base leading-relaxed text-paper/70 sm:text-lg">
            {dict.hero.sub}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href={`/${locale}/contact`}
              className="rounded-sm bg-orange px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-paper transition-colors hover:bg-orange/90"
            >
              {dict.hero.ctaPrimary}
            </Link>
            <Link
              href={`/${locale}/services`}
              className="rounded-sm border border-paper/45 px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-paper transition-colors hover:bg-paper/8"
            >
              {dict.hero.ctaSecondary}
            </Link>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24">
        <Container>
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

          <div className="mt-12">
            <ServiceRows locale={locale} items={dict.services.items} />
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
