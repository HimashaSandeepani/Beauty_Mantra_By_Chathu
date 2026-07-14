"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SALON_NAME, SALON_TAGLINE, buildWhatsAppLink } from "@/lib/salonInfo";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/reviews", label: "Reviews" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg bm-navbar sticky-top py-2">
      <div className="container">
        <Link href="/" className="navbar-brand">
          <Image src="/logo.png" alt={SALON_NAME} width={46} height={46} priority />
          <span className="brand-text">
            <span className="brand-main">{SALON_NAME}</span>
            <span className="brand-sub">{SALON_TAGLINE}</span>
          </span>
        </Link>
        <button
          className="navbar-toggler border-0"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className={`collapse navbar-collapse ${open ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
            {LINKS.map((link) => (
              <li className="nav-item" key={link.href}>
                <Link
                  href={link.href}
                  className={`nav-link ${pathname === link.href ? "active" : ""}`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
              <a
                href={buildWhatsAppLink("Hi Beauty Mantra! I'd like to book an appointment.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-bm-whatsapp"
                onClick={() => setOpen(false)}
              >
                <i className="bi bi-whatsapp" aria-hidden="true" />
                Book Now
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
