"use client";

import Link from "next/link";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { services } from "../lib/site";

const links = [
  ["/", "Home"],
  ["/about/", "About us"],
  ["/services/", "Our services"],
  ["/contact/", "Contact"],
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);
  const isService = services.some(
    (service) =>
      pathname === `/${service.slug}/` || pathname === `/${service.slug}`,
  );
  return (
    <header className={open ? "menu-open" : undefined}>
      <Link className="brand" href="/" aria-label="D’ Embassy home" onClick={() => setOpen(false)}>
        <img src="/assets/logo.jpg" alt="D’ Embassy, established 2025" />
      </Link>
      <nav id="main-nav" aria-label="Main navigation">
        {links.map(([href, label]) => {
          const active =
            pathname.replace(/\/$/, "") === href.replace(/\/$/, "") ||
            (href === "/services/" && isService);
          return (
            <Link
              key={href}
              href={href}
              className={active ? "active" : undefined}
              aria-current={active ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <Link className="button gold header-cta" href="/appointment/" onClick={() => setOpen(false)}>
        Book an appointment <span aria-hidden="true">↗</span>
      </Link>
      <button
        className="menu-toggle"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="main-nav"
        onClick={() => setOpen(!open)}
      >
        {open ? "×" : "☰"}
      </button>
    </header>
  );
}
