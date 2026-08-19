import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { siteUrl } from "@/lib/site";

const paths = ["", "/about", "/services", "/partners", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified: new Date(),
    }))
  );
}
