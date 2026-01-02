import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function DoctorAppointments() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/appointments/doctor");
      setAppointments(res.data || []);
      setFiltered(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  /* 🔍 FILTER + SEARCH */
  useEffect(() => {
    let data = [...appointments];

    if (statusFilter !== "all") {
      data = data.filter(a => a.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(a =>
        a.patient?.name?.toLowerCase().includes(q) ||
        new Date(a.appointmentDate).toDateString().toLowerCase().includes(q)
      );
    }

    setFiltered(data);
  }, [statusFilter, search, appointments]);

  /* 📊 STATS */
  const total = appointments.length;
  const pending = appointments.filter(a => a.status === "pending").length;
  const confirmed = appointments.filter(a => a.status === "confirmed").length;
  const completed = appointments.filter(a => a.status === "completed").length;

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <span className="spinner-border text-primary"></span>
        <p className="mt-2">Loading appointments...</p>
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

  return (
    <div className="container my-5">

      {/* 🔷 HEADER */}
      <h3 className="mb-4 fw-bold text-white">
        Doctor Appointments Dashboard
      </h3>

      {/* 📊 STATS */}
      <div className="row g-3 mb-4">
        <StatCard title="Total" value={total} color="primary" />
        <StatCard title="Pending" value={pending} color="warning" />
        <StatCard title="Confirmed" value={confirmed} color="success" />
        <StatCard title="Completed" value={completed} color="info" />
      </div>

      {/* 🔍 FILTER BAR */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Search by patient name or date"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* 📋 TABLE */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Appointment ID</th>
              <th>Patient</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map(app => (
              <tr key={app._id}>
                <td>{app._id.slice(-6).toUpperCase()}</td>
                <td>{app.patient?.name || "Unknown"}</td>
                <td>{new Date(app.appointmentDate).toDateString()}</td>
                <td>{app.timeSlot}</td>

                <td>
                  <span className={`badge ${
                    app.status === "confirmed"
                      ? "bg-success"
                      : app.status === "completed"
                      ? "bg-info"
                      : app.status === "cancelled"
                      ? "bg-danger"
                      : "bg-warning text-dark"
                  }`}>
                    {app.status.toUpperCase()}
                  </span>
                </td>

                <td>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() =>
                      navigate(`/doctor/appointments/${app._id}`)
                    }
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No appointments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

/* 🔹 STAT CARD */
function StatCard({ title, value, color }) {
  return (
    <div className="col-6 col-md-3">
      <div className={`card border-${color} shadow-sm`}>
        <div className="card-body text-center">
          <h6 className="text-muted fw-semibold">{title}</h6>
          <h3 className={`text-${color} fw-bold`}>{value}</h3>
        </div>
      </div>
    </div>
  );
}
