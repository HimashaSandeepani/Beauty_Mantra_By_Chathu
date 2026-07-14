"use client";

import { useEffect, useState } from "react";

const EMPTY_SERVICE_FORM = {
  name: "",
  credits: 1,
  duration: "",
  column: 1,
};

const EMPTY_PACKAGE_FORM = {
  count: 4,
  price: 100,
};

export default function ServicesManager() {
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceForm, setServiceForm] = useState(EMPTY_SERVICE_FORM);
  const [packageForm, setPackageForm] = useState(EMPTY_PACKAGE_FORM);
  const [serviceEditId, setServiceEditId] = useState("");
  const [packageEditId, setPackageEditId] = useState("");
  const [serviceBusy, setServiceBusy] = useState(false);
  const [packageBusy, setPackageBusy] = useState(false);
  const [serviceError, setServiceError] = useState("");
  const [packageError, setPackageError] = useState("");

  async function load() {
    setLoading(true);
    const [servicesRes, packagesRes] = await Promise.all([
      fetch("/api/admin/services"),
      fetch("/api/admin/packages"),
    ]);
    const [servicesData, packagesData] = await Promise.all([servicesRes.json(), packagesRes.json()]);
    setServices(servicesData.services || []);
    setPackages(packagesData.packages || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function resetServiceForm() {
    setServiceForm(EMPTY_SERVICE_FORM);
    setServiceEditId("");
    setServiceError("");
  }

  function resetPackageForm() {
    setPackageForm(EMPTY_PACKAGE_FORM);
    setPackageEditId("");
    setPackageError("");
  }

  function beginEditService(service) {
    setServiceEditId(service.id);
    setServiceForm({
      name: service.name || "",
      credits: service.credits || 1,
      duration: service.duration || "",
      column: service.column || 1,
    });
    setServiceError("");
  }

  function beginEditPackage(pkg) {
    setPackageEditId(pkg.id);
    setPackageForm({
      count: pkg.count || 4,
      price: pkg.price || 100,
    });
    setPackageError("");
  }

  async function handleServiceSubmit(e) {
    e.preventDefault();
    setServiceError("");
    setServiceBusy(true);
    try {
      const payload = {
        name: serviceForm.name,
        credits: serviceForm.credits,
        duration: serviceForm.duration,
        column: serviceForm.column,
      };
      const res = await fetch("/api/admin/services", {
        method: serviceEditId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceEditId ? { id: serviceEditId, ...payload } : payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save service.");
      resetServiceForm();
      await load();
    } catch (err) {
      setServiceError(err.message);
    } finally {
      setServiceBusy(false);
    }
  }

  async function handlePackageSubmit(e) {
    e.preventDefault();
    setPackageError("");
    setPackageBusy(true);
    try {
      const payload = {
        count: packageForm.count,
        price: packageForm.price,
      };
      const res = await fetch("/api/admin/packages", {
        method: packageEditId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(packageEditId ? { id: packageEditId, ...payload } : payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save package.");
      resetPackageForm();
      await load();
    } catch (err) {
      setPackageError(err.message);
    } finally {
      setPackageBusy(false);
    }
  }

  async function deleteService(id) {
    if (!confirm("Delete this service permanently?")) return;
    const res = await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setServices((prev) => prev.filter((service) => service.id !== id));
      if (serviceEditId === id) resetServiceForm();
    }
  }

  async function deletePackage(id) {
    if (!confirm("Delete this package permanently?")) return;
    const res = await fetch(`/api/admin/packages?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setPackages((prev) => prev.filter((pkg) => pkg.id !== id));
      if (packageEditId === id) resetPackageForm();
    }
  }

  return (
    <div className="row g-4">
      <div className="col-lg-5">
        <form className="bm-admin-card p-4 mb-4" onSubmit={handleServiceSubmit}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="h6 mb-0">{serviceEditId ? "Edit Service" : "Add Service"}</h3>
            {serviceEditId && (
              <button type="button" className="btn-bm-outline" onClick={resetServiceForm}>
                Cancel
              </button>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label small bm-eyebrow" htmlFor="service-name">
              Service Name
            </label>
            <input
              id="service-name"
              type="text"
              className="form-control bm-form-control"
              maxLength={80}
              value={serviceForm.name}
              onChange={(e) => setServiceForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="row g-3">
            <div className="col-sm-4">
              <label className="form-label small bm-eyebrow" htmlFor="service-credits">
                Credits
              </label>
              <input
                id="service-credits"
                type="number"
                min="1"
                className="form-control bm-form-control"
                value={serviceForm.credits}
                onChange={(e) =>
                  setServiceForm((prev) => ({ ...prev, credits: e.target.value }))
                }
                required
              />
            </div>
            <div className="col-sm-4">
              <label className="form-label small bm-eyebrow" htmlFor="service-column">
                Column
              </label>
              <select
                id="service-column"
                className="form-select bm-form-control"
                value={serviceForm.column}
                onChange={(e) => setServiceForm((prev) => ({ ...prev, column: e.target.value }))}
              >
                <option value={1}>Column 1</option>
                <option value={2}>Column 2</option>
              </select>
            </div>
            <div className="col-sm-4">
              <label className="form-label small bm-eyebrow" htmlFor="service-duration">
                Duration
              </label>
              <input
                id="service-duration"
                type="text"
                className="form-control bm-form-control"
                maxLength={30}
                placeholder="Optional"
                value={serviceForm.duration}
                onChange={(e) => setServiceForm((prev) => ({ ...prev, duration: e.target.value }))}
              />
            </div>
          </div>

          {serviceError && (
            <div className="alert alert-danger small py-2 mt-3" role="alert">
              {serviceError}
            </div>
          )}

          <button type="submit" className="btn-bm-gold w-100 mt-3" disabled={serviceBusy}>
            {serviceBusy ? "Saving..." : serviceEditId ? "Update Service" : "Add Service"}
          </button>
        </form>

        <div className="bm-admin-card p-4">
          <h3 className="h6 mb-3">{serviceEditId ? "Editing service" : "Services"}</h3>
          {loading ? (
            <p className="small mb-0" style={{ color: "var(--bm-ink-soft)" }}>
              Loading services...
            </p>
          ) : services.length === 0 ? (
            <p className="small mb-0" style={{ color: "var(--bm-ink-soft)" }}>
              No services yet. Add the first menu item above.
            </p>
          ) : (
            <div className="d-grid gap-2">
              {services.map((service) => (
                <div key={service.id} className="border rounded-3 p-3">
                  <div className="d-flex justify-content-between gap-3">
                    <div>
                      <div className="fw-medium">{service.name}</div>
                      <div className="small" style={{ color: "var(--bm-ink-soft)" }}>
                        {service.column === 2 ? "Column 2" : "Column 1"} · {service.credits} credits
                        {service.duration ? ` · ${service.duration}` : ""}
                      </div>
                    </div>
                    <div className="d-flex gap-2 flex-wrap justify-content-end">
                      <button
                        type="button"
                        className="btn-bm-outline"
                        style={{ padding: "0.35rem 0.75rem", fontSize: "0.72rem" }}
                        onClick={() => beginEditService(service)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn-bm-outline"
                        style={{ padding: "0.35rem 0.75rem", fontSize: "0.72rem" }}
                        onClick={() => deleteService(service.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="col-lg-7">
        <form className="bm-admin-card p-4 mb-4" onSubmit={handlePackageSubmit}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="h6 mb-0">{packageEditId ? "Edit Package" : "Add Package"}</h3>
            {packageEditId && (
              <button type="button" className="btn-bm-outline" onClick={resetPackageForm}>
                Cancel
              </button>
            )}
          </div>

          <div className="row g-3">
            <div className="col-sm-6">
              <label className="form-label small bm-eyebrow" htmlFor="package-count">
                Services Count
              </label>
              <input
                id="package-count"
                type="number"
                min="1"
                className="form-control bm-form-control"
                value={packageForm.count}
                onChange={(e) => setPackageForm((prev) => ({ ...prev, count: e.target.value }))}
                required
              />
            </div>
            <div className="col-sm-6">
              <label className="form-label small bm-eyebrow" htmlFor="package-price">
                Price (AED)
              </label>
              <input
                id="package-price"
                type="number"
                min="1"
                className="form-control bm-form-control"
                value={packageForm.price}
                onChange={(e) => setPackageForm((prev) => ({ ...prev, price: e.target.value }))}
                required
              />
            </div>
          </div>

          {packageError && (
            <div className="alert alert-danger small py-2 mt-3" role="alert">
              {packageError}
            </div>
          )}

          <button type="submit" className="btn-bm-gold w-100 mt-3" disabled={packageBusy}>
            {packageBusy ? "Saving..." : packageEditId ? "Update Package" : "Add Package"}
          </button>
        </form>

        <div className="bm-admin-card p-4">
          <h3 className="h6 mb-3">{packageEditId ? "Editing package" : "Packages"}</h3>
          {loading ? (
            <p className="small mb-0" style={{ color: "var(--bm-ink-soft)" }}>
              Loading packages...
            </p>
          ) : packages.length === 0 ? (
            <p className="small mb-0" style={{ color: "var(--bm-ink-soft)" }}>
              No packages yet. Add your first bundle above.
            </p>
          ) : (
            <div className="row g-3">
              {packages.map((pkg) => (
                <div className="col-md-6" key={pkg.id}>
                  <div className="border rounded-3 p-3 h-100">
                    <div className="d-flex justify-content-between gap-3 align-items-start">
                      <div>
                        <div className="fw-medium">{pkg.count} services</div>
                        <div className="small" style={{ color: "var(--bm-ink-soft)" }}>
                          AED {pkg.price}
                        </div>
                      </div>
                      <div className="d-flex gap-2 flex-wrap justify-content-end">
                        <button
                          type="button"
                          className="btn-bm-outline"
                          style={{ padding: "0.35rem 0.75rem", fontSize: "0.72rem" }}
                          onClick={() => beginEditPackage(pkg)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn-bm-outline"
                          style={{ padding: "0.35rem 0.75rem", fontSize: "0.72rem" }}
                          onClick={() => deletePackage(pkg.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}