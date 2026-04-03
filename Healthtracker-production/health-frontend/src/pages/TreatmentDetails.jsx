import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";
import { Trash2 } from "lucide-react";

export default function TreatmentDetails() {
  const { id } = useParams();

  const [treatment, setTreatment] = useState(null);
  const [medicines, setMedicines] = useState([]);

  // Add medicine form state
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [timesPerDay, setTimesPerDay] = useState(1);
  const [doseTimes, setDoseTimes] = useState([""]);

  /* ---------------- LOAD DATA ---------------- */

  useEffect(() => {
    API.get(`/treatments/${id}`)
      .then(res => setTreatment(res.data))
      .catch(() => alert("Failed to load treatment"));
  }, [id]);

  useEffect(() => {
    API.get(`/medicines/${id}`)
      .then(res => setMedicines(res.data))
      .catch(() => console.log("Failed to load medicines"));
  }, [id]);

  /* ---------------- HELPERS ---------------- */

  useEffect(() => {
    setDoseTimes(Array(timesPerDay).fill(""));
  }, [timesPerDay]);

  const isTakenToday = (date) => {
    if (!date) return false;
    return new Date(date).toDateString() === new Date().toDateString();
  };

  /* ---------------- ACTIONS ---------------- */

  const addMedicine = async () => {
    if (!name || !dosage || doseTimes.some(t => !t)) {
      alert("Please fill all medicine details");
      return;
    }

    const doses = doseTimes.map(time => ({
      time,
      lastTakenAt: null
    }));

    try {
      const res = await API.post(`/medicines/${id}`, {
        name,
        dosage,
        timesPerDay,
        doses,
        startDate: new Date(),
        durationDays: 5
      });

      setMedicines(prev => [...prev, res.data]);

      // reset form
      setName("");
      setDosage("");
      setTimesPerDay(1);
      setDoseTimes([""]);
    } catch {
      alert("Failed to add medicine");
    }
  };

  const markDoseTaken = async (medicineId, doseIndex) => {
    try {
      const res = await API.post(
        `/medicines/take/${medicineId}/${doseIndex}`
      );
      setMedicines(prev =>
        prev.map(m => (m._id === medicineId ? res.data : m))
      );
    } catch {
      alert("Failed to mark dose as taken");
    }
  };

  const deleteMedicine = async (medicineId) => {
    if (!window.confirm("Delete this medicine?")) return;

    try {
      await API.delete(`/medicines/delete/${medicineId}`);
      setMedicines(prev => prev.filter(m => m._id !== medicineId));
    } catch {
      alert("Failed to delete medicine");
    }
  };

  /* ---------------- UI ---------------- */

  if (!treatment) {
    return <p className="text-white p-6">Loading...</p>;
  }

  return (
    <div className="p-8 text-white">
      <h2 className="text-3xl font-bold mb-2">
        {treatment.conditionName}
      </h2>

      <p className="text-gray-400 mb-1">
        Doctor: <span className="text-white">{treatment.doctorName}</span>
      </p>

      <p className="text-gray-400 mb-4">
        Status: <span className="text-blue-400">{treatment.status}</span>
      </p>

      {/* -------- ADD MEDICINE -------- */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 mb-8">
        <h3 className="text-lg font-semibold mb-3">Add Medicine</h3>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Medicine name"
          className="w-full p-2 mb-3 rounded bg-slate-800 text-white"
        />

        <input
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          placeholder="Dosage (e.g. 500mg)"
          className="w-full p-2 mb-3 rounded bg-slate-800 text-white"
        />

        <select
          value={timesPerDay}
          onChange={(e) => setTimesPerDay(Number(e.target.value))}
          className="w-full p-2 mb-3 rounded bg-slate-800 text-white"
        >
          <option value={1}>Once a day</option>
          <option value={2}>Twice a day</option>
          <option value={3}>Three times a day</option>
          <option value={4}>Four times a day</option>
        </select>

        <div className="flex gap-2 mb-3 flex-wrap">
          {doseTimes.map((time, index) => (
            <input
              key={index}
              type="time"
              value={time}
              onChange={(e) => {
                const updated = [...doseTimes];
                updated[index] = e.target.value;
                setDoseTimes(updated);
              }}
              className="p-2 rounded bg-slate-700 text-white"
            />
          ))}
        </div>

        <button
          onClick={addMedicine}
          className="px-4 py-2 bg-blue-600 rounded text-white"
        >
          Add Medicine
        </button>
      </div>

      {/* -------- MEDICINE LIST -------- */}
      <h3 className="text-xl font-semibold mb-3">
        Prescribed Medicines
      </h3>

      {medicines.length === 0 && (
        <p className="text-gray-400">No medicines added yet.</p>
      )}

      {medicines.map((m) => (
        <div
          key={m._id}
          className="bg-slate-800 p-4 rounded-xl mb-4 border border-slate-700"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-white font-semibold">{m.name}</p>
              <p className="text-gray-400 text-sm">{m.dosage}</p>
            </div>

            <button
              onClick={() => deleteMedicine(m._id)}
              className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* DOSES */}
          {m.doses.map((dose, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 mt-2"
            >
              <span className="text-gray-400 text-sm">
                Dose {idx + 1} — {dose.time}
              </span>

              {isTakenToday(dose.lastTakenAt) ? (
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                  Taken Today
                </span>
              ) : (
                <button
                  onClick={() => markDoseTaken(m._id, idx)}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-xs"
                >
                  Take Now
                </button>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
