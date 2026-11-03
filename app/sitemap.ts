import type { MetadataRoute } from "next";
import { origin, titles } from "../lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  return Object.keys(titles).map((slug) => ({
    url: new URL(slug ? `/${slug}/` : "/", origin).toString(),
  }));
}

export const dynamic = "force-static";
