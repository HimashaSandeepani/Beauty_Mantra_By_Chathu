"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ArcDivider from "@/components/ArcDivider";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed.");
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  return (
    <section className="bm-admin-shell">
      <div className="container" style={{ maxWidth: 420 }}>
        <div className="text-center mb-4">
          <div className="bm-eyebrow mb-2">Staff Only</div>
          <h1 className="bm-display bm-section-title">Admin Login</h1>
          <ArcDivider />
        </div>
        <form className="bm-admin-card p-4 p-md-5" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small bm-eyebrow" htmlFor="admin-password">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              className="form-control bm-form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
            />
          </div>
          {status === "error" && (
            <div className="alert alert-danger small py-2" role="alert">
              {error}
            </div>
          )}
          <button type="submit" className="btn-bm-gold w-100" disabled={status === "submitting"}>
            {status === "submitting" ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </section>
  );
}
