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
  return { title: dict.nav.services };
}

export default async function ServicesPage({ params }: PageProps<"/[locale]/services">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const { servicesPage } = dict;

  return (
    <section className="pt-16 pb-20 sm:pt-24 sm:pb-28">
      <Container>
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-orange">
          {servicesPage.eyebrow}
        </p>
        <h1 className="mt-5 max-w-3xl font-display text-4xl font-black uppercase leading-[0.98] tracking-tight text-ink sm:text-5xl md:text-6xl">
          {servicesPage.title}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink/70 sm:text-lg">
          {servicesPage.intro}
        </p>

        <div className="mt-16 divide-y divide-hairline border-t border-hairline">
          {servicesPage.items.map((item, i) => (
            <div key={item.code} className="grid gap-4 py-10 sm:grid-cols-[auto_1fr] sm:gap-10">
              <div className="flex items-start gap-4 sm:w-40">
                <span className="font-mono text-xs text-mist">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-xs uppercase tracking-[0.15em] text-orange">
                  {item.code}
                </span>
              </div>
              <div className="max-w-2xl">
                <h2 className="font-display text-2xl font-bold uppercase leading-tight text-ink sm:text-3xl">
                  {item.title}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-ink/70">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
