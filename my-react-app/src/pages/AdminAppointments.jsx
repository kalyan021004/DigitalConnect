import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function AdminAppointments() {
  const [apps, setApps] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/appointments/admin")
      .then(res => setApps(res.data))
      .catch(() => alert("Access denied"));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>All Appointments (Admin)</h2>

      {apps.map(a => (
        <div
          key={a._id}
          onClick={() => navigate(`/appointments/${a._id}`)}
          style={styles.card}
        >
          <h4>{a.doctor.name}</h4>
          <p><b>Patient:</b> {a.patient.name}</p>
          <p><b>Date:</b> {new Date(a.appointmentDate).toDateString()}</p>
          <p><b>Status:</b> {a.status}</p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ccc",
    padding: 14,
    borderRadius: 6,
    marginBottom: 10,
    cursor: "pointer",
    background: "#fff"
  }
};
