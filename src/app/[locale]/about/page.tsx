import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { CorridorRule } from "@/components/Corridor";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return { title: dict.nav.about };
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const { about } = dict;

  return (
    <>
      <section className="pt-16 pb-16 sm:pt-24 sm:pb-20">
        <Container>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-orange">
            {about.eyebrow}
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-black uppercase leading-[0.98] tracking-tight text-ink sm:text-5xl md:text-6xl">
            {about.title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink/70 sm:text-lg">
            {about.intro}
          </p>
        </Container>
      </section>

      <Container>
        <CorridorRule />
      </Container>

      <section className="py-16 sm:py-20">
        <Container className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <h2 className="font-display text-2xl font-bold uppercase leading-tight text-ink sm:text-3xl">
              {about.missionTitle}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink/70">{about.mission}</p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold uppercase leading-tight text-ink sm:text-3xl">
              {about.historyTitle}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink/70">{about.history}</p>
          </div>
        </Container>
      </section>

      <section className="border-t border-hairline bg-white/60 py-16 sm:py-20">
        <Container>
          <h2 className="font-display text-2xl font-bold uppercase leading-tight text-ink sm:text-3xl">
            {about.valuesTitle}
          </h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-sm border border-hairline bg-hairline sm:grid-cols-3">
            {about.values.map((value) => (
              <div key={value.title} className="flex flex-col gap-3 bg-paper p-6">
                <h3 className="font-display text-lg font-bold uppercase leading-tight text-ink">
                  {value.title}
                </h3>
                <p className="text-sm leading-relaxed text-ink/70">{value.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
