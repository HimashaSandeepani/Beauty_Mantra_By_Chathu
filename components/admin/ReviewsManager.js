"use client";

import { useEffect, useState } from "react";

export default function ReviewsManager() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/reviews");
    const data = await res.json();
    setReviews(data.reviews || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(id, status) {
    const res = await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this review permanently?")) return;
    const res = await fetch(`/api/admin/reviews?id=${id}`, { method: "DELETE" });
    if (res.ok) setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  const filtered = filter === "all" ? reviews : reviews.filter((r) => r.status === filter);
  const pendingCount = reviews.filter((r) => r.status === "pending").length;

  return (
    <div>
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {[
          { key: "pending", label: `Pending${pendingCount ? ` (${pendingCount})` : ""}` },
          { key: "approved", label: "Approved" },
          { key: "all", label: "All" },
        ].map((f) => (
          <button
            key={f.key}
            type="button"
            className={filter === f.key ? "btn-bm-gold" : "btn-bm-outline"}
            style={{ borderRadius: "999px" }}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="small" style={{ color: "var(--bm-ink-soft)" }}>
          Loading reviews...
        </p>
      ) : filtered.length === 0 ? (
        <p className="small" style={{ color: "var(--bm-ink-soft)" }}>
          No {filter !== "all" ? filter : ""} reviews to show.
        </p>
      ) : (
        <div className="row g-3">
          {filtered.map((review) => (
            <div className="col-md-6" key={review.id}>
              <div className="bm-admin-card p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <div className="fw-medium">{review.name}</div>
                    <div className="bm-star small">
                      {"★".repeat(review.rating)}
                      <span className="dim">{"★".repeat(5 - review.rating)}</span>
                    </div>
                  </div>
                  <span className={`bm-status-pill bm-status-${review.status}`}>
                    {review.status}
                  </span>
                </div>
                <p className="small mb-3" style={{ color: "var(--bm-ink-soft)" }}>
                  "{review.message}"
                </p>
                <div className="d-flex gap-2 flex-wrap">
                  {review.status !== "approved" && (
                    <button
                      type="button"
                      className="btn-bm-gold"
                      style={{ padding: "0.4rem 0.9rem", fontSize: "0.72rem" }}
                      onClick={() => setStatus(review.id, "approved")}
                    >
                      Approve
                    </button>
                  )}
                  {review.status !== "pending" && (
                    <button
                      type="button"
                      className="btn-bm-outline"
                      style={{ padding: "0.4rem 0.9rem", fontSize: "0.72rem" }}
                      onClick={() => setStatus(review.id, "pending")}
                    >
                      Unapprove
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn-bm-outline"
                    style={{ padding: "0.4rem 0.9rem", fontSize: "0.72rem" }}
                    onClick={() => handleDelete(review.id)}
                  >
                    <i className="bi bi-trash3 me-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
