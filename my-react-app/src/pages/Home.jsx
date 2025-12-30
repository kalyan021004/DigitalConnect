import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

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
            <h4 className="mb-2">📜 Government Schemes</h4>
            <p>
              Browse and apply for central & state government welfare schemes
              designed for rural development.
            </p>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card scheme-card h-100 text-center p-4">
            <h4 className="mb-2">🏥 Health Services</h4>
            <p>
              Consult government-registered doctors and manage appointments
              seamlessly.
            </p>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card scheme-card h-100 text-center p-4">
            <h4 className="mb-2">🛠 Grievance Redressal</h4>
            <p>
              Raise village-level issues and track grievance resolution with
              transparency.
            </p>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card scheme-card h-100 text-center p-4">
            <h4 className="mb-2">🏛 Local Governance</h4>
            <p>
              Direct interaction between citizens, Gram Panchayat, and
              authorities.
            </p>
          </div>
        </div>

      </div>

      {/* FOOTER TAGLINE */}
      <div className="text-center mt-5">
        <p className="page-subtitle">
          Digital governance for transparent, inclusive, and empowered rural
          communities.
        </p>
      </div>

    </div>
  );
}
