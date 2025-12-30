import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";

export default function BookAppointment() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    appointmentDate: "",
    timeSlot: "",
    symptoms: "",
    consultationType: "in_person"
  });

  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!doctorId) {
      alert("Doctor not found");
      return;
    }

    if (!form.appointmentDate || !form.timeSlot || !form.symptoms) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/appointments", {
        doctorId,
        appointmentDate: form.appointmentDate,
        timeSlot: form.timeSlot,
        symptoms: form.symptoms,
        consultationType: form.consultationType
      });

      alert("✅ Appointment booked successfully");
      navigate("/my-appointments");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="card scheme-card p-4 shadow-lg mx-auto" style={{ maxWidth: 520 }}>

        {/* HEADER */}
        <div className="mb-4 text-center">
          <h2 className="page-title">Book Appointment</h2>
          <p className="page-subtitle">
            Schedule a consultation with a government doctor
          </p>
        </div>

        {/* DATE */}
        <div className="mb-3">
          <label className="form-label">Appointment Date</label>
          <input
            type="date"
            className="form-control"
            value={form.appointmentDate}
            onChange={e =>
              setForm({ ...form, appointmentDate: e.target.value })
            }
          />
        </div>

        {/* TIME SLOT */}
        <div className="mb-3">
          <label className="form-label">Time Slot</label>
          <input
            className="form-control"
            placeholder="10:00 AM - 10:30 AM"
            value={form.timeSlot}
            onChange={e =>
              setForm({ ...form, timeSlot: e.target.value })
            }
          />
        </div>

        {/* SYMPTOMS */}
        <div className="mb-3">
          <label className="form-label">Symptoms</label>
          <textarea
            className="form-control"
            rows="3"
            placeholder="Describe your symptoms"
            value={form.symptoms}
            onChange={e =>
              setForm({ ...form, symptoms: e.target.value })
            }
          />
        </div>

        {/* CONSULTATION TYPE */}
        <div className="mb-4">
          <label className="form-label">Consultation Type</label>
          <select
            className="form-select"
            value={form.consultationType}
            onChange={e =>
              setForm({ ...form, consultationType: e.target.value })
            }
          >
            <option value="in_person">In Person</option>
            <option value="video">Video</option>
            <option value="phone">Phone</option>
          </select>
        </div>

        {/* SUBMIT */}
        <div className="text-end">
          <button
            className="btn btn-apply px-4"
            disabled={loading}
            onClick={submit}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Booking...
              </>
            ) : (
              "Confirm Appointment"
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
