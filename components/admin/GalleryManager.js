"use client";

import { useEffect, useState } from "react";

export default function GalleryManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("upload"); // upload | url
  const [caption, setCaption] = useState("");
  const [urlValue, setUrlValue] = useState("");
  const [urlType, setUrlType] = useState("image");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/gallery");
    const data = await res.json();
    setItems(data.gallery || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      let res;
      if (mode === "upload") {
        if (!file) throw new Error("Please choose an image or video file.");
        const formData = new FormData();
        formData.append("file", file);
        formData.append("caption", caption);
        res = await fetch("/api/admin/gallery", { method: "POST", body: formData });
      } else {
        if (!urlValue.trim()) throw new Error("Please enter a media URL.");
        res = await fetch("/api/admin/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ src: urlValue.trim(), type: urlType, caption }),
        });
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not add media.");
      setCaption("");
      setUrlValue("");
      setFile(null);
      e.target.reset && e.target.reset();
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Remove this item from the gallery?")) return;
    const res = await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
    if (res.ok) setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="row g-4">
      <div className="col-lg-4">
        <form className="bm-admin-card p-4" onSubmit={handleAdd}>
          <h3 className="h6 mb-3">Add Gallery Media</h3>

          <div className="btn-group w-100 mb-3" role="group" aria-label="Add method">
            <button
              type="button"
              className={mode === "upload" ? "btn-bm-gold" : "btn-bm-outline"}
              onClick={() => setMode("upload")}
            >
              Upload File
            </button>
            <button
              type="button"
              className={mode === "url" ? "btn-bm-gold" : "btn-bm-outline"}
              onClick={() => setMode("url")}
            >
              Use URL
            </button>
          </div>

          {mode === "upload" ? (
            <div className="mb-3">
              <label className="form-label small bm-eyebrow" htmlFor="gallery-file">
                Image or Video File
              </label>
              <input
                id="gallery-file"
                type="file"
                className="form-control bm-form-control"
                accept="image/*,video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <div className="form-text">JPG, PNG, WEBP, GIF, MP4, WEBM or MOV. Max 25MB.</div>
            </div>
          ) : (
            <>
              <div className="mb-3">
                <label className="form-label small bm-eyebrow" htmlFor="gallery-url">
                  Media URL
                </label>
                <input
                  id="gallery-url"
                  type="url"
                  className="form-control bm-form-control"
                  placeholder="https://..."
                  value={urlValue}
                  onChange={(e) => setUrlValue(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <span className="form-label small bm-eyebrow d-block">Type</span>
                <div className="btn-group w-100" role="group">
                  <button
                    type="button"
                    className={urlType === "image" ? "btn-bm-gold" : "btn-bm-outline"}
                    onClick={() => setUrlType("image")}
                  >
                    Image
                  </button>
                  <button
                    type="button"
                    className={urlType === "video" ? "btn-bm-gold" : "btn-bm-outline"}
                    onClick={() => setUrlType("video")}
                  >
                    Video
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="mb-3">
            <label className="form-label small bm-eyebrow" htmlFor="gallery-caption">
              Caption (optional)
            </label>
            <input
              id="gallery-caption"
              type="text"
              className="form-control bm-form-control"
              maxLength={140}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

          {error && (
            <div className="alert alert-danger small py-2" role="alert">
              {error}
            </div>
          )}

          <button type="submit" className="btn-bm-gold w-100" disabled={busy}>
            {busy ? "Adding..." : "Add to Gallery"}
          </button>
        </form>
      </div>

      <div className="col-lg-8">
        {loading ? (
          <p className="small" style={{ color: "var(--bm-ink-soft)" }}>
            Loading gallery...
          </p>
        ) : items.length === 0 ? (
          <p className="small" style={{ color: "var(--bm-ink-soft)" }}>
            No media yet. Add your first photo or video using the form.
          </p>
        ) : (
          <div className="row g-3">
            {items.map((item) => (
              <div className="col-6 col-md-4" key={item.id}>
                <div className="bm-gallery-item mb-2">
                  {item.type === "video" ? (
                    <video src={item.src} muted loop playsInline />
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={item.src} alt={item.caption || "Gallery item"} />
                  )}
                  <span className="bm-media-badge">{item.type}</span>
                </div>
                <button
                  type="button"
                  className="btn-bm-outline w-100"
                  style={{ padding: "0.4rem", fontSize: "0.72rem" }}
                  onClick={() => handleDelete(item.id)}
                >
                  <i className="bi bi-trash3 me-1" />
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
