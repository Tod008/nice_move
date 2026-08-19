import type { Locale } from "./config";
import type { Dictionary } from "./types";
import en from "./dictionaries/en";
import mn from "./dictionaries/mn";

const dictionaries: Record<Locale, Dictionary> = { en, mn };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
