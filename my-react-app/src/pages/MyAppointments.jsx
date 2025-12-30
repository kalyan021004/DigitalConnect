import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function MyAppointments() {
  const navigate = useNavigate();

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get("/appointments/mine");
        setApps(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="container my-5 text-center">
        <span className="spinner-border text-primary"></span>
        <p className="mt-2">Loading your appointments...</p>
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
          No appointments found.
        </div>
      </div>
    );
  }

  /* ================= MAIN UI ================= */
  return (
    <div className="container my-5">
      {/* HEADER */}
      <div className="text-center mb-4">
        <h2 className="page-title">My Appointments</h2>
        <p className="page-subtitle">
          View and track your doctor appointments
        </p>
      </div>

      {/* APPOINTMENT LIST */}
      <div className="row g-4">
        {apps.map(app => (
          <div className="col-md-6 col-lg-4" key={app._id}>
            <div
              className="card scheme-card h-100"
              role="button"
              onClick={() => navigate(`/appointments/${app._id}`)}
            >
              <div className="card-body d-flex flex-column">

                {/* DOCTOR NAME */}
                <h5 className="mb-2">
                  Dr. {app.doctor?.name || "Doctor not assigned"}
                </h5>

                {/* DATE & TIME */}
                <p className="mb-1">
                  <b>Date:</b>{" "}
                  {new Date(app.appointmentDate).toDateString()}
                </p>
                <p className="mb-2">
                  <b>Time:</b> {app.timeSlot}
                </p>

                {/* STATUS */}
                <div className="mt-auto d-flex justify-content-between align-items-center">
                  <span
                    className={`badge ${
                      app.status === "confirmed"
                        ? "bg-success"
                        : app.status === "cancelled"
                        ? "bg-danger"
                        : app.status === "completed"
                        ? "bg-primary"
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
