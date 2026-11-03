"use client";

import Link from "next/link";

import { useState } from "react";
import { services } from "../lib/site";

const filters = [
  ["all", "All services"],
  ["individual", "For individuals"],
  ["business", "For businesses"],
  ["documents", "Documents"],
] as const;

function ServiceIcon({ name }: { name: string }) {
  const shapes: Record<string, React.ReactNode> = {
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <path d="M3 12h18M5 6h14M5 18h14" />
      </>
    ),
    plane: <path d="m21 3-7 18-3-8-8-3 18-7Z M11 13 21 3" />,
    passport: (
      <>
        <rect x="5" y="3" width="14" height="18" rx="1" />
        <circle cx="12" cy="10" r="4" />
        <path d="M8 10h8M12 6v8M9 17h6" />
      </>
    ),
    building: (
      <path d="M4 21V7h8V3h8v18M2 21h20M8 10v2M8 15v2M16 7v2M16 12v2M16 17v4" />
    ),
    leaf: <path d="M20 3C7 2 3 8 5 15s14 4 15-12ZM4 21 15 9" />,
    pen: <path d="m4 16 12-12 4 4L8 20H4v-4ZM13 7l4 4M12 21h9" />,
    file: <path d="M6 3h9l4 4v14H6zM15 3v5h4M9 12h7M9 16h7" />,
  };
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {shapes[name]}
    </svg>
  );
}

export function ServiceDirectory() {
  const [category, setCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  const results = services.filter(
    (service) =>
      (category === "all" || service.category === category) &&
      [service.name, service.description, ...service.items]
        .join(" ")
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );

  return (
    <>
      <div className="filters" role="group" aria-label="Filter services">
        {filters.map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={`filter${category === value ? " active" : ""}`}
            aria-pressed={category === value}
            onClick={() => setCategory(value)}
          >
            {label}
          </button>
        ))}
        <div className="search">
          <input
            type="search"
            id="service-search"
            aria-label="Search services"
            placeholder="Search services…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>
      <div className="service-grid" id="service-results" aria-live="polite">
        {results.map((service) => (
          <Link
            className="service-card"
            href={`/${service.slug}/`}
            key={service.slug}
          >
            <ServiceIcon name={service.icon} />
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <span className="mini">{service.tag}</span>
            <span className="arrow" aria-hidden="true">
              ↗
            </span>
          </Link>
        ))}
        {results.length === 0 && (
          <p className="empty">
            No services match your search. Try “passport”, “business” or contact
            our team.
          </p>
        )}
        {category === "all" && !query.trim() && (
          <div className="service-card callout">
            <h3>Not sure where to start?</h3>
            <p>
              Tell us about your plans. We’ll help you find the right service.
            </p>
            <Link className="text-link" href="/contact/">
              Talk to our team ↗
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
