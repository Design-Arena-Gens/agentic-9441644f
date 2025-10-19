"use client";
import { useMemo, useState } from 'react';
import { useGlobalStore, Severity } from '../store/globalStore';

const severityOrder: Severity[] = ['Critical','Major','Minor','Normal'];

export function AlarmTable() {
  const { alarms } = useGlobalStore();
  const [active, setActive] = useState<Severity | 'All'>('All');

  const filtered = useMemo(() => alarms
    .filter(a => active === 'All' ? true : a.severity === active)
    .sort((a, b) => severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity)), [alarms, active]);

  return (
    <div className="border bg-white rounded p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold">Alarms</div>
        <div className="flex gap-2 text-sm">
          {(['All', ...severityOrder] as const).map(s => (
            <button key={s} className={`px-2 py-1 border rounded ${active===s?'bg-gray-800 text-white':'bg-gray-50'}`} onClick={()=>setActive(s)}>{s}</button>
          ))}
        </div>
      </div>
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left bg-gray-50">
              <th className="p-2">Time</th>
              <th className="p-2">Severity</th>
              <th className="p-2">Vendor</th>
              <th className="p-2">Tech</th>
              <th className="p-2">Region</th>
              <th className="p-2">Site</th>
              <th className="p-2">Title</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id} className="border-b last:border-0">
                <td className="p-2">{new Date(a.timestamp).toLocaleString()}</td>
                <td className="p-2"><span className={`px-2 py-1 rounded text-white ${a.severity==='Critical'?'bg-critical':a.severity==='Major'?'bg-major':a.severity==='Minor'?'bg-minor':'bg-normal'}`}>{a.severity}</span></td>
                <td className="p-2">{a.vendor}</td>
                <td className="p-2">{a.technology}</td>
                <td className="p-2">{a.region}</td>
                <td className="p-2">{a.site}</td>
                <td className="p-2">{a.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
