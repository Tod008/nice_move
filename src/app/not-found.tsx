import "./globals.css";

export default function RootNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper font-sans text-ink antialiased">
      <div className="px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-orange">404</p>
        <h1 className="mt-4 text-3xl font-bold uppercase tracking-tight text-ink">
          Route not found
        </h1>
        <p className="mt-3 text-base text-ink/70">
          That page doesn&apos;t exist. / Энэ хуудас олдсонгүй.
        </p>
        <a
          href="/en"
          className="mt-8 inline-block rounded-sm bg-indigo px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-paper transition-colors hover:bg-indigo-deep"
        >
          Back to home
        </a>
      </div>
    </div>
  );
}
