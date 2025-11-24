import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Activity, Zap, Clock, TrendingUp, TrendingDown, BarChart3, Gauge, Sparkles } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [currentData, setCurrentData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({ min: 0, max: 0, avg: 0 });

  // Fetch prediction data
  const fetchPrediction = async () => {
    try {
      const response = await axios.get(`${API_URL}/predict`);
      const data = response.data;
      
      setCurrentData(data);
      setError(null);
      
      // Add to history (keep last 20 points)
      setHistory(prev => {
        const newHistory = [...prev, {
          time: data.time,
          value: data.predicted_megawatts,
          timestamp: new Date().getTime()
        }];
        const latest = newHistory.slice(-20);
        
        // Calculate stats
        if (latest.length > 0) {
          const values = latest.map(h => h.value);
          setStats({
            min: Math.min(...values),
            max: Math.max(...values),
            avg: values.reduce((a, b) => a + b, 0) / values.length
          });
        }
        
        return latest;
      });
      
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data. Is the backend running?');
      setLoading(false);
    }
  };

  // Update current time every second
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  // Fetch data every 2 seconds
  useEffect(() => {
    fetchPrediction(); // Initial fetch
    const interval = setInterval(fetchPrediction, 2000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center fade-in">
          <div className="relative mb-6">
            <Zap className="w-20 h-20 mx-auto text-cyan-400 spinner" />
            <div className="absolute inset-0 blur-2xl bg-cyan-500 opacity-30 rounded-full"></div>
          </div>
          <h2 className="text-3xl font-bold gradient-text mb-2">Initializing Dashboard</h2>
          <p className="text-gray-400">Connecting to energy prediction system...</p>
        </div>
      </div>
    );
  }

  if (error && !currentData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card max-w-md fade-in">
          <Activity className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h2 className="text-2xl font-bold text-red-400 mb-2">Connection Error</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <p className="text-sm text-gray-500 mb-6">Make sure the backend is running on {API_URL}</p>
          <button 
            onClick={fetchPrediction}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-cyan-500/50 transition-all duration-300 mx-auto block"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const isHighLoad = currentData?.predicted_megawatts > 2200;
  const trend = currentData?.trend || 'stable';

  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 fade-in">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Zap className="w-12 h-12 md:w-14 md:h-14 text-cyan-400 mr-3 glow" />
              <div className="absolute inset-0 blur-xl bg-cyan-400 opacity-40"></div>
            </div>
            <h1 className="text-4xl md:text-6xl font-black gradient-text">
              Energy Dashboard
            </h1>
            <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-purple-400 ml-3" />
          </div>
          <p className="text-gray-400 text-base md:text-xl font-semibold mb-4">
            Real-Time Energy Prediction & Monitoring System
          </p>
          <div className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 shadow-lg">
            <Clock className="w-5 h-5 text-purple-400" />
            <span className="text-xl md:text-2xl font-mono font-bold text-white">
              {currentTime.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Main Stats Grid - 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Current Load */}
          <div className="card fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="icon-container">
              <TrendingUp className={`w-6 h-6 ${isHighLoad ? 'text-red-400' : 'text-emerald-400'}`} />
            </div>
            <h3 className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-3">Current Load</h3>
            <div className="stat-number mb-2 counter">
              {currentData?.predicted_megawatts.toFixed(2)}
              <span className="text-2xl text-gray-400 ml-2 font-normal">MW</span>
            </div>
            <div className="text-sm text-gray-500 flex items-center justify-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              {currentData?.date} • {currentData?.time}
            </div>
            {/* Progress Bar */}
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${Math.min((currentData?.predicted_megawatts / 3500) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Grid Status */}
          <div className="card fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="icon-container">
              <Activity className={`w-6 h-6 ${isHighLoad ? 'text-red-400 pulse' : 'text-emerald-400'}`} />
            </div>
            <h3 className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-3">Grid Status</h3>
            <div className={`text-4xl md:text-5xl font-black mb-4 ${isHighLoad ? 'text-red-400' : 'text-emerald-400'}`}>
              {currentData?.status}
            </div>
            <span className={`status-badge ${isHighLoad ? 'status-high' : 'status-normal'}`}>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
              Threshold: 2200 MW
            </span>
          </div>

          {/* Confidence */}
          <div className="card fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="icon-container">
              <Gauge className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-3">Confidence</h3>
            <div className="stat-number mb-2 counter" style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {currentData?.confidence || 95}
              <span className="text-2xl text-gray-400 ml-2 font-normal">%</span>
            </div>
            <div className="text-sm text-gray-500 mb-4">
              Prediction accuracy
            </div>
            {/* Confidence Bar */}
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${currentData?.confidence || 95}%`,
                  background: 'linear-gradient(90deg, #7c3aed, #ec4899)'
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Statistics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="card slide-in-left">
            <div className="flex items-center justify-center gap-4 mb-2">
              <TrendingDown className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-gray-400 text-xs uppercase font-bold mb-2">Minimum Load</p>
            <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {stats.min.toFixed(2)} <span className="text-base text-gray-500">MW</span>
            </p>
          </div>

          <div className="card fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-center gap-4 mb-2">
              <Activity className="w-8 h-8 text-purple-400" />
            </div>
            <p className="text-gray-400 text-xs uppercase font-bold mb-2">Average Load</p>
            <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {stats.avg.toFixed(2)} <span className="text-base text-gray-500">MW</span>
            </p>
          </div>

          <div className="card slide-in-right">
            <div className="flex items-center justify-center gap-4 mb-2">
              <TrendingUp className="w-8 h-8 text-emerald-400" />
            </div>
            <p className="text-gray-400 text-xs uppercase font-bold mb-2">Maximum Load</p>
            <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
              {stats.max.toFixed(2)} <span className="text-base text-gray-500">MW</span>
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="card fade-in">
          <h3 className="text-2xl md:text-3xl font-bold mb-6 flex items-center justify-center gap-3">
            <TrendingUp className="w-8 h-8 text-cyan-400" />
            <span className="gradient-text">Live Prediction Trend</span>
          </h3>
          
          {history.length > 0 ? (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#64748b"
                    style={{ fontSize: '12px', fontWeight: '600' }}
                  />
                  <YAxis 
                    stroke="#64748b"
                    style={{ fontSize: '12px', fontWeight: '600' }}
                    domain={['dataMin - 100', 'dataMax + 100']}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(10, 10, 26, 0.95)',
                      border: '1px solid rgba(0, 212, 255, 0.3)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      backdropFilter: 'blur(10px)',
                      padding: '12px',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.4)'
                    }}
                    formatter={(value) => [`${value.toFixed(2)} MW`, 'Predicted Load']}
                    labelStyle={{ color: '#cbd5e1', fontWeight: '600' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#00d4ff" 
                    strokeWidth={3}
                    fill="url(#colorValue)"
                    dot={{ fill: '#00d4ff', r: 5, strokeWidth: 2, stroke: '#0a0a1a' }}
                    activeDot={{ r: 7, fill: '#ec4899', stroke: '#ffffff', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">Collecting data...</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-gray-500 text-sm fade-in">
          <div className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-gray-400">Powered by FastAPI + PyTorch • Real-time Energy Prediction</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
