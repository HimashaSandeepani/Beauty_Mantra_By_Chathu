"use client";

import { useState } from "react";

export default function ReviewForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message, rating }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setStatus("success");
      setName("");
      setMessage("");
      setRating(5);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  }

  if (status === "success") {
    return (
      <div className="bm-card text-center">
        <i className="bi bi-check-circle fs-1 mb-3" style={{ color: "var(--bm-green)" }} />
        <h3 className="h5 mb-2">Thank you!</h3>
        <p className="small mb-3" style={{ color: "var(--bm-ink-soft)" }}>
          Your review has been submitted and will appear here once approved.
        </p>
        <button type="button" className="btn-bm-outline" onClick={() => setStatus("idle")}>
          Write Another Review
        </button>
      </div>
    );
  }

  return (
    <form className="bm-card" onSubmit={handleSubmit}>
      <h3 className="h5 mb-3">Share Your Experience</h3>

      <div className="mb-3">
        <label className="form-label small bm-eyebrow" htmlFor="review-name">
          Your Name
        </label>
        <input
          id="review-name"
          type="text"
          className="form-control bm-form-control"
          value={name}
          maxLength={80}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <span className="form-label small bm-eyebrow d-block">Rating</span>
        <div className="bm-star fs-3" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="btn btn-link p-0 border-0"
              style={{ color: (hoverRating || rating) >= star ? "var(--bm-gold)" : "rgba(183,134,62,0.25)" }}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
              role="radio"
              aria-checked={rating === star}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label small bm-eyebrow" htmlFor="review-message">
          Your Review
        </label>
        <textarea
          id="review-message"
          className="form-control bm-form-control"
          rows={4}
          maxLength={800}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
      </div>

      {status === "error" && (
        <div className="alert alert-danger small py-2" role="alert">
          {errorMsg}
        </div>
      )}

      <button type="submit" className="btn-bm-gold w-100" disabled={status === "submitting"}>
        {status === "submitting" ? "Submitting..." : "Submit Review"}
      </button>
      <p className="small text-center mt-3 mb-0" style={{ color: "var(--bm-ink-soft)" }}>
        Reviews are checked before they appear publicly.
      </p>
    </form>
  );
}
