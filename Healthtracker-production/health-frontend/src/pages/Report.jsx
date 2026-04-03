import { useEffect, useState  } from "react";
import { Brain, Sparkles, AlertTriangle, CheckCircle, Activity, Stethoscope, FileText, Send, Loader, Info, TrendingUp, Heart, AlertCircle, Clock } from "lucide-react";
import API from "../services/api";

export default function Report() {
  const [input, setInput] = useState({
    symptoms: "",
    duration: "",
    severity: "moderate",
    additionalInfo: ""
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [error, setError] = useState("");

  const commonSymptoms = [
    "Headache", "Fever", "Fatigue", "Cough", "Nausea",
    "Dizziness", "Chest Pain", "Shortness of Breath"
  ];

  const check = async () => {
  setError("");

  if (!input.symptoms || input.symptoms.trim() === "") {
    setError("Please describe your symptoms");
    return;
  }

  setLoading(true);
  setAnalyzed(false);

  try {
    const res = await API.post("/ai/check", {
      bp: "Unknown",
      sugar: "Unknown",
      heartRate: "Unknown",
      symptoms: `
Symptoms: ${input.symptoms}
Duration: ${input.duration}
Severity: ${input.severity}
Extra info: ${input.additionalInfo}
`
    });

    setResult(res.data.result);
    setAnalyzed(true);
  } catch (err) {
    console.error(err);
    setError("Failed to connect AI server. Check backend.");
  }

  setLoading(false);
};


  const addSymptom = (symptom) => {
    const current = input.symptoms ? input.symptoms + ", " : "";
    setInput({ ...input, symptoms: current + symptom });
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case "mild": return "text-green-400 bg-green-500/20";
      case "moderate": return "text-yellow-400 bg-yellow-500/20";
      case "severe": return "text-red-400 bg-red-500/20";
      default: return "text-gray-400 bg-gray-500/20";
    }
  };

  

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
      
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                AI Health Analysis
              </h1>
              <p className="text-gray-400 flex items-center gap-2 mt-1">
                <Sparkles className="w-4 h-4" />
                Get instant insights about your symptoms
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-indigo-400" />
                Describe Your Symptoms
              </h2>

              {/* Error Message */}
              {error && (
                <div className="mb-4 bg-red-500/20 border border-red-500 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Symptoms Input */}
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  What symptoms are you experiencing?
                </label>
                <textarea
                  value={input.symptoms}
                  onChange={(e) => setInput({ ...input, symptoms: e.target.value })}
                  placeholder="Describe your symptoms in detail (e.g., headache, fever, cough)..."
                  rows="4"
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 resize-none"
                />
              </div>

              {/* Quick Symptom Tags */}
              <div className="mb-4">
                <p className="text-gray-400 text-sm mb-2">Quick add common symptoms:</p>
                <div className="flex flex-wrap gap-2">
                  {commonSymptoms.map((symptom) => (
                    <button
                      key={symptom}
                      onClick={() => addSymptom(symptom)}
                      className="px-3 py-1.5 bg-gray-700 hover:bg-indigo-600 text-gray-300 hover:text-white rounded-lg text-sm transition-all duration-300 hover:scale-105"
                    >
                      + {symptom}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Input */}
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-semibold mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  How long have you had these symptoms?
                </label>
                <input
                  type="text"
                  value={input.duration}
                  onChange={(e) => setInput({ ...input, duration: e.target.value })}
                  placeholder="e.g., 2 days, 1 week"
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300"
                />
              </div>

              {/* Severity Selector */}
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-semibold mb-2 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Severity Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["mild", "moderate", "severe"].map((severity) => (
                    <button
                      key={severity}
                      onClick={() => setInput({ ...input, severity })}
                      className={`py-2 px-4 rounded-xl font-semibold capitalize transition-all duration-300 ${
                        input.severity === severity
                          ? getSeverityColor(severity)
                          : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                      }`}
                    >
                      {severity}
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-semibold mb-2">
                  Additional Information (Optional)
                </label>
                <textarea
                  value={input.additionalInfo}
                  onChange={(e) => setInput({ ...input, additionalInfo: e.target.value })}
                  placeholder="Any relevant medical history, medications, or other details..."
                  rows="3"
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 resize-none"
                />
              </div>

              {/* Analyze Button */}
              <button
                onClick={check}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300 ${
                  loading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:shadow-indigo-500/50 hover:scale-[1.02]"
                }`}
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Analyzing Symptoms...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Analyze My Symptoms
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 mb-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-indigo-400" />
                How It Works
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-400 font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Describe</p>
                    <p className="text-gray-400 text-xs">Enter your symptoms in detail</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-400 font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Analyze</p>
                    <p className="text-gray-400 text-xs">AI processes your information</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-400 font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Review</p>
                    <p className="text-gray-400 text-xs">Get insights and recommendations</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-3">
                <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                <div>
                  <h3 className="text-yellow-400 font-bold text-sm mb-1">Important Notice</h3>
                  <p className="text-yellow-200/80 text-xs leading-relaxed">
                    This AI analysis is for informational purposes only and does not replace professional medical advice. Please consult a healthcare provider for proper diagnosis and treatment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {analyzed && result && (
          <div className="mt-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Analysis Complete</h2>
            </div>

            <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-semibold text-white">AI Assessment</h3>
              </div>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 whitespace-pre-line leading-relaxed">{result}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Save to Health Records
              </button>
              <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all duration-300 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                View Similar Cases
              </button>
              <button 
                onClick={() => {
                  setAnalyzed(false);
                  setResult("");
                  setInput({ symptoms: "", duration: "", severity: "moderate", additionalInfo: "" });
                }}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-semibold transition-all duration-300"
              >
                New Analysis
              </button>
            </div>
          </div>
        )}

        {/* Loading Animation */}
        {loading && (
          <div className="mt-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-500/20 rounded-full mb-4">
              <Brain className="w-8 h-8 text-indigo-400 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Analyzing Your Symptoms</h3>
            <p className="text-gray-400 mb-4">Our AI is processing your information...</p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}