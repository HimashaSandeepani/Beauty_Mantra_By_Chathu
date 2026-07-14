import ArcDivider from "@/components/ArcDivider";
import GalleryGrid from "@/components/GalleryGrid";
import { readData } from "@/lib/db";

export const metadata = {
  title: "Gallery | Beauty Mantra by Chathu",
  description: "Photos and videos from the Beauty Mantra by Chathu studio.",
};

export const dynamic = "force-dynamic";

export default function GalleryPage() {
  const gallery = readData("gallery").sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <section className="bm-section">
      <div className="container">
        <div className="text-center mb-5">
          <div className="bm-eyebrow mb-2">From The Studio</div>
          <h1 className="bm-display bm-section-title">Gallery</h1>
          <ArcDivider />
          <p className="mx-auto" style={{ maxWidth: 560, color: "var(--bm-ink-soft)" }}>
            A look at our space, treatments and results.
          </p>
        </div>
        <GalleryGrid items={gallery} />
      </div>
    </section>
  );
}
