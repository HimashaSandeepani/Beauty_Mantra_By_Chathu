export const SALON_NAME = "Beauty Mantra";
export const SALON_TAGLINE = "By Chathu";
export const SALON_MOTTO = "Beauty • Confidence • You";
export const SALON_SUBLINE = "Radiate your beauty. Embrace your confidence.";

// Stored digits-only, international format (UAE), used to build wa.me links
export const WHATSAPP_NUMBER = "971527422431";
export const DISPLAY_PHONE = "052 742 2431";

export function buildWhatsAppLink(message) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export const DEFAULT_SERVICE_COLUMNS = [
  [
    { name: "Eyebrow" },
    { name: "Upper Lip" },
    { name: "Chin" },
    { name: "Full Face", credits: 2 },
    { name: "Eyebrow Color", credits: 1 },
    { name: "Face Wax", credits: 2 },
    { name: "Cleanup", credits: 2 },
    { name: "Facial", credits: 3 },
    { name: "Face Bleaching", credits: 1 },
    { name: "Hair Trimming", credits: 1 },
    { name: "Manicure" },
    { name: "Pedicure", credits: 2 },
    { name: "Callus Treatment" },
  ],
  [
    { name: "Under Arm Wax", credits: 1 },
    { name: "Half Arm Wax", credits: 1 },
    { name: "Full Arm Wax", credits: 2 },
    { name: "Half Leg Wax", credits: 1 },
    { name: "Full Legs Wax", credits: 2 },
    { name: "Hot Oil Treatment", credits: 3 },
    { name: "Back Massage", credits: 3, duration: "20 min" },
    { name: "Head Massage", credits: 2, duration: "15 min" },
    { name: "Foot Massage", credits: 2, duration: "15 min" },
  ],
];

export const DEFAULT_PACKAGES = [
  { count: 4, price: 100 },
  { count: 7, price: 150 },
  { count: 10, price: 200 },
];

export const SERVICE_COLUMNS = DEFAULT_SERVICE_COLUMNS;
export const PACKAGES = DEFAULT_PACKAGES;
