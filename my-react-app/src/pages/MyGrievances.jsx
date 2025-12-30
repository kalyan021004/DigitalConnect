import { useEffect, useState } from "react";
import { myGrievances } from "../api/grievanceApi";
import { useNavigate } from "react-router-dom";

export default function MyGrievances() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    myGrievances().then(res => {
      setGrievances(res.data || []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="container my-5 text-center">Loading...</div>;
  if (grievances.length === 0) return <div className="container my-5 text-center">No grievances submitted.</div>;

  return (
    <div className="container my-5">
      <h2 className="page-title text-center mb-4">My Grievances</h2>

      <div className="row g-4">
        {grievances.map(g => (
          <div className="col-md-6 col-lg-4" key={g._id}>
            <div className="card scheme-card h-100"
              role="button"
              onClick={() => navigate(`/grievances/${g._id}`)}
            >
              <div className="card-body">
                <h5>{g.subject}</h5>
                <p><b>Category:</b> {g.category}</p>
                <p><b>Grievance No:</b> {g.grievanceNumber}</p>
                <span className="badge bg-primary">{g.status.toUpperCase()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
