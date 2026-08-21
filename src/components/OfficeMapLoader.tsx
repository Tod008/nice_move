"use client";

import dynamic from "next/dynamic";
import type { Dictionary } from "@/lib/i18n/types";

const OfficeMap = dynamic(() => import("./OfficeMap").then((m) => m.OfficeMap), {
  ssr: false,
});

export function OfficeMapLoader({ dict }: { dict: Dictionary["footer"]["office"] }) {
  return <OfficeMap dict={dict} />;
}
