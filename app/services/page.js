import ArcDivider from "@/components/ArcDivider";
import { buildWhatsAppLink } from "@/lib/salonInfo";
import { groupServicesByColumn, readServiceMenu } from "@/lib/serviceMenu";

export const metadata = {
  title: "Services & Packages | Beauty Mantra by Chathu",
  description: "Explore facials, waxing, massage and grooming services and value packages at Beauty Mantra by Chathu.",
};

export default function ServicesPage() {
  const { services, packages } = readServiceMenu();
  const serviceColumns = groupServicesByColumn(services);

  return (
    <>
      <section className="bm-hero py-5">
        <div className="container text-center">
          <div className="bm-eyebrow mb-2">Our Menu</div>
          <h1 className="bm-display mb-3">Services</h1>
          <ArcDivider />
          <p className="mx-auto" style={{ maxWidth: 560, color: "var(--bm-ink-soft)" }}>
            Every treatment below can be combined into a package. Numbers shown are the
            credit-weight of each service toward a bundle.
          </p>
        </div>
      </section>

      <section className="bm-section bm-section-alt">
        <div className="container">
          <div className="row g-4">
            {serviceColumns.map((column, colIdx) => (
              <div className="col-md-6" key={colIdx}>
                <div className="bm-card">
                  <ul className="bm-service-list">
                    {column.map((service) => (
                      <li key={service.name}>
                        <span>
                          {service.name}
                          {service.duration ? (
                            <span className="text-muted"> ({service.duration})</span>
                          ) : null}
                        </span>
                        {service.credits ? (
                          <span className="credits">{service.credits} credits</span>
                        ) : (
                          <span className="credits">1 credit</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bm-section">
        <div className="container">
          <div className="text-center mb-5">
            <div className="bm-eyebrow mb-2">Bundle &amp; Save</div>
            <h2 className="bm-section-title">Packages</h2>
            <ArcDivider />
          </div>
          <div className="row g-4 justify-content-center">
            {packages.map((pkg) => (
              <div className="col-sm-6 col-lg-4" key={pkg.id}>
                <div className="bm-package-card">
                  <div className="count">{pkg.count}</div>
                  <div className="bm-eyebrow mb-2">Services, Any Combination</div>
                  <div className="price mb-3">AED {pkg.price}</div>
                  <a
                    href={buildWhatsAppLink(
                      `Hi Beauty Mantra! I'd like to book the ${pkg.count} services for AED ${pkg.price} package.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-bm-outline"
                  >
                    Book This Package
                  </a>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center mt-5 small" style={{ color: "var(--bm-ink-soft)" }}>
            Please WhatsApp us to combine services into a package or ask about pricing for
            individual treatments.
          </p>
          <div className="text-center">
            <a
              href={buildWhatsAppLink("Hi Beauty Mantra! I have a question about your services.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-bm-whatsapp"
            >
              <i className="bi bi-whatsapp" aria-hidden="true" />
              Ask on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
