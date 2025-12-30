import { useEffect, useState } from "react";
import { allGrievances, updateGrievance } from "../api/grievanceApi";
import { useNavigate } from "react-router-dom";

export default function PanchayatGrievances() {
  const navigate = useNavigate();
  const [grievances, setGrievances] = useState([]);

  useEffect(() => {
    allGrievances().then(res => setGrievances(res.data || []));
  }, []);

  const updateStatus = async (id, status) => {
    await updateGrievance(id, { status });
    setGrievances(prev => prev.map(g => g._id === id ? { ...g, status } : g));
  };

  return (
    <div className="container my-5">
      <h2 className="page-title text-center mb-4">Village Grievances</h2>

      <div className="row g-4">
        {grievances.map(g => (
          <div className="col-md-6 col-lg-4" key={g._id}>
            <div className="card scheme-card h-100"
              role="button"
              onClick={() => navigate(`/grievances/${g._id}`)}
            >
              <div className="card-body">
                <h5>{g.subject}</h5>
                <p>{g.category}</p>
                <p>Citizen: {g.user?.name}</p>
                <span className="badge bg-info">{g.status}</span>

                <div className="d-flex gap-2 mt-3">
                  <button className="btn btn-warning btn-sm" onClick={() => updateStatus(g._id, "under_review")}>Review</button>
                  <button className="btn btn-success btn-sm" onClick={() => updateStatus(g._id, "resolved")}>Resolve</button>
                  <button className="btn btn-danger btn-sm" onClick={() => updateStatus(g._id, "rejected")}>Reject</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
