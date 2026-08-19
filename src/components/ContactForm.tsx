"use client";

import { useState, type FormEvent } from "react";
import type { Dictionary } from "@/lib/i18n/types";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm({ contact }: { contact: Dictionary["contact"] }) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-sm border border-hairline bg-white/60 p-6">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-orange">
          {contact.formSuccess}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label={contact.formName}>
          <input
            name="name"
            type="text"
            required
            className="w-full border-b border-hairline bg-transparent py-2 text-ink outline-none transition-colors focus:border-indigo"
          />
        </Field>
        <Field label={contact.formCompany}>
          <input
            name="company"
            type="text"
            className="w-full border-b border-hairline bg-transparent py-2 text-ink outline-none transition-colors focus:border-indigo"
          />
        </Field>
      </div>

      <Field label={contact.formEmail}>
        <input
          name="email"
          type="email"
          required
          className="w-full border-b border-hairline bg-transparent py-2 text-ink outline-none transition-colors focus:border-indigo"
        />
      </Field>

      <Field label={contact.formMessage}>
        <textarea
          name="message"
          required
          rows={5}
          placeholder={contact.formMessagePlaceholder}
          className="w-full resize-none border-b border-hairline bg-transparent py-2 text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-indigo"
        />
      </Field>

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-sm bg-indigo px-6 py-3 font-mono text-xs uppercase tracking-[0.15em] text-paper transition-colors hover:bg-indigo-deep disabled:opacity-60"
        >
          {status === "submitting" ? contact.formSubmitting : contact.formSubmit}
        </button>
        {status === "error" && (
          <p className="font-mono text-xs uppercase tracking-[0.1em] text-orange">
            {contact.formError}
          </p>
        )}
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-mist">{label}</span>
      {children}
    </label>
  );
}
