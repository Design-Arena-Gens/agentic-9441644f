"use client";
import { useMemo, useState } from 'react';
import { useGlobalStore, Team } from '../store/globalStore';

export function WOTable() {
  const { workOrders } = useGlobalStore();
  const [team, setTeam] = useState<Team | 'All'>('All');
  const [status, setStatus] = useState<'All' | 'Open' | 'In Progress' | 'Resolved'>('All');

  const filtered = useMemo(() => workOrders.filter(w =>
    (team==='All' || w.team === team) && (status==='All' || w.status === status)
  ), [workOrders, team, status]);

  return (
    <div className="border bg-white rounded p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold">Work Orders</div>
        <div className="flex gap-2 text-sm">
          <select className="border rounded px-2 py-1" value={team} onChange={e=>setTeam(e.target.value as any)}>
            <option>All</option>
            <option>R&D</option>
            <option>Transmission</option>
            <option>Core</option>
          </select>
          <select className="border rounded px-2 py-1" value={status} onChange={e=>setStatus(e.target.value as any)}>
            <option>All</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
        </div>
      </div>
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left bg-gray-50">
              <th className="p-2">WO #</th>
              <th className="p-2">Description</th>
              <th className="p-2">Status</th>
              <th className="p-2">Team</th>
              <th className="p-2">Region</th>
              <th className="p-2">Vendor</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(w => (
              <tr key={w.id} className="border-b last:border-0">
                <td className="p-2">{w.number}</td>
                <td className="p-2">{w.description}</td>
                <td className="p-2">{w.status}</td>
                <td className="p-2">{w.team}</td>
                <td className="p-2">{w.region}</td>
                <td className="p-2">{w.vendor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
