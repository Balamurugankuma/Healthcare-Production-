import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { Trash2 } from "lucide-react";

export default function TreatmentList() {
  const [treatments, setTreatments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/treatments").then((res) => setTreatments(res.data));
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this treatment?");
    if (!confirm) return;

    try {
      await API.delete(`/treatments/${id}`);
      setTreatments((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      alert("Failed to delete treatment");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] p-8 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Treatment Tracker</h2>
        <button
          onClick={() => navigate("/treatments/new")}
          className="px-4 py-2 bg-blue-600 rounded-lg text-white"
        >
          + Add Treatment
        </button>
      </div>

      {treatments.length === 0 && (
        <p className="text-gray-400">No treatments added yet.</p>
      )}

      <div className="grid gap-4">
        {treatments.map((t) => (
          <div
  key={t._id}
  onClick={() => navigate(`/treatments/${t._id}`)}
  className="p-4 bg-slate-800 rounded-xl border border-slate-700 flex justify-between items-start cursor-pointer hover:border-blue-500 transition"
>

            <div>
              <h3 className="text-lg font-semibold text-white">
                {t.conditionName}
              </h3>
              <p className="text-gray-400 text-sm">
                Doctor: {t.doctorName || "—"}
              </p>
              <p className="text-gray-400 text-sm">
                Status:{" "}
                <span className="text-blue-400 font-semibold">
                  {t.status}
                </span>
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(t._id);}}
              className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 transition"
              title="Delete Treatment"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

