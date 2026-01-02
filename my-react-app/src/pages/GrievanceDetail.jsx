import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getGrievanceById, updateGrievance } from "../api/grievanceApi";
import { useAuth } from "../context/AuthContext";

export default function GrievanceDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [grievance, setGrievance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await getGrievanceById(id);
        setGrievance(res.data);
      } catch {
        setGrievance(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const updateStatus = async (status) => {
    try {
      setActionLoading(true);
      await updateGrievance(id, { status });
      setGrievance(prev => ({
        ...prev,
        status,
        timeline: [
          ...prev.timeline,
          {
            status,
            changedBy: user._id,
            remark: `Marked as ${status}`,
            changedAt: new Date()
          }
        ]
      }));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <span className="spinner-border text-primary"></span>
      </div>
    );
  }

  if (!grievance) {
    return (
      <div className="container my-5 text-center">
        <h5>Grievance not found</h5>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="card scheme-card p-4 shadow-lg">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-start flex-wrap">
          <div>
            <h3 className="mb-1">{grievance.subject}</h3>
            <p className="text-muted mb-1">
              Grievance No: <b>{grievance.grievanceNumber}</b>
            </p>
            <span className={`badge ${
              grievance.status === "resolved"
                ? "bg-success"
                : grievance.status === "rejected"
                ? "bg-danger"
                : grievance.status === "under_review"
                ? "bg-warning text-dark"
                : "bg-secondary"
            }`}>
              {grievance.status}
            </span>
          </div>
        </div>

        <hr />

        {/* DESCRIPTION */}
        <h5>Description</h5>
        <p>{grievance.description}</p>

        <hr />

        {/* CATEGORY + LOCATION */}
        <div className="row">
          <div className="col-md-6">
            <h6>Category</h6>
            <p>{grievance.category}</p>
          </div>
          <div className="col-md-6">
            <h6>Location</h6>
            <p>
              Village: {grievance.location?.village || "N/A"} <br />
              Landmark: {grievance.location?.landmark || "N/A"}
            </p>
          </div>
        </div>

        <hr />

        {/* CITIZEN */}
        <h5>Citizen Details</h5>
        <p><b>Name:</b> {grievance.user?.name}</p>
        <p><b>Email:</b> {grievance.user?.email}</p>

        <hr />

        {/* ATTACHMENTS */}
        <h5>Attachments</h5>

        {grievance.attachments && grievance.attachments.length > 0 ? (
          <div className="row g-3">
            {grievance.attachments.map((att, i) => (
              <div className="col-md-4 col-sm-6" key={i}>
                <a href={att.url} target="_blank" rel="noreferrer">
                  <img
                    src={att.url}
                    alt={`attachment-${i}`}
                    className="img-fluid rounded shadow-sm"
                    style={{
                      height: "150px",
                      width: "100%",
                      objectFit: "cover"
                    }}
                  />
                </a>
                <small className="text-muted d-block mt-1">
                  Uploaded on{" "}
                  {new Date(att.uploadedAt).toLocaleDateString()}
                </small>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No attachments uploaded</p>
        )}

        <hr />

        {/* STATUS TIMELINE */}
        <h5>Status Timeline</h5>
        <ul className="list-group mb-3">
          {grievance.timeline?.map((t, i) => (
            <li key={i} className="list-group-item">
              <b>{t.status}</b>
              <div className="text-muted small">
                {t.remark || "-"} <br />
                {t.changedAt
                  ? new Date(t.changedAt).toLocaleString()
                  : ""}
              </div>
            </li>
          ))}
        </ul>

        {/* ACTIONS */}
        {user?.role === "gram_panchayat" && (
          <>
            <hr />
            <h5>Actions</h5>
            <div className="d-flex gap-2 flex-wrap">
              <button
                className="btn btn-warning btn-sm"
                disabled={actionLoading}
                onClick={() => updateStatus("under_review")}
              >
                Under Review
              </button>

              <button
                className="btn btn-success btn-sm"
                disabled={actionLoading}
                onClick={() => updateStatus("resolved")}
              >
                Resolve
              </button>

              <button
                className="btn btn-danger btn-sm"
                disabled={actionLoading}
                onClick={() => updateStatus("rejected")}
              >
                Reject
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
