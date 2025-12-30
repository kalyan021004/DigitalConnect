import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function AppointmentDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await api.get(`/appointments/${id}`);
        setAppointment(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load appointment details");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="container my-5 text-center">
        <span className="spinner-border text-primary"></span>
        <p className="mt-2">Loading appointment...</p>
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

  if (!appointment) {
    return (
      <div className="container my-5 text-center">
        Appointment not found.
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="card scheme-card p-4 shadow-lg mx-auto" style={{ maxWidth: 700 }}>

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-start flex-wrap mb-3">
          <div>
            <h2 className="mb-1">Appointment Details</h2>
            <p>
              <b>Appointment No:</b> {appointment.appointmentNumber}
            </p>
          </div>

          <span
            className={`badge ${
              appointment.status === "confirmed"
                ? "bg-success"
                : appointment.status === "cancelled"
                ? "bg-danger"
                : appointment.status === "completed"
                ? "bg-primary"
                : "bg-warning text-dark"
            }`}
          >
            {appointment.status.toUpperCase()}
          </span>
        </div>

        <hr />

        {/* DOCTOR INFO */}
        <h5 className="mb-3">🧑‍⚕️ Doctor</h5>
        <p><b>Name:</b> Dr. {appointment.doctor?.name || "N/A"}</p>
        <p><b>Specialization:</b> {appointment.doctor?.specialization || "N/A"}</p>
        <p><b>Hospital:</b> {appointment.doctor?.hospital || "N/A"}</p>

        <hr />

        {/* DATE & TIME */}
        <h5 className="mb-3">📅 Date & Time</h5>
        <p>
          {new Date(appointment.appointmentDate).toDateString()}
        </p>
        <p>{appointment.timeSlot}</p>

        <hr />

        {/* SYMPTOMS */}
        <h5 className="mb-3">📝 Symptoms</h5>
        <p>{appointment.symptoms}</p>

        <hr />

        {/* CONSULTATION TYPE */}
        <h5 className="mb-3">💬 Consultation Type</h5>
        <p>{appointment.consultationType.replace("_", " ").toUpperCase()}</p>

        {/* DOCTOR ADMIN VIEW */}
        {user?.role === "doctor_admin" && (
          <>
            <hr />
            <h5 className="mb-3">💊 Prescription</h5>

            {appointment.prescription ? (
              <p>
                <b>Advice:</b> {appointment.prescription.advice}
              </p>
            ) : (
              <p>No prescription added yet.</p>
            )}
          </>
        )}

      </div>
    </div>
  );
}
