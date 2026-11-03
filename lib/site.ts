import type { Metadata } from "next";
import services from "./services.json";

export { services };
export const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://dembassy.ky";

const descriptions: Record<string, string> = {
  "": "Personal guidance for life, travel and business in the Cayman Islands.",
  about:
    "Meet D’ Embassy, connecting individuals and businesses across borders.",
  services:
    "Explore immigration, visa, passport, business and document services in the Cayman Islands.",
  contact: "Contact D’ Embassy in George Town, Cayman Islands.",
  appointment:
    "Request an appointment with the D’ Embassy team in the Cayman Islands.",
  careers: "Explore career opportunities with the D’ Embassy team.",
};

export const titles: Record<string, string> = {
  "": "Home",
  about: "About us",
  services: "Our services",
  contact: "Contact",
  appointment: "Appointments",
  careers: "Careers",
  ...Object.fromEntries(
    services.map((service) => [service.slug, service.name]),
  ),
};

export function metadataFor(slug: string): Metadata {
  const title = `${titles[slug]} — D’ Embassy`;
  const description =
    services.find((service) => service.slug === slug)?.description ??
    descriptions[slug];
  const url = new URL(slug ? `/${slug}/` : "/", origin).toString();

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "D’ Embassy",
    },
    twitter: { card: "summary", title, description },
  };
}
