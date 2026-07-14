import { buildWhatsAppLink } from "@/lib/salonInfo";

export default function WhatsAppFloat() {
  return (
    <a
      href={buildWhatsAppLink("Hi Beauty Mantra! I'd like to book an appointment.")}
      target="_blank"
      rel="noopener noreferrer"
      className="bm-whatsapp-float btn-bm-whatsapp"
      aria-label="Book an appointment on WhatsApp"
    >
      <i className="bi bi-whatsapp fs-5" aria-hidden="true" />
      <span className="d-none d-sm-inline">Book Now</span>
    </a>
  );
}
