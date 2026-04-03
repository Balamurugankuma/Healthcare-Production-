import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function AddTreatment() {
  const [form, setForm] = useState({
    conditionName: "",
    doctorName: "",
    visitDate: "",
    notes: "",
  });
  const navigate = useNavigate();

  const submit = async () => {
    await API.post("/treatments", form);
    navigate("/treatments");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-8 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <div className="max-w-xl mx-auto bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">
          Add Treatment
        </h2>

        <input
          placeholder="Condition (e.g. Fever)"
          className="input"
          value={form.conditionName}
          onChange={(e) =>
            setForm({ ...form, conditionName: e.target.value })
          }
        />

        <input
          placeholder="Doctor Name"
          className="input"
          value={form.doctorName}
          onChange={(e) =>
            setForm({ ...form, doctorName: e.target.value })
          }
        />

        <input
          type="date"
          className="input"
          value={form.visitDate}
          onChange={(e) =>
            setForm({ ...form, visitDate: e.target.value })
          }
        />

        <textarea
          placeholder="Notes"
          className="input"
          value={form.notes}
          onChange={(e) =>
            setForm({ ...form, notes: e.target.value })
          }
        />

        <button
          onClick={submit}
          className="mt-4 w-full py-3 bg-blue-600 rounded-lg text-white"
        >
          Save Treatment
        </button>
      </div>
    </div>
  );
}
