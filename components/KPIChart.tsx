"use client";
import { useEffect } from 'react';
import { useGlobalStore, Technology } from '../store/globalStore';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function KPIChart({ tech }: { tech: Technology }) {
  const { kpi, addRandomUpdate } = useGlobalStore();

  useEffect(() => {
    const id = setInterval(() => addRandomUpdate(), 5000);
    return () => clearInterval(id);
  }, [addRandomUpdate]);

  const data = kpi.filter(r => r.technology === tech).map(r => ({
    time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    availability: r.kpis.availability,
    traffic: r.kpis.traffic,
    dropRate: r.kpis.dropRate,
    throughput: r.kpis.throughput ?? 0,
    cssr: r.kpis.cssr ?? 0,
  }));

  return (
    <div className="border bg-white rounded p-4">
      <div className="font-semibold mb-2">{tech} KPIs</div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <XAxis dataKey="time" interval={Math.floor(data.length / 6)} />
            <YAxis yAxisId="left" orientation="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="availability" stroke="#16a34a" dot={false} />
            <Line yAxisId="left" type="monotone" dataKey="dropRate" stroke="#ef4444" dot={false} />
            {tech !== '2G' && <Line yAxisId="right" type="monotone" dataKey="throughput" stroke="#2563eb" dot={false} />}
            {tech !== '4G' && <Line yAxisId="right" type="monotone" dataKey="cssr" stroke="#f59e0b" dot={false} />}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
