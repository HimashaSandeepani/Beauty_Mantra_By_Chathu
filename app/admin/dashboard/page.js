"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ArcDivider from "@/components/ArcDivider";
import GalleryManager from "@/components/admin/GalleryManager";
import ReviewsManager from "@/components/admin/ReviewsManager";
import ServicesManager from "@/components/admin/ServicesManager";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState("reviews");

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <section className="bm-admin-shell">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <div>
            <div className="bm-eyebrow mb-2">Admin Dashboard</div>
            <h1 className="bm-display mb-0" style={{ fontSize: "2.2rem" }}>
              Manage Beauty Mantra
            </h1>
          </div>
          <button type="button" className="btn-bm-outline" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2" />
            Log Out
          </button>
        </div>
        <ArcDivider />

        <div className="d-flex gap-2 mb-4">
          <button
            type="button"
            className={tab === "reviews" ? "btn-bm-gold" : "btn-bm-outline"}
            onClick={() => setTab("reviews")}
          >
            <i className="bi bi-chat-quote me-2" />
            Reviews
          </button>
          <button
            type="button"
            className={tab === "gallery" ? "btn-bm-gold" : "btn-bm-outline"}
            onClick={() => setTab("gallery")}
          >
            <i className="bi bi-images me-2" />
            Gallery
          </button>
          <button
            type="button"
            className={tab === "services" ? "btn-bm-gold" : "btn-bm-outline"}
            onClick={() => setTab("services")}
          >
            <i className="bi bi-scissors me-2" />
            Services &amp; Packages
          </button>
        </div>

        {tab === "reviews" ? (
          <ReviewsManager />
        ) : tab === "gallery" ? (
          <GalleryManager />
        ) : (
          <ServicesManager />
        )}
      </div>
    </section>
  );
}
