import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function DoctorAppointmentDetail() {
  const { id } = useParams();

  const [appointment, setAppointment] = useState(null);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const res = await api.get(`/appointments/${id}`);
        setAppointment(res.data);
        setStatus(res.data.status);
        setNotes(res.data.notes || "");
      } catch (err) {
        console.error(err);
        alert("Failed to load appointment");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id]);

  const save = async () => {
    try {
      await api.put(`/appointments/${id}`, { status, notes });
      alert("Appointment updated successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to update appointment");
    }
  };

  if (loading) {
    return (
      <div className="container my-5 text-center">
        <span className="spinner-border text-primary"></span>
        <p className="mt-2">Loading appointment...</p>
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
      <div className="card scheme-card p-4 shadow-lg mx-auto" style={{ maxWidth: 720 }}>

        <h2 className="mb-3">
          Appointment #{appointment.appointmentNumber}
        </h2>

        <hr />

        {/* PATIENT INFO */}
        <h5 className="mb-2">👤 Patient Details</h5>
        <p><b>Name:</b> {appointment.patient?.name}</p>
        <p><b>Email:</b> {appointment.patient?.email}</p>
        <p><b>Phone:</b> {appointment.patient?.phone}</p>

        <hr />

        {/* APPOINTMENT INFO */}
        <h5 className="mb-2">📅 Appointment Info</h5>
        <p><b>Date:</b> {new Date(appointment.appointmentDate).toDateString()}</p>
        <p><b>Time:</b> {appointment.timeSlot}</p>
        <p><b>Symptoms:</b> {appointment.symptoms}</p>

        <hr />

        {/* STATUS */}
        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="scheduled">Scheduled</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No Show</option>
          </select>
        </div>

        {/* NOTES */}
        <div className="mb-4">
          <label className="form-label">Doctor Notes</label>
          <textarea
            className="form-control"
            rows="4"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>

        {/* SAVE */}
        <div className="text-end">
          <button className="btn btn-apply px-4" onClick={save}>
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}
