import { useEffect, useState } from "react";
import { Activity, Heart, Droplet, AlertCircle, TrendingUp, TrendingDown, Calendar, Download } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import API from "../services/api";
import { useNavigate } from "react-router-dom";




export default function Dashboard() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState("bp");
  

  useEffect(() => {
    API.get("/health").then(res => {
      setLogs(res.data);
      setLoading(false);
    }).catch(err => {
      console.error("Error fetching health data:", err);
      setLoading(false);
    });
  }, []);

  const calculateAverage = (key) => {
    if (logs.length === 0) return 0;
    if (key === "bp") {
      const systolic = logs.map(l => parseInt(l.bp.split("/")[0]));
      return Math.round(systolic.reduce((a, b) => a + b, 0) / systolic.length);
    }
    return Math.round(logs.reduce((acc, log) => acc + log[key], 0) / logs.length);
  };

  const getLatestReading = (key) => {
    if (logs.length === 0) return "N/A";
    return key === "bp" ? logs[logs.length - 1][key] : logs[logs.length - 1][key];
  };

  const getTrend = (key) => {
    if (logs.length < 2) return 0;
    const latest = key === "bp" ? parseInt(logs[logs.length - 1].bp.split("/")[0]) : logs[logs.length - 1][key];
    const previous = key === "bp" ? parseInt(logs[logs.length - 2].bp.split("/")[0]) : logs[logs.length - 2][key];
    return latest - previous;
  };

  const chartData = logs.map(log => ({
    date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    bp: parseInt(log.bp.split("/")[0]),
    sugar: log.sugar,
    heartRate: log.heartRate
  }));

  const MetricCard = ({ title, value, icon: Icon, color, trend, unit }) => (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend !== 0 && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${trend > 0 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
            {trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="text-xs font-semibold">{Math.abs(trend)}{unit}</span>
          </div>
        )}
      </div>
      <h3 className="text-gray-400 text-sm font-medium mb-2">{title}</h3>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <div className="h-1 w-full bg-gray-700 rounded-full mt-4 overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${color} animate-pulse`} style={{ width: '70%' }}></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-300 text-lg">Loading your health data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Health Dashboard
            </h1>
           
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors">
              <Download className="w-4 h-4" />
              Export Data
            </button>
          </div>
          <p className="text-gray-400">Track and monitor your health metrics over time</p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Blood Pressure"
            value={getLatestReading("bp")}
            icon={Heart}
            color="from-red-500 to-pink-500"
            trend={getTrend("bp")}
            unit=""
          />
          <MetricCard
            title="Blood Sugar"
            value={`${getLatestReading("sugar")} mg/dL`}
            icon={Droplet}
            color="from-blue-500 to-cyan-500"
            trend={getTrend("sugar")}
            unit=" mg/dL"
          />
          <MetricCard
            title="Heart Rate"
            value={`${getLatestReading("heartRate")} bpm`}
            icon={Activity}
            color="from-purple-500 to-pink-500"
            trend={getTrend("heartRate")}
            unit=" bpm"
          />
        </div>

        {/* Chart Section */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Health Trends</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedMetric("bp")}
                className={`px-4 py-2 rounded-lg transition-all ${selectedMetric === "bp" ? 'bg-red-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                Blood Pressure
              </button>
              <button
                onClick={() => setSelectedMetric("sugar")}
                className={`px-4 py-2 rounded-lg transition-all ${selectedMetric === "sugar" ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                Blood Sugar
              </button>
              <button
                onClick={() => setSelectedMetric("heartRate")}
                className={`px-4 py-2 rounded-lg transition-all ${selectedMetric === "heartRate" ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                Heart Rate
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={selectedMetric === "bp" ? "#ef4444" : selectedMetric === "sugar" ? "#3b82f6" : "#a855f7"} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={selectedMetric === "bp" ? "#ef4444" : selectedMetric === "sugar" ? "#3b82f6" : "#a855f7"} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <Area type="monotone" dataKey={selectedMetric} stroke={selectedMetric === "bp" ? "#ef4444" : selectedMetric === "sugar" ? "#3b82f6" : "#a855f7"} fillOpacity={1} fill="url(#colorMetric)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Logs */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Health Logs</h2>
          <div className="space-y-4">
            {logs.slice().reverse().map((log, index) => (
              <div
                key={log._id}
                className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-400 text-sm">{new Date(log.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  {log.symptoms !== "None" && (
                    <div className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs">
                      <AlertCircle className="w-3 h-3" />
                      Symptoms
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <Heart className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Blood Pressure</p>
                      <p className="text-white font-semibold">{log.bp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <Droplet className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Blood Sugar</p>
                      <p className="text-white font-semibold">{log.sugar} mg/dL</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <Activity className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Heart Rate</p>
                      <p className="text-white font-semibold">{log.heartRate} bpm</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-600/20 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Symptoms</p>
                      <p className="text-white font-semibold">{log.symptoms}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  
}