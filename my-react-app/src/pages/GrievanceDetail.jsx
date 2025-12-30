import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getGrievanceById, updateGrievance } from "../api/grievanceApi";
import { useAuth } from "../context/AuthContext";

export default function GrievanceDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [grievance, setGrievance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGrievanceById(id).then(res => {
      setGrievance(res.data);
      setLoading(false);
    });
  }, [id]);

  const updateStatus = async status => {
    await updateGrievance(id, { status });
    setGrievance(prev => ({ ...prev, status }));
  };

  if (loading) return <div className="container my-5 text-center">Loading...</div>;
  if (!grievance) return <div className="container my-5">Not found</div>;

  return (
    <div className="container my-5">
      <div className="card scheme-card p-4 shadow-lg">

        <h2>{grievance.subject}</h2>
        <p><b>Grievance No:</b> {grievance.grievanceNumber}</p>
        <span className="badge bg-warning text-dark">{grievance.status}</span>

        <hr />

        <h5>Description</h5>
        <p>{grievance.description}</p>

        <h5>Location</h5>
        <p>Village: {grievance.location?.village || "N/A"}</p>
        <p>Landmark: {grievance.location?.landmark || "N/A"}</p>

        <hr />

        <h5>Citizen</h5>
        <p>{grievance.user?.name}</p>
        <p>{grievance.user?.email}</p>

        {user?.role === "gram_panchayat" && (
          <>
            <hr />
            <h5>Actions</h5>
            <div className="d-flex gap-2">
              <button className="btn btn-warning btn-sm" onClick={() => updateStatus("under_review")}>Under Review</button>
              <button className="btn btn-success btn-sm" onClick={() => updateStatus("resolved")}>Resolve</button>
              <button className="btn btn-danger btn-sm" onClick={() => updateStatus("rejected")}>Reject</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
