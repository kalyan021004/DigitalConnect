import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { allApplications } from "../api/applicationApi";

export default function AdminApplications() {
  const navigate = useNavigate();

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await allApplications();
        setApps(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="container my-5 text-center">
        <span className="spinner-border text-primary"></span>
        <p className="mt-2 text-muted">Loading applications...</p>
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger text-center">
          {error}
        </div>
      </div>
    );
  }

  /* ================= EMPTY ================= */
  if (apps.length === 0) {
    return (
      <div className="container my-5">
        <div className="alert text-center">
          No applications found.
        </div>
      </div>
    );
  }

  /* ================= MAIN UI ================= */
  return (
    <div className="container my-5">
      {/* HEADER */}
      <div className="mb-4 text-center">
        <h2 className="page-title">All Scheme Applications</h2>
        <p className="page-subtitle">
          Review and manage citizen scheme applications
        </p>
      </div>

      {/* APPLICATION LIST */}
      <div className="row g-4">
        {apps.map(app => (
          <div className="col-md-6 col-lg-4" key={app._id}>
            <div
              className="card scheme-card h-100"
              role="button"
              onClick={() => navigate(`/applications/${app._id}`)}
            >
              <div className="card-body d-flex flex-column">

                {/* SCHEME NAME */}
                <h5 className="mb-2">
                  {app.scheme?.name || "Unknown Scheme"}
                </h5>

                {/* USER */}
                <p className="mb-1">
                  <b>Applicant:</b>{" "}
                  <span >
                    {app.user?.name || "Unknown User"}
                  </span>
                </p>

                {/* APPLICATION NO */}
                <p className="mb-2">
                  <b>Application No:</b>{" "}
                  <span >
                    {app.applicationNumber || "N/A"}
                  </span>
                </p>

                {/* STATUS */}
                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <span
                    className={`badge ${
                      app.status === "approved"
                        ? "bg-success"
                        : app.status === "rejected"
                        ? "bg-danger"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {app.status.toUpperCase()}
                  </span>

                  <span className="small">
                    View Details →
                  </span>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
