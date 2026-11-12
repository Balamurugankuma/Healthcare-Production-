import { useState } from "react";
import {
  Brain,
  Sparkles,
  AlertTriangle,
  Activity,
  Stethoscope,
  Send,
  Loader,
  Info,
  TrendingUp,
  Heart,
  AlertCircle,
  Clock,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import API from "../services/api";

export default function Report() {
  const [input, setInput] = useState({
    symptoms: "",
    duration: "",
    severity: "moderate",
    additionalInfo: "",
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [error, setError] = useState("");
  const [submittedQuestion, setSubmittedQuestion] = useState("");

  const commonSymptoms = [
    "Headache",
    "Fever",
    "Fatigue",
    "Cough",
    "Nausea",
    "Dizziness",
    "Chest Pain",
    "Shortness of Breath",
  ];

  const check = async () => {
    setError("");

    if (!input.symptoms || input.symptoms.trim() === "") {
      setError("Please describe your symptoms");
      return;
    }

    setLoading(true);
    setAnalyzed(false);

    setSubmittedQuestion(
      [
        input.symptoms.trim(),
        input.duration && `Duration: ${input.duration}`,
        input.severity && `Severity: ${input.severity}`,
        input.additionalInfo &&
          `Additional information: ${input.additionalInfo}`,
      ]
        .filter(Boolean)
        .join("\n\n")
    );

    try {
      const res = await API.post("/ai/check", {
        bp: "Unknown",
        sugar: "Unknown",
        heartRate: "Unknown",
        symptoms: `Symptoms: ${input.symptoms}
Duration: ${input.duration}
Severity: ${input.severity}
Extra info: ${input.additionalInfo}`,
      });

      setResult(res.data.result);
      setAnalyzed(true);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.result ||
          "Failed to connect AI server. Check backend."
      );
    } finally {
      setLoading(false);
    }
  };

  const addSymptom = (symptom) => {
    const current = input.symptoms ? `${input.symptoms}, ` : "";
    setInput({ ...input, symptoms: current + symptom });
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "mild":
        return "text-green-400 bg-green-500/20";
      case "moderate":
        return "text-yellow-400 bg-yellow-500/20";
      case "severe":
        return "text-red-400 bg-red-500/20";
      default:
        return "text-gray-400 bg-gray-500/20";
    }
  };

  const startNewAnalysis = () => {
    setAnalyzed(false);
    setResult("");
    setSubmittedQuestion("");
    setError("");
    setInput({
      symptoms: "",
      duration: "",
      severity: "moderate",
      additionalInfo: "",
    });
  };

  // Some model responses escape Markdown punctuation. Unescape it so Markdown
  // headings, lists, bold text, and tables render correctly.
  const formattedResult = result.replace(/\\([*|.\-])/g, "$1");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 p-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-3">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-4xl font-bold text-transparent">
                AI Health Analysis
              </h1>
              <p className="mt-1 flex items-center gap-2 text-gray-400">
                <Sparkles className="h-4 w-4" />
                Get instant insights about your symptoms
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Input Section */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-6">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
                <Stethoscope className="h-5 w-5 text-indigo-400" />
                Describe Your Symptoms
              </h2>

              {error && (
                <div className="mb-4 flex items-start gap-3 rounded-xl border border-red-500 bg-red-500/20 p-4">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Symptoms */}
              <div className="mb-4">
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  What symptoms are you experiencing?
                </label>
                <textarea
                  value={input.symptoms}
                  onChange={(e) =>
                    setInput({ ...input, symptoms: e.target.value })
                  }
                  placeholder="Describe your symptoms in detail (e.g., headache, fever, cough)..."
                  rows="4"
                  className="w-full resize-none rounded-xl border border-gray-700 bg-gray-900/50 px-4 py-3 text-white placeholder-gray-500 transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              {/* Quick Symptom Tags */}
              <div className="mb-4">
                <p className="mb-2 text-sm text-gray-400">
                  Quick add common symptoms:
                </p>
                <div className="flex flex-wrap gap-2">
                  {commonSymptoms.map((symptom) => (
                    <button
                      key={symptom}
                      type="button"
                      onClick={() => addSymptom(symptom)}
                      className="rounded-lg bg-gray-700 px-3 py-1.5 text-sm text-gray-300 transition-all duration-300 hover:scale-105 hover:bg-indigo-600 hover:text-white"
                    >
                      + {symptom}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="mb-4">
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-300">
                  <Clock className="h-4 w-4" />
                  How long have you had these symptoms?
                </label>
                <input
                  type="text"
                  value={input.duration}
                  onChange={(e) =>
                    setInput({ ...input, duration: e.target.value })
                  }
                  placeholder="e.g., 2 days, 1 week"
                  className="w-full rounded-xl border border-gray-700 bg-gray-900/50 px-4 py-3 text-white placeholder-gray-500 transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              {/* Severity */}
              <div className="mb-4">
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-300">
                  <Activity className="h-4 w-4" />
                  Severity Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["mild", "moderate", "severe"].map((severity) => (
                    <button
                      key={severity}
                      type="button"
                      onClick={() => setInput({ ...input, severity })}
                      className={`rounded-xl px-4 py-2 font-semibold capitalize transition-all duration-300 ${
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

              {/* Additional Information */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  Additional Information (Optional)
                </label>
                <textarea
                  value={input.additionalInfo}
                  onChange={(e) =>
                    setInput({ ...input, additionalInfo: e.target.value })
                  }
                  placeholder="Any relevant medical history, medications, or other details..."
                  rows="3"
                  className="w-full resize-none rounded-xl border border-gray-700 bg-gray-900/50 px-4 py-3 text-white placeholder-gray-500 transition-all duration-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              {/* Analyze Button */}
              <button
                type="button"
                onClick={check}
                disabled={loading}
                className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 font-semibold text-white transition-all duration-300 ${
                  loading
                    ? "cursor-not-allowed bg-gray-600"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.02] hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:shadow-indigo-500/50"
                }`}
              >
                {loading ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    Analyzing Symptoms...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Analyze My Symptoms
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Information Sidebar */}
          <div className="lg:col-span-1">
            <div className="mb-6 rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                <Info className="h-5 w-5 text-indigo-400" />
                How It Works
              </h3>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-500/20">
                    <span className="font-bold text-indigo-400">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Describe</p>
                    <p className="text-xs text-gray-400">
                      Enter your symptoms in detail
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-500/20">
                    <span className="font-bold text-indigo-400">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Analyze</p>
                    <p className="text-xs text-gray-400">
                      AI processes your information
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-500/20">
                    <span className="font-bold text-indigo-400">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Review</p>
                    <p className="text-xs text-gray-400">
                      Get insights and recommendations
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-yellow-500/50 bg-yellow-500/10 p-6">
              <div className="mb-3 flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 flex-shrink-0 text-yellow-400" />
                <div>
                  <h3 className="mb-1 text-sm font-bold text-yellow-400">
                    Important Notice
                  </h3>
                  <p className="text-xs leading-relaxed text-yellow-200/80">
                    This AI analysis is for informational purposes only and does
                    not replace professional medical advice. Please consult a
                    healthcare provider for proper diagnosis and treatment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat-style Conversation */}
        {analyzed && result && (
          <div className="mt-6 animate-fade-in rounded-2xl border border-gray-700 bg-gray-900/70 p-5 sm:p-8">
            <div className="mx-auto max-w-3xl space-y-6">
              {/* User Message */}
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-indigo-600 px-5 py-4 text-white shadow-lg">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-indigo-200">
                    You
                  </p>
                  <p className="whitespace-pre-line leading-relaxed">
                    {submittedQuestion}
                  </p>
                </div>
              </div>

              {/* AI Message */}
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600">
                  <Brain className="h-5 w-5 text-white" />
                </div>

                <div className="min-w-0 flex-1 rounded-2xl rounded-tl-md border border-gray-700 bg-gray-800 px-5 py-5 shadow-lg sm:px-7">
                  <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-indigo-300">
                    <Sparkles className="h-4 w-4" />
                    AI Health Assistant
                  </div>

                  <div className="break-words text-sm leading-7 text-gray-200 sm:text-base">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ ...props }) => (
                          <h1
                            className="mt-6 text-2xl font-bold text-white first:mt-0"
                            {...props}
                          />
                        ),
                        h2: ({ ...props }) => (
                          <h2
                            className="mt-6 text-xl font-bold text-white first:mt-0"
                            {...props}
                          />
                        ),
                        h3: ({ ...props }) => (
                          <h3
                            className="mt-5 text-lg font-semibold text-white first:mt-0"
                            {...props}
                          />
                        ),
                        p: ({ ...props }) => (
                          <p className="my-3 leading-7" {...props} />
                        ),
                        strong: ({ ...props }) => (
                          <strong className="font-semibold text-white" {...props} />
                        ),
                        ul: ({ ...props }) => (
                          <ul
                            className="my-3 list-disc space-y-1 pl-6 marker:text-indigo-400"
                            {...props}
                          />
                        ),
                        ol: ({ ...props }) => (
                          <ol
                            className="my-3 list-decimal space-y-1 pl-6 marker:text-indigo-400"
                            {...props}
                          />
                        ),
                        li: ({ ...props }) => <li className="pl-1" {...props} />,
                        blockquote: ({ ...props }) => (
                          <blockquote
                            className="my-4 border-l-2 border-indigo-400 pl-4 italic text-gray-300"
                            {...props}
                          />
                        ),
                        table: ({ ...props }) => (
                          <div className="my-4 overflow-x-auto">
                            <table
                              className="w-full border-collapse text-left text-sm"
                              {...props}
                            />
                          </div>
                        ),
                        th: ({ ...props }) => (
                          <th
                            className="border border-gray-600 bg-gray-700 px-3 py-2 font-semibold text-white"
                            {...props}
                          />
                        ),
                        td: ({ ...props }) => (
                          <td
                            className="border border-gray-700 px-3 py-2 align-top"
                            {...props}
                          />
                        ),
                        hr: ({ ...props }) => (
                          <hr className="my-5 border-gray-700" {...props} />
                        ),
                      }}
                    >
                      {formattedResult}
                    </ReactMarkdown>
                  </div>

                  <p className="mt-5 border-t border-gray-700 pt-4 text-xs leading-relaxed text-gray-400">
                    AI-generated information is not a diagnosis or a substitute
                    for professional medical advice. Contact a healthcare
                    provider for medical concerns.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-indigo-700"
              >
                <Heart className="h-5 w-5" />
                Save to Health Records
              </button>

              <button
                type="button"
                className="flex items-center gap-2 rounded-xl bg-gray-700 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-gray-600"
              >
                <TrendingUp className="h-5 w-5" />
                View Similar Cases
              </button>

              <button
                type="button"
                onClick={startNewAnalysis}
                className="rounded-xl bg-gray-700 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-gray-600"
              >
                New Analysis
              </button>
            </div>
          </div>
        )}

        {/* Loading Animation */}
        {loading && (
          <div className="mt-6 rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 p-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/20">
              <Brain className="h-8 w-8 animate-pulse text-indigo-400" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-white">
              Analyzing Your Symptoms
            </h3>
            <p className="mb-4 text-gray-400">
              Our AI is processing your information...
            </p>
            <div className="flex items-center justify-center gap-2">
              <div
                className="h-2 w-2 animate-bounce rounded-full bg-indigo-500"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="h-2 w-2 animate-bounce rounded-full bg-indigo-500"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="h-2 w-2 animate-bounce rounded-full bg-indigo-500"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
