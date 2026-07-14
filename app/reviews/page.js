import ArcDivider from "@/components/ArcDivider";
import ReviewForm from "@/components/ReviewForm";
import { readData } from "@/lib/db";

export const metadata = {
  title: "Reviews | Beauty Mantra by Chathu",
  description: "Read client reviews or share your own experience at Beauty Mantra by Chathu.",
};

export const dynamic = "force-dynamic";

export default function ReviewsPage() {
  const reviews = readData("reviews")
    .filter((r) => r.status === "approved")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <section className="bm-section">
      <div className="container">
        <div className="text-center mb-5">
          <div className="bm-eyebrow mb-2">Client Love</div>
          <h1 className="bm-display bm-section-title">Reviews</h1>
          <ArcDivider />
          {avgRating && (
            <p className="mb-0">
              <span className="bm-star fs-4">{"★".repeat(Math.round(avgRating))}</span>{" "}
              <span className="fw-medium">{avgRating} / 5</span>{" "}
              <span className="small" style={{ color: "var(--bm-ink-soft)" }}>
                ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
              </span>
            </p>
          )}
        </div>

        <div className="row g-5">
          <div className="col-lg-7">
            {reviews.length === 0 ? (
              <p className="text-center" style={{ color: "var(--bm-ink-soft)" }}>
                No reviews yet — be the first to share your experience!
              </p>
            ) : (
              <div className="row g-4">
                {reviews.map((review) => (
                  <div className="col-sm-6" key={review.id}>
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
          </div>
          <div className="col-lg-5">
            <ReviewForm />
          </div>
        </div>
      </div>
    </section>
  );
}
