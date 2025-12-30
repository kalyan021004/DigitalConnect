import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { reviewApplication } from "../api/applicationApi";

export default function ApplicationDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await api.get(`/applications/${id}`);
        setApp(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load application details");
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  /* ================= ADMIN STATUS UPDATE ================= */
  const updateStatus = async (status) => {
    try {
      await reviewApplication(app._id, { status });
      alert(`Application marked as ${status}`);
      setApp(prev => ({ ...prev, status }));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  /* ================= UI STATES ================= */

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <span className="spinner-border text-primary"></span>
        <p className="text-muted mt-2">Loading application...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger text-center">
          {error}
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="container my-5 text-center">
        Application not found.
      </div>
    );
  }

  /* ================= MAIN UI ================= */

  return (
    <div className="container my-5">
      <div className="card scheme-card p-4 shadow-lg">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-start flex-wrap mb-3">
          <div>
            <h2 className="mb-1">
              {app.scheme?.name || "Unknown Scheme"}
            </h2>
            <p className= "mb-0">
              Application No: {app.applicationNumber || "N/A"}
            </p>
          </div>

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
        </div>

        <hr />

        {/* APPLICANT DETAILS */}
        <h5 className="mb-3">👤 Applicant Details</h5>
        <p><b>Name:</b> <span >{app.user?.name || "Unknown User"}</span></p>
        <p><b>Email:</b> <span >{app.user?.email || "N/A"}</span></p>
        <p><b>Phone:</b> <span >{app.user?.phone || "N/A"}</span></p>

        {/* ADMIN REMARKS */}
        {app.remarks && (
          <>
            <hr />
            <h5 className="mb-2">📝 Admin Remarks</h5>
            <p className="text-muted">{app.remarks}</p>
          </>
        )}

        {/* ================= ADMIN ACTIONS ================= */}
        {user?.role === "state_admin" && (
          <>
            <hr />
            <h5 className="mb-3">🛠 Admin Actions</h5>

            <div className="d-flex flex-wrap gap-2">
              <button
                className="btn btn-success btn-sm"
                onClick={() => updateStatus("approved")}
              >
                Approve
              </button>

              <button
                className="btn btn-danger btn-sm"
                onClick={() => updateStatus("rejected")}
              >
                Reject
              </button>

              <button
                className="btn btn-warning btn-sm"
                onClick={() => updateStatus("under_review")}
              >
                Under Review
              </button>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => updateStatus("pending_documents")}
              >
                Pending Documents
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
