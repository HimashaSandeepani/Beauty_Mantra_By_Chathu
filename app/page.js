import Image from "next/image";
import Link from "next/link";
import ArcDivider from "@/components/ArcDivider";
import {
  SALON_NAME,
  SALON_TAGLINE,
  SALON_SUBLINE,
  buildWhatsAppLink,
} from "@/lib/salonInfo";
import { readData } from "@/lib/db";
import { readServiceMenu } from "@/lib/serviceMenu";

export default function HomePage() {
  const reviews = readData("reviews").filter((r) => r.status === "approved").slice(0, 3);
  const gallery = readData("gallery").slice(0, 6);
  const { packages } = readServiceMenu();

  return (
    <>
      {/* Hero */}
      <section className="bm-hero">
        <div className="container">
          <div className="row align-items-center gy-5">
            <div className="col-lg-6 text-center text-lg-start order-2 order-lg-1">
              <div className="bm-eyebrow mb-3">Dubai · Beauty &amp; Wellness Studio</div>
              <h1 className="bm-display mb-4">
                Radiate Your Beauty.
                <br />
                Embrace Your Confidence.
              </h1>
              <p className="lead mb-4">
                {SALON_NAME} {SALON_TAGLINE} is a home-studio sanctuary for facials, waxing,
                massage and grooming - thoughtful treatments, unhurried appointments, and
                results you can feel.
              </p>
              <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
                <a
                  href={buildWhatsAppLink("Hi Beauty Mantra! I'd like to book an appointment.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-bm-gold"
                >
                  Book on WhatsApp
                </a>
                <Link href="/services" className="btn-bm-outline">
                  View Services
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center order-1 order-lg-2">
              <Image
                src="/logo.png"
                alt={`${SALON_NAME} ${SALON_TAGLINE} logo`}
                width={340}
                height={340}
                className="bm-hero-logo"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="bm-section bm-section-alt">
        <div className="container">
          <div className="text-center mb-5">
            <div className="bm-eyebrow mb-2">Why Beauty Mantra</div>
            <h2 className="bm-section-title">A Little Ritual, Every Visit</h2>
            <ArcDivider />
          </div>
          <div className="row g-4">
            {[
              {
                icon: "bi-flower3",
                title: "Personal Attention",
                text: "Every appointment is one-on-one, paced around you rather than a schedule of walk-ins.",
              },
              {
                icon: "bi-droplet-half",
                title: "Skin-First Treatments",
                text: "Facials, bleaching and cleanups chosen to suit your skin, not a one-size routine.",
              },
              {
                icon: "bi-whatsapp",
                title: "Easy WhatsApp Booking",
                text: "No apps or accounts - just message us and we'll confirm your slot directly.",
              },
            ].map((item) => (
              <div className="col-md-4" key={item.title}>
                <div className="bm-card text-center">
                  <i className={`bi ${item.icon} fs-1 mb-3`} style={{ color: "var(--bm-gold)" }} />
                  <h3 className="h5 mb-2">{item.title}</h3>
                  <p className="small mb-0" style={{ color: "var(--bm-ink-soft)" }}>
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages preview */}
      <section className="bm-section">
        <div className="container">
          <div className="text-center mb-5">
            <div className="bm-eyebrow mb-2">Value Bundles</div>
            <h2 className="bm-section-title">Mix &amp; Match Packages</h2>
            <ArcDivider />
            <p className="mx-auto" style={{ maxWidth: 560, color: "var(--bm-ink-soft)" }}>
              Combine any services from our menu into one of these bundles - WhatsApp us to
              build yours.
            </p>
          </div>
          <div className="row g-4 justify-content-center">
            {packages.map((pkg) => (
              <div className="col-sm-6 col-lg-4" key={pkg.id}>
                <div className="bm-package-card">
                  <div className="count">{pkg.count}</div>
                  <div className="bm-eyebrow mb-2">Services</div>
                  <div className="price">AED {pkg.price}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <Link href="/services" className="btn-bm-outline">
              See Full Service Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery teaser */}
      {gallery.length > 0 && (
        <section className="bm-section bm-section-alt">
          <div className="container">
            <div className="text-center mb-5">
              <div className="bm-eyebrow mb-2">From The Studio</div>
              <h2 className="bm-section-title">Gallery</h2>
              <ArcDivider />
            </div>
            <div className="row g-3">
              {gallery.map((item) => (
                <div className="col-6 col-md-4 col-lg-2" key={item.id}>
                  <div className="bm-gallery-item">
                    {item.type === "video" ? (
                      <video src={item.src} muted loop playsInline />
                    ) : (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={item.src} alt={item.caption || "Beauty Mantra gallery"} />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-5">
              <Link href="/gallery" className="btn-bm-outline">
                View Full Gallery
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Reviews teaser */}
      <section className="bm-section">
        <div className="container">
          <div className="text-center mb-5">
            <div className="bm-eyebrow mb-2">Client Love</div>
            <h2 className="bm-section-title">What Clients Say</h2>
            <ArcDivider />
          </div>
          {reviews.length === 0 ? (
            <p className="text-center" style={{ color: "var(--bm-ink-soft)" }}>
              Be the first to share your experience.
            </p>
          ) : (
            <div className="row g-4">
              {reviews.map((review) => (
                <div className="col-md-4" key={review.id}>
                  <div className="bm-review-card">
                    <div className="bm-star mb-2">
                      {"★".repeat(review.rating)}
                      <span className="dim">{"★".repeat(5 - review.rating)}</span>
                    </div>
                    <p className="small mb-3" style={{ color: "var(--bm-ink-soft)" }}>
                      "{review.message}"
                    </p>
                    <div className="fw-medium small">— {review.name}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-5">
            <Link href="/reviews" className="btn-bm-outline">
              Read All Reviews
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
