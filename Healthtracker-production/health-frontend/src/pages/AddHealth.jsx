import { useState } from "react";
import { Heart, Droplet, FileText, Save, CheckCircle, AlertCircle, Activity, Calendar } from "lucide-react";
import API from "../services/api";


const InputField = ({ icon: Icon, label, placeholder, value, onChange, type = "text", error, status }) => (
    <div className="mb-6">
      <label className="block text-gray-300 text-sm font-semibold mb-2 flex items-center gap-2">
        <Icon className="w-4 h-4" />
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full bg-gray-800/50 border ${error ? 'border-red-500' : 'border-gray-700'} rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300`}
        />
        {status && (
          <div className={`absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.color}`}>
            {status.status}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-red-400 text-xs flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
export default function AddHealth() {
  const [data, setData] = useState({
    bp: "",
    sugar: "",
    symptoms: "",
    heartRate: "",
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    // Validate BP format (e.g., 120/80)
    if (!data.bp) {
      newErrors.bp = "Blood pressure is required";
    } else if (!/^\d{2,3}\/\d{2,3}$/.test(data.bp)) {
      newErrors.bp = "Format should be like 120/80";
    }
    
    // Validate Sugar
    if (!data.sugar) {
      newErrors.sugar = "Blood sugar is required";
    } else if (isNaN(data.sugar) || data.sugar < 0 || data.sugar > 600) {
      newErrors.sugar = "Enter a valid value (0-600)";
    }
    
    // Validate Symptoms
    if (!data.symptoms || data.symptoms.trim() === "") {
      newErrors.symptoms = "Please enter symptoms or 'None'";
    }

    // Validate Heart Rate
    if (data.heartRate && (isNaN(data.heartRate) || data.heartRate < 30 || data.heartRate > 220)) {
      newErrors.heartRate = "Enter a valid heart rate (30-220)";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getHealthStatus = (type, value) => {
    if (type === "bp" && value) {
      const systolic = parseInt(value.split("/")[0]);
      if (systolic < 120) return { status: "Normal", color: "text-green-400", bg: "bg-green-500/20" };
      if (systolic < 140) return { status: "Elevated", color: "text-yellow-400", bg: "bg-yellow-500/20" };
      return { status: "High", color: "text-red-400", bg: "bg-red-500/20" };
    }
    if (type === "sugar" && value) {
      const sugar = parseInt(value);
      if (sugar < 100) return { status: "Normal", color: "text-green-400", bg: "bg-green-500/20" };
      if (sugar < 126) return { status: "Prediabetic", color: "text-yellow-400", bg: "bg-yellow-500/20" };
      return { status: "High", color: "text-red-400", bg: "bg-red-500/20" };
    }
    if (type === "heartRate" && value) {
      const hr = parseInt(value);
      if (hr >= 60 && hr <= 100) return { status: "Normal", color: "text-green-400", bg: "bg-green-500/20" };
      if (hr < 60) return { status: "Low", color: "text-blue-400", bg: "bg-blue-500/20" };
      return { status: "High", color: "text-red-400", bg: "bg-red-500/20" };
    }
    return null;
  };

  const submit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await API.post("/health", data);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setData({
          bp: "",
          sugar: "",
          symptoms: "",
          heartRate: "",
          date: new Date().toISOString().split('T')[0]
        });
      }, 2000);
    } catch (error) {
      alert("Error saving data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
            Add Health Record
          </h1>
          <p className="text-gray-400">Log your daily health metrics and track your wellness journey</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-500/20 border border-green-500 rounded-xl p-4 flex items-center gap-3 animate-pulse">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <div>
              <p className="text-green-400 font-semibold">Health record saved successfully!</p>
              <p className="text-green-300 text-sm">Your data has been securely stored.</p>
            </div>
          </div>
        )}

        {/* Main Form */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-2xl">
          {/* Date Picker */}
          <InputField
            icon={Calendar}
            label="Date"
            type="date"
            value={data.date}
            onChange={(e) => setData({ ...data, date: e.target.value })}
            error={errors.date}
          />

          {/* Blood Pressure */}
          <InputField
            icon={Heart}
            label="Blood Pressure (mmHg)"
            placeholder="e.g., 120/80"
            value={data.bp}
            onChange={(e) => setData({ ...data, bp: e.target.value })}
            error={errors.bp}
            status={getHealthStatus("bp", data.bp)}
          />

          {/* Blood Sugar */}
          <InputField
            icon={Droplet}
            label="Blood Sugar (mg/dL)"
            placeholder="e.g., 95"
            type="number"
            value={data.sugar}
            onChange={(e) => setData({ ...data, sugar: e.target.value })}
            error={errors.sugar}
            status={getHealthStatus("sugar", data.sugar)}
          />

          {/* Heart Rate */}
          <InputField
            icon={Activity}
            label="Heart Rate (bpm) - Optional"
            placeholder="e.g., 72"
            type="number"
            value={data.heartRate}
            onChange={(e) => setData({ ...data, heartRate: e.target.value })}
            error={errors.heartRate}
            status={getHealthStatus("heartRate", data.heartRate)}
          />

          {/* Symptoms */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-semibold mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Symptoms or Notes
            </label>
            <textarea
              placeholder="Describe any symptoms, feelings, or notes. Enter 'None' if you're feeling good."
              value={data.symptoms}
              onChange={(e) => setData({ ...data, symptoms: e.target.value })}
              rows="4"
              className={`w-full bg-gray-800/50 border ${errors.symptoms ? 'border-red-500' : 'border-gray-700'} rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 resize-none`}
            />
            {errors.symptoms && (
              <p className="mt-2 text-red-400 text-xs flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.symptoms}
              </p>
            )}
          </div>

          {/* Quick Symptom Tags */}
          <div className="mb-8">
            <p className="text-gray-400 text-sm mb-3">Quick select common symptoms:</p>
            <div className="flex flex-wrap gap-2">
              {["None", "Headache", "Fatigue", "Dizziness", "Nausea", "Chest Pain"].map((symptom) => (
                <button
                  key={symptom}
                  onClick={() => setData({ ...data, symptoms: symptom })}
                  className="px-4 py-2 bg-gray-700 hover:bg-blue-600 text-gray-300 hover:text-white rounded-lg text-sm transition-all duration-300 hover:scale-105"
                >
                  {symptom}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={submit}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-semibold text-white text-lg flex items-center justify-center gap-2 transition-all duration-300 ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg hover:shadow-blue-500/50 hover:scale-[1.02]"
            }`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Health Record
              </>
            )}
          </button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <h3 className="text-green-400 font-semibold mb-1 text-sm">Normal BP</h3>
            <p className="text-gray-400 text-xs">Less than 120/80 mmHg</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <h3 className="text-green-400 font-semibold mb-1 text-sm">Normal Sugar</h3>
            <p className="text-gray-400 text-xs">70-100 mg/dL (fasting)</p>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <h3 className="text-green-400 font-semibold mb-1 text-sm">Normal HR</h3>
            <p className="text-gray-400 text-xs">60-100 beats per minute</p>
          </div>
        </div>
      </div>
    </div>
  );
}