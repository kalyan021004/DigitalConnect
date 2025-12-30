import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function Doctor() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get("/health/doctors");
        setDoctors(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load doctors");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="container my-5 text-center">
        <span className="spinner-border text-primary"></span>
        <p className="text-muted mt-2">Loading doctors...</p>
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
  if (doctors.length === 0) {
    return (
      <div className="container my-5">
        <div className="alert text-center">
          No doctors available at the moment.
        </div>
      </div>
    );
  }

  /* ================= MAIN UI ================= */
  return (
    <div className="container my-5">
      {/* HEADER */}
      <div className="text-center mb-4">
        <h2 className="page-title">Available Doctors</h2>
        <p className="page-subtitle">
          Consult government-registered doctors and book appointments
        </p>
      </div>

      {/* DOCTOR LIST */}
      <div className="row g-4">
        {doctors.map(doc => (
          <div className="col-md-6 col-lg-4" key={doc._id}>
            <div className="card scheme-card h-100">
              <div className="card-body d-flex flex-column">

                {/* DOCTOR NAME */}
                <h5 className="mb-2">
                  Dr. {doc.name}
                </h5>

                {/* SPECIALIZATION */}
                <p className="mb-1 ">
                  <b>Specialization:</b>{" "}
                  {doc.doctorProfile?.specialization || "General Physician"}
                </p>

                {/* HOSPITAL */}
                <p className="mb-3">
                  <b>Hospital:</b>{" "}
                  {doc.doctorProfile?.hospital || "Government Hospital"}
                </p>

                {/* CTA */}
                <div className="mt-auto">
                  <Link
                    to={`/book-appointment/${doc._id}`}
                    className="btn btn-apply btn-sm w-100 text-center"
                  >
                    Book Appointment
                  </Link>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
