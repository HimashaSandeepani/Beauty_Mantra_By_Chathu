import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import BootstrapClient from "@/components/BootstrapClient";

export const metadata = {
  title: "Beauty Mantra by Chathu | Beauty • Confidence • You",
  description:
    "Beauty Mantra by Chathu — facials, waxing, massages and more. Browse our gallery, read reviews, and book your appointment on WhatsApp.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
        <BootstrapClient />
      </body>
    </html>
  );
}
