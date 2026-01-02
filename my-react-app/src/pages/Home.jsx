import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  /* ===============================
     STATE ADMIN HOME
  =============================== */
  if (user?.role === "state_admin") {
    return (
      <div className="container my-5">

        {/* ADMIN HERO */}
        <div className="card scheme-card p-5 shadow-lg mb-5">
          <h1 className="mb-2">
            Welcome, <span style={{ color: "#60a5fa" }}>State Administrator</span>
          </h1>
          <p className="page-subtitle">
            Manage government schemes, review applications, and monitor platform activity.
          </p>
        </div>

        {/* ADMIN ACTION CARDS */}
        <div className="row g-4">

          <div className="col-md-6 col-lg-3">
            <div
              className="card scheme-card h-100 text-center p-4"
              role="button"
              onClick={() => navigate("/admin/applications")}
            >
              <h4>📂 Applications</h4>
              <p>Review, approve, reject, and manage citizen applications.</p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div
              className="card scheme-card h-100 text-center p-4"
              role="button"
              onClick={() => navigate("/admin/schemes")}
            >
              <h4>📜 Manage Schemes</h4>
              <p>Create, activate, deactivate, and update schemes.</p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div
              className="card scheme-card h-100 text-center p-4"
              role="button"
              onClick={() => navigate("/grievance/panchayat")}
            >
              <h4>🛠 Grievances</h4>
              <p>Monitor and escalate unresolved grievances.</p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div
              className="card scheme-card h-100 text-center p-4"
              role="button"
              onClick={() => navigate("/profile")}
            >
              <h4>👤 Admin Profile</h4>
              <p>View and update your administrator profile.</p>
            </div>
          </div>

        </div>

        <div className="text-center mt-5 page-subtitle">
          Administrative control panel for efficient governance.
        </div>

      </div>
    );
  }

  /* ===============================
     DEFAULT (CITIZEN) HOME
  =============================== */
  return (
    <div className="container my-5">

      {/* HERO SECTION */}
      <div className="card scheme-card p-5 shadow-lg text-center mb-5">
        <h1 className="mb-3">
          Welcome to <span style={{ color: "#60a5fa" }}>DigitalConnect</span>
        </h1>
        <p className="page-subtitle mb-4">
          A unified digital platform for rural development, citizen services,
          healthcare access, and grievance redressal.
        </p>

        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <button
            className="btn btn-apply px-4"
            onClick={() => navigate("/schemes")}
          >
            Explore Schemes
          </button>

          <button
            className="btn btn-outline-primary px-4"
            onClick={() => navigate("/health/doctors")}
          >
            Book Doctor Appointment
          </button>
        </div>
      </div>

      {/* FEATURES */}
      <div className="row g-4">

        <div className="col-md-6 col-lg-3">
          <div className="card scheme-card h-100 text-center p-4">
            <h4>📜 Government Schemes</h4>
            <p>Browse and apply for welfare schemes.</p>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card scheme-card h-100 text-center p-4">
            <h4>🏥 Health Services</h4>
            <p>Consult doctors and manage appointments.</p>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card scheme-card h-100 text-center p-4">
            <h4>🛠 Grievance Redressal</h4>
            <p>Submit and track grievances transparently.</p>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card scheme-card h-100 text-center p-4">
            <h4>🏛 Local Governance</h4>
            <p>Connect with Gram Panchayat and authorities.</p>
          </div>
        </div>

      </div>

      <div className="text-center mt-5 page-subtitle">
        Digital governance for empowered rural communities.
      </div>

    </div>
  );
}
