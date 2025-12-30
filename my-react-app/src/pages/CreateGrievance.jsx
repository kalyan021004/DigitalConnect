import { useState } from "react";
import api from "../api/axios";

export default function CreateGrievance() {
  const [form, setForm] = useState({
    category: "",
    subject: "",
    description: "",
    village: "",
    landmark: ""
  });

  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.category || !form.subject || !form.description) {
      alert("Category, Subject and Description are required");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();

      Object.entries(form).forEach(([k, v]) =>
        formData.append(k, v)
      );
      for (let f of files) formData.append("files", f);

      const res = await api.post("/grievances", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert(`✅ Grievance submitted\nGrievance No: ${res.data.grievanceNumber}`);
      setForm({ category: "", subject: "", description: "", village: "", landmark: "" });
      setFiles([]);
    } catch {
      alert("Failed to submit grievance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="card scheme-card p-4 shadow-lg mx-auto" style={{ maxWidth: 850 }}>
        <h2 className="page-title mb-4 text-center">Submit Grievance</h2>

        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Category *</label>
            <select className="form-select"
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
            >
              <option value="">Select Category</option>
              <option value="Road">Road & Infrastructure</option>
              <option value="Water">Water Supply</option>
              <option value="Electricity">Electricity</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Subject *</label>
            <input className="form-control"
              placeholder="Short grievance title"
              value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Description *</label>
            <textarea className="form-control" rows="4"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Village</label>
            <input className="form-control"
              value={form.village}
              onChange={e => setForm({ ...form, village: e.target.value })}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Landmark</label>
            <input className="form-control"
              value={form.landmark}
              onChange={e => setForm({ ...form, landmark: e.target.value })}
            />
          </div>

          <div className="col-12">
            <label className="form-label">Attach Photos / Documents</label>
            <input className="form-control" type="file" multiple onChange={e => setFiles(e.target.files)} />
          </div>
        </div>

        <div className="text-end mt-4">
          <button className="btn btn-apply px-4" disabled={loading} onClick={submit}>
            {loading ? "Submitting..." : "Submit Grievance"}
          </button>
        </div>
      </div>
    </div>
  );
}
