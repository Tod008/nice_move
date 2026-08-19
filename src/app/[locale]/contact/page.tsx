import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";
import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return { title: dict.nav.contact };
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const { contact } = dict;

  return (
    <section className="pt-16 pb-20 sm:pt-24 sm:pb-28">
      <Container>
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-orange">
          {contact.eyebrow}
        </p>
        <h1 className="mt-5 max-w-3xl font-display text-4xl font-black uppercase leading-[0.98] tracking-tight text-ink sm:text-5xl md:text-6xl">
          {contact.title}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink/70 sm:text-lg">
          {contact.intro}
        </p>

        <div className="mt-16 grid gap-16 md:grid-cols-[1.3fr_1fr]">
          <ContactForm contact={contact} />

          <div className="border-t border-hairline pt-8 md:border-l md:border-t-0 md:pl-12 md:pt-0">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist">
              {contact.detailsTitle}
            </h2>
            <dl className="mt-6 space-y-6">
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.15em] text-orange">
                  {contact.addressLabel}
                </dt>
                <dd className="mt-1 text-sm text-ink/70">{contact.address}</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.15em] text-orange">
                  {contact.phoneLabel}
                </dt>
                <dd className="mt-1 text-sm text-ink/70">{contact.phone}</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-[0.15em] text-orange">
                  {contact.emailLabel}
                </dt>
                <dd className="mt-1 text-sm text-ink/70">{contact.email}</dd>
              </div>
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}
