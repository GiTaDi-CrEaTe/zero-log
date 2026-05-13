import React, { useState } from 'react';
import Papa from 'papaparse';
import { ShieldAlert, FileSearch, ShieldCheck, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function App() {
  const [data, setData] = useState([]);
  const [threats, setThreats] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsAnalyzing(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        analyzeLogs(results.data);
        setIsAnalyzing(false);
      }
    });
  };

  const analyzeLogs = (rawRows) => {
    const ipStats = {};
    const detectedThreats = [];

    rawRows.forEach(row => {
      const ip = row.ip || row.client_ip || row.address || "unknown";
      const ua = (row.user_agent || "").toLowerCase();
      
      if (ip === "unknown") return;

      if (!ipStats[ip]) {
        ipStats[ip] = { count: 0, suspiciousUA: false, endpoints: new Set() };
      }

      ipStats[ip].count += 1;
      if (row.endpoint) ipStats[ip].endpoints.add(row.endpoint);
      
      // AI Heuristic: Flag suspicious User Agents
      if (ua.includes('python') || ua.includes('curl') || ua.includes('zgrab') || ua.includes('wget')) {
        ipStats[ip].suspiciousUA = true;
      }
    });

    Object.keys(ipStats).forEach(ip => {
      let score = 0;
      const stats = ipStats[ip];

      // Scoring Algorithm
      if (stats.count > 50) score += 40;
      if (stats.count > 200) score += 40;
      if (stats.suspiciousUA) score += 20;

      if (score >= 60) {
        detectedThreats.push({
          ip,
          count: stats.count,
          score,
          risk: score > 80 ? 'CRITICAL' : 'HIGH',
          reason: stats.suspiciousUA ? "Automated Tooling Detected (UA Spoofing)" : "High-Frequency Volumetric Attack",
          endpoints: stats.endpoints.size
        });
      }
    });

    const sortedData = Object.entries(ipStats)
      .map(([ip, s]) => ({ ip, count: s.count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    setData(sortedData);
    setThreats(detectedThreats.sort((a, b) => b.score - a.score));
  };

  const exportReport = () => {
    const jsonString = JSON.stringify(threats, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `zero-log-dossier-${new Date().getTime()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-void p-8 font-mono text-hacker">
      <header className="mb-12 border-b border-hacker/30 pb-6">
        <h1 className="text-4xl font-bold tracking-tighter">ZERO-LOG // THREAT HUNTER</h1>
        <p className="text-sm opacity-60 mt-2">PRIVATE CLIENT-SIDE LOG ANALYSIS ENGINE. NO DATA LEAVES THIS BROWSER.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upload Zone */}
        <div className="border border-hacker/50 p-6 rounded-lg bg-black/50 hover:border-hacker transition-all">
          <div className="flex items-center gap-3 mb-4">
            <FileSearch size={24} />
            <h2 className="text-xl">1. Ingest Logs</h2>
          </div>
          <input 
            type="file" 
            accept=".csv,.log"
            onChange={handleFileUpload}
            className="block w-full text-sm text-hacker file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-hacker file:text-black hover:file:bg-green-400 cursor-pointer"
          />
          <p className="text-xs mt-4 opacity-50">Upload CSV. Core columns: 'ip', 'user_agent', 'endpoint'.</p>
          {isAnalyzing && <p className="text-xs text-yellow-500 mt-2 animate-pulse">Analyzing heuristics...</p>}
        </div>

        {/* Analytics Dashboard */}
        <div className="lg:col-span-2 border border-hacker/50 p-6 rounded-lg bg-black/50">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck size={24} />
            <h2 className="text-xl">2. Traffic Distribution (Top 10 IPs)</h2>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="ip" stroke="#00ff00" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{backgroundColor: '#000', borderColor: '#00ff00'}} itemStyle={{color: '#00ff00'}} />
                <Bar dataKey="count" fill="#00ff00">
                   {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.count > 50 ? '#ff0000' : '#00ff00'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Threat Intelligence List */}
        <div className="lg:col-span-3 border border-red-500/50 p-6 rounded-lg bg-red-950/10 mt-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 text-red-500">
              <ShieldAlert size={24} />
              <h2 className="text-xl">3. Threat Intelligence Reports</h2>
            </div>
            
            {/* Export Button */}
            {threats.length > 0 && (
              <button 
                onClick={exportReport}
                className="flex items-center gap-2 border border-red-500 px-4 py-2 text-xs text-red-500 hover:bg-red-500 hover:text-black transition-colors uppercase font-bold tracking-widest"
              >
                <Download size={14} /> Export JSON Dossier
              </button>
            )}
          </div>

          {threats.length === 0 ? (
            <p className="text-sm opacity-50 italic">Awaiting log ingestion. No anomalies detected.</p>
          ) : (
            <div className="space-y-4">
              {threats.map((threat, idx) => (
                <div key={idx} className="flex flex-col border-l-4 border-red-600 bg-red-900/10 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-red-500 text-lg">{threat.ip} — {threat.risk} ({threat.score}/100)</p>
                      <p className="text-sm text-hacker opacity-90 mt-1">
                        <span className="text-red-400 font-bold">AI INSIGHT:</span> {threat.reason}
                      </p>
                    </div>
                    <div className="bg-red-600 text-black px-2 py-1 text-xs font-bold tracking-widest">
                      THREAT DETECTED
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-4 text-[10px] opacity-60 uppercase tracking-widest">
                     <p>Total Requests: {threat.count}</p>
                     <p>Unique Endpoints Targeted: {threat.endpoints}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}