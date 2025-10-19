"use client";
import { useMemo } from 'react';
import { useGlobalStore } from '../store/globalStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#14b8a6'];

function toSeries(counts: Record<string, number>) {
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

export function NOCOverview() {
  const { kpi, vendorFilter, technologyFilter, regionFilter } = useGlobalStore();

  const filtered = useMemo(() => kpi.filter(r => (
    (!vendorFilter || r.vendor === vendorFilter) &&
    (!technologyFilter || r.technology === technologyFilter) &&
    (!regionFilter || r.region === regionFilter)
  )), [kpi, vendorFilter, technologyFilter, regionFilter]);

  const vendorCounts = filtered.reduce<Record<string, number>>((acc, r) => { acc[r.vendor] = (acc[r.vendor]||0)+1; return acc; }, {});
  const techCounts = filtered.reduce<Record<string, number>>((acc, r) => { acc[r.technology] = (acc[r.technology]||0)+1; return acc; }, {});
  const regionCounts = filtered.reduce<Record<string, number>>((acc, r) => { acc[r.region] = (acc[r.region]||0)+1; return acc; }, {});

  const sections = [
    { title: 'Vendors', data: toSeries(vendorCounts) },
    { title: 'Technologies', data: toSeries(techCounts) },
    { title: 'Regions', data: toSeries(regionCounts) },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {sections.map((s) => (
        <div key={s.title} className="border bg-white rounded p-4">
          <div className="font-semibold mb-2">{s.title}</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie dataKey="value" data={s.data} label outerRadius={90}>
                  {s.data.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
}
