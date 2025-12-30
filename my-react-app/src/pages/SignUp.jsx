import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    village: "",
    district: "",
    state: "",
    role: "citizen" // 🔒 fixed role
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("Name, email and password are required");
      return;
    }

    try {
      setLoading(true);
      await signup(form);
      alert("✅ Signup successful. Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div
        className="card scheme-card p-4 shadow-lg mx-auto"
        style={{ maxWidth: 480 }}
      >
        {/* HEADER */}
        <div className="text-center mb-4">
          <h2 className="page-title">Citizen Signup</h2>
          <p className="page-subtitle">
            Register to access DigitalConnect services
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="alert alert-danger text-center py-2">
            {error}
          </div>
        )}

        {/* NAME */}
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            className="form-control"
            placeholder="Enter your name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </div>

        {/* EMAIL */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
        </div>

        {/* PHONE */}
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            className="form-control"
            placeholder="Mobile number"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Create a password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
        </div>

        {/* LOCATION */}
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Village</label>
            <input
              className="form-control"
              value={form.village}
              onChange={e => setForm({ ...form, village: e.target.value })}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">District</label>
            <input
              className="form-control"
              value={form.district}
              onChange={e => setForm({ ...form, district: e.target.value })}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">State</label>
            <input
              className="form-control"
              value={form.state}
              onChange={e => setForm({ ...form, state: e.target.value })}
            />
          </div>
        </div>

        {/* SUBMIT */}
        <div className="text-end mt-4">
          <button
            className="btn btn-apply px-4"
            onClick={submit}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Creating Account...
              </>
            ) : (
              "Signup"
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
