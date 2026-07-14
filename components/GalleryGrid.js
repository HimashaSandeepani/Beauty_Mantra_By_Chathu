"use client";

import { useMemo, useState } from "react";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "image", label: "Photos" },
  { key: "video", label: "Videos" },
];

export default function GalleryGrid({ items }) {
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState(null);

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((i) => i.type === filter)),
    [items, filter]
  );

  return (
    <>
      <div className="d-flex justify-content-center gap-2 mb-4 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={filter === f.key ? "btn-bm-gold" : "btn-bm-outline"}
            style={{ borderRadius: "999px" }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center py-5" style={{ color: "var(--bm-ink-soft)" }}>
          No {filter === "all" ? "media" : filter + "s"} added yet. Please check back soon.
        </p>
      ) : (
        <div className="row g-3">
          {filtered.map((item) => (
            <div className="col-6 col-md-4 col-lg-3" key={item.id}>
              <button
                type="button"
                className="bm-gallery-item border-0 p-0 w-100"
                onClick={() => setActive(item)}
                aria-label={`View ${item.caption || item.type}`}
              >
                {item.type === "video" ? (
                  <video src={item.src} muted loop playsInline />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={item.src} alt={item.caption || "Beauty Mantra gallery"} />
                )}
                {item.type === "video" && <span className="bm-media-badge">Video</span>}
              </button>
              {item.caption && (
                <p className="small text-center mt-1 mb-0" style={{ color: "var(--bm-ink-soft)" }}>
                  {item.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActive(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(54,43,30,0.85)",
            zIndex: 1050,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <div style={{ maxWidth: "90vw", maxHeight: "85vh", position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label="Close"
              className="btn-close btn-close-white position-absolute"
              style={{ top: "-2.5rem", right: 0 }}
            />
            {active.type === "video" ? (
              <video
                src={active.src}
                controls
                autoPlay
                style={{ maxWidth: "90vw", maxHeight: "80vh", borderRadius: 4 }}
              />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={active.src}
                alt={active.caption || "Beauty Mantra gallery"}
                style={{ maxWidth: "90vw", maxHeight: "80vh", borderRadius: 4, objectFit: "contain" }}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
