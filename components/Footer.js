import Link from "next/link";
import Image from "next/image";
import {
  SALON_NAME,
  SALON_TAGLINE,
  SALON_MOTTO,
  DISPLAY_PHONE,
  buildWhatsAppLink,
} from "@/lib/salonInfo";

export default function Footer() {
  return (
    <footer className="bm-footer">
      <div className="container">
        <div className="row gy-4">
          <div className="col-md-4">
            <div className="brand-text d-flex align-items-center gap-2 mb-3">
              <Image src="/logo.png" alt={SALON_NAME} width={40} height={40} />
              <div>
                <div className="brand-main" style={{ fontFamily: "var(--bm-font-display)", fontSize: "1.2rem" }}>
                  {SALON_NAME}
                </div>
                <div style={{ fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--bm-gold)" }}>
                  {SALON_TAGLINE}
                </div>
              </div>
            </div>
            <p className="small mb-0" style={{ color: "rgba(248,239,224,0.7)" }}>
              {SALON_MOTTO}
            </p>
          </div>
          <div className="col-md-4">
            <div className="bm-eyebrow mb-3" style={{ color: "var(--bm-gold)" }}>Explore</div>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link href="/services">Services &amp; Packages</Link></li>
              <li><Link href="/gallery">Gallery</Link></li>
              <li><Link href="/reviews">Reviews</Link></li>
              <li><Link href="/admin">Admin</Link></li>
            </ul>
          </div>
          <div className="col-md-4">
            <div className="bm-eyebrow mb-3" style={{ color: "var(--bm-gold)" }}>Get In Touch</div>
            <p className="small mb-2">Call / WhatsApp: {DISPLAY_PHONE}</p>
            <a
              href={buildWhatsAppLink("Hi Beauty Mantra! I'd like to book an appointment.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-bm-whatsapp"
            >
              <i className="bi bi-whatsapp" aria-hidden="true" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
        <hr className="mt-4" style={{ borderColor: "rgba(248,239,224,0.15)" }} />
        <p className="small text-center mb-0" style={{ color: "rgba(248,239,224,0.55)" }}>
          © {new Date().getFullYear()} {SALON_NAME} {SALON_TAGLINE}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
