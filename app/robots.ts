import type { MetadataRoute } from "next";
import { origin } from "../lib/site";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", origin).toString(),
  };
}

export const dynamic = "force-static";
