import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { applyScheme } from "../api/schemeApi";

export default function SchemeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`/schemes/${id}`)
      .then(res => setScheme(res.data))
      .catch(() => {
        alert("Please login to view scheme details");
        navigate("/login");
      });
  }, [id, navigate]);

  const apply = async () => {
    try {
      setLoading(true);
      const res = await applyScheme(id);

      alert(
        `✅ Application submitted successfully!\n\nApplication No: ${res.data.applicationNumber}`
      );
      navigate("/my-applications");
    } catch (err) {
      alert(err.response?.data?.error || "Already applied");
    } finally {
      setLoading(false);
    }
  };

  if (!scheme) {
    return (
      <div className="container my-5 text-center">
        <span className="spinner-border text-primary"></span>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="card scheme-card p-4 shadow-lg">

        <h2 className="mb-2">{scheme.name}</h2>

        <p>
          <b>Category:</b> {scheme.category} &nbsp; | &nbsp;
          <b>Department:</b> {scheme.department}
        </p>

        {scheme.officialLink && (
          <p>
            <b>Official Link:</b>{" "}
            <a href={scheme.officialLink} target="_blank" rel="noreferrer">
              {scheme.officialLink}
            </a>
          </p>
        )}

        <hr />

        <h5>📄 Description</h5>
        <p>{scheme.description}</p>

        <hr />

        <h5>🎁 Benefits</h5>
        <p>{scheme.benefits}</p>

        <hr />

        <h5>✅ Eligibility Criteria</h5>
        <ul>
          {scheme.eligibility?.minAge !== undefined && (
            <li>Minimum Age: {scheme.eligibility.minAge}</li>
          )}
          {scheme.eligibility?.maxAge !== undefined && (
            <li>Maximum Age: {scheme.eligibility.maxAge}</li>
          )}
          {scheme.eligibility?.gender?.length > 0 && (
            <li>Gender: {scheme.eligibility.gender.join(", ")}</li>
          )}
          {scheme.eligibility?.category?.length > 0 && (
            <li>Category: {scheme.eligibility.category.join(", ")}</li>
          )}
          {scheme.eligibility?.income?.max && (
            <li>Maximum Income: ₹{scheme.eligibility.income.max}</li>
          )}
          {scheme.eligibility?.landHolding?.max && (
            <li>Maximum Land Holding: {scheme.eligibility.landHolding.max} acres</li>
          )}
        </ul>

        <hr />

        <h5>📄 Required Documents</h5>
        <ul>
          {scheme.documents.map((doc, i) => (
            <li key={i}>
              {doc.name}{" "}
              <span className={doc.required ? "text-danger" : "text-muted"}>
                ({doc.required ? "Required" : "Optional"})
              </span>
            </li>
          ))}
        </ul>

        {scheme.applicationProcess && (
          <>
            <hr />
            <h5>📝 Application Process</h5>
            <p>{scheme.applicationProcess}</p>
          </>
        )}

        {scheme.deadlines && (
          <>
            <hr />
            <h5>⏰ Deadlines</h5>
            <p>
              Start:{" "}
              {scheme.deadlines.startDate
                ? new Date(scheme.deadlines.startDate).toLocaleDateString()
                : "N/A"}
            </p>
            <p>
              End:{" "}
              {scheme.deadlines.endDate
                ? new Date(scheme.deadlines.endDate).toLocaleDateString()
                : "N/A"}
            </p>
          </>
        )}

        <hr />

        <div className="text-end">
          <button
            className="btn btn-apply px-4"
            disabled={loading}
            onClick={apply}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Applying...
              </>
            ) : (
              "Apply for this Scheme"
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
