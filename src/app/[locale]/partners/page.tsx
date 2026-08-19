import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return { title: dict.nav.partners };
}

export default async function PartnersPage({ params }: PageProps<"/[locale]/partners">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const { partners } = dict;

  return (
    <section className="pt-16 pb-20 sm:pt-24 sm:pb-28">
      <Container>
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-orange">
          {partners.eyebrow}
        </p>
        <h1 className="mt-5 max-w-3xl font-display text-4xl font-black uppercase leading-[0.98] tracking-tight text-ink sm:text-5xl md:text-6xl">
          {partners.title}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink/70 sm:text-lg">
          {partners.intro}
        </p>

        <h2 className="mt-16 font-display text-2xl font-bold uppercase leading-tight text-ink sm:text-3xl">
          {partners.regionsTitle}
        </h2>
        <div className="mt-8 grid gap-px overflow-hidden rounded-sm border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
          {partners.regions.map((region) => (
            <div key={region.country} className="flex flex-col gap-2 bg-paper p-6">
              <h3 className="font-display text-lg font-bold uppercase leading-tight text-ink">
                {region.country}
              </h3>
              <p className="text-sm leading-relaxed text-ink/70">{region.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-sm border border-dashed border-hairline p-6">
          <p className="text-sm leading-relaxed text-mist">{partners.notice}</p>
        </div>
      </Container>
    </section>
  );
}
