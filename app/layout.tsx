import type { Metadata } from "next";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { origin } from "../lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: "D’ Embassy",
  description: "Personal guidance in the Cayman Islands.",
  icons: { icon: { url: "/assets/logo.jpg", type: "image/jpeg" } },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const business = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "D’ Embassy",
    url: origin,
    telephone: "+1-345-945-8006",
    email: "admin@dembassy.ky",
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "3rd Floor, Amerigo House, Elizabethan Square, 80 Shedden Road",
      addressLocality: "George Town",
      addressCountry: "KY",
    },
  };

  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(business).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
