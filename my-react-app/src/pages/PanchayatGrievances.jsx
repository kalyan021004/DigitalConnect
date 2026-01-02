import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  allGrievances,
  updateGrievance
} from "../api/grievanceApi";

export default function PanchayatGrievances() {
  const navigate = useNavigate();

  const [grievances, setGrievances] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    loadGrievances();
  }, []);

  const loadGrievances = async () => {
    setLoading(true);
    const res = await allGrievances();
    setGrievances(res.data || []);
    setFiltered(res.data || []);
    setLoading(false);
  };

  // 🔍 FILTER + SEARCH
  useEffect(() => {
    let data = [...grievances];

    if (statusFilter !== "all") {
      data = data.filter(g => g.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(g =>
        g.grievanceNumber?.toLowerCase().includes(q) ||
        g.subject?.toLowerCase().includes(q) ||
        g.user?.name?.toLowerCase().includes(q)
      );
    }

    setFiltered(data);
  }, [statusFilter, search, grievances]);

  const changeStatus = async (id, status) => {
    try {
      setLoadingId(id);
      await updateGrievance(id, { status });
      await loadGrievances();
    } finally {
      setLoadingId(null);
    }
  };

  // 📊 STATS
  const total = grievances.length;
  const pending = grievances.filter(g => g.status === "submitted").length;
  const review = grievances.filter(g => g.status === "under_review").length;
  const resolved = grievances.filter(g => g.status === "resolved").length;

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <span className="spinner-border text-primary"></span>
      </div>
    );
  }

  return (
    <div className="container my-5">

      <h3 className="mb-4 fw-bold text-white">Grievances Dashboard</h3>

      {/* 📊 DASHBOARD STATS */}
      <div className="row g-3 mb-4">
        <StatCard title="Total" value={total} color="primary" />
        <StatCard title="Submitted" value={pending} color="warning" />
        <StatCard title="Under Review" value={review} color="info" />
        <StatCard title="Resolved" value={resolved} color="success" />
      </div>

      {/* 🔍 FILTER BAR */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Search by grievance no, subject or citizen"
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
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* 📋 TABLE */}
      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>Grievance No</th>
              <th>Subject</th>
              <th>Citizen</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map(g => (
              <tr key={g._id}>
                <td>{g.grievanceNumber}</td>
                <td>{g.subject}</td>
                <td>{g.user?.name}</td>

                <td>
                  <span className={`badge ${
                    g.status === "resolved"
                      ? "bg-success"
                      : g.status === "rejected"
                      ? "bg-danger"
                      : g.status === "under_review"
                      ? "bg-info"
                      : "bg-warning text-dark"
                  }`}>
                    {g.status}
                  </span>
                </td>

                <td className="text-nowrap">

                  {/* 🔥 VIEW BUTTON */}
                  <button
                    className="btn btn-outline-primary btn-sm me-2"
                    onClick={() => navigate(`/grievances/${g._id}`)}
                  >
                    View
                  </button>

                  <button
                    className="btn btn-warning btn-sm me-2"
                    disabled={loadingId === g._id}
                    onClick={() => changeStatus(g._id, "under_review")}
                  >
                    Review
                  </button>

                  <button
                    className="btn btn-success btn-sm me-2"
                    disabled={loadingId === g._id}
                    onClick={() => changeStatus(g._id, "resolved")}
                  >
                    Resolve
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    disabled={loadingId === g._id}
                    onClick={() => changeStatus(g._id, "rejected")}
                  >
                    Reject
                  </button>

                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center">
                  No grievances found
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
          <h6 className="text-muted">{title}</h6>
          <h3 className={`text-${color} fw-bold`}>{value}</h3>
        </div>
      </div>
    </div>
  );
}
