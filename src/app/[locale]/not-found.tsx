import Link from "next/link";
import { Container } from "@/components/Container";

export default function NotFound() {
  return (
    <section className="flex flex-1 items-center py-24">
      <Container>
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-orange">404</p>
        <h1 className="mt-5 font-display text-4xl font-black uppercase leading-[0.98] tracking-tight text-ink sm:text-5xl">
          Route not found
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-ink/70">
          That page doesn&apos;t exist. / Энэ хуудас олдсонгүй.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-sm bg-indigo px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-paper transition-colors hover:bg-indigo-deep"
        >
          Back to home
        </Link>
      </Container>
    </section>
  );
}
