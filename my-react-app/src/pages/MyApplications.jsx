import { useEffect, useState } from "react";
import { myApplications } from "../api/applicationApi";
import { useNavigate } from "react-router-dom";

export default function MyApplications() {
  const navigate = useNavigate();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyApps = async () => {
      try {
        const res = await myApplications();
        setApps(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    fetchMyApps();
  }, []);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="container my-5 text-center">
        <span className="spinner-border text-primary"></span>
        <p className=" mt-2">Loading your applications...</p>
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
          You have not applied for any schemes yet.
        </div>
      </div>
    );
  }

  /* ================= MAIN UI ================= */
  return (
    <div className="container my-5">
      {/* HEADER */}
      <div className="text-center mb-4">
        <h2 className="page-title">My Applications</h2>
        <p className="page-subtitle">
          Track the status of your scheme applications
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

                {/* APPLICATION NO */}
                <p className=" mb-2">
                  Application No: {app.applicationNumber || "N/A"}
                </p>

                {/* STATUS */}
                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <span
                    className={`badge ${
                      app.status === "approved"
                        ? "bg-success"
                        : app.status === "rejected"
                        ? "bg-danger"
                        : app.status === "under_review"
                        ? "bg-warning text-dark"
                        : "bg-secondary"
                    }`}
                  >
                    {app.status.replace("_", " ").toUpperCase()}
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
