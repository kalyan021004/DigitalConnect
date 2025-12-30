import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "citizen"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");

    if (!form.email || !form.password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const data = await login(form);

      /* ✅ role is validated by backend */
      navigate(`/`);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        "Login failed. Please try again.";

      // 🔐 Friendly authorization message
      if (
        msg.toLowerCase().includes("not authorized") ||
        msg.toLowerCase().includes("unauthorized")
      ) {
        setError("🚫 You are not an authorized user for the selected role.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div
        className="card scheme-card p-4 shadow-lg mx-auto"
        style={{ maxWidth: 420 }}
      >
        {/* HEADER */}
        <div className="text-center mb-4">
          <h2 className="page-title">Login</h2>
          <p className="page-subtitle">
            Access DigitalConnect services
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="alert alert-danger text-center py-2">
            {error}
          </div>
        )}

        {/* EMAIL */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
            value={form.email}
            onChange={e =>
              setForm({ ...form, email: e.target.value })
            }
          />
        </div>

        {/* PASSWORD */}
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter your password"
            value={form.password}
            onChange={e =>
              setForm({ ...form, password: e.target.value })
            }
          />
        </div>

        {/* ROLE */}
        <div className="mb-4">
          <label className="form-label">Login As</label>
          <select
            className="form-select"
            value={form.role}
            onChange={e =>
              setForm({ ...form, role: e.target.value })
            }
          >
            <option value="citizen">Citizen</option>
            <option value="gram_panchayat">Gram Panchayat</option>
            <option value="state_admin">State Admin</option>
            <option value="doctor_admin">Doctor Admin</option>
          </select>
        </div>

        {/* SUBMIT */}
        <div className="text-end">
          <button
            className="btn btn-apply px-4"
            onClick={submit}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
