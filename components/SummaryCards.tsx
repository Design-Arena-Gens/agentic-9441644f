"use client";
import { useMemo } from 'react';
import { useGlobalStore, Vendor, Technology, Region } from '../store/globalStore';

function countBy<T extends string>(items: any[], key: (x: any) => T | undefined): Record<T, number> {
  return items.reduce((acc, it) => {
    const k = key(it);
    if (!k) return acc;
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {} as Record<T, number>);
}

export function SummaryCards() {
  const { kpi, vendorFilter, technologyFilter, regionFilter } = useGlobalStore();

  const filtered = useMemo(() => kpi.filter(r => (
    (!vendorFilter || r.vendor === vendorFilter) &&
    (!technologyFilter || r.technology === technologyFilter) &&
    (!regionFilter || r.region === regionFilter)
  )), [kpi, vendorFilter, technologyFilter, regionFilter]);

  const byVendor = countBy<Vendor>(filtered, x => x.vendor);
  const byTech = countBy<Technology>(filtered, x => x.technology);
  const byRegion = countBy<Region>(filtered, x => x.region);

  const cards = [
    { title: 'By Vendor', data: byVendor },
    { title: 'By Technology', data: byTech },
    { title: 'By Region', data: byRegion },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((c) => (
        <div key={c.title} className="border bg-white rounded p-4">
          <div className="font-semibold mb-2">{c.title}</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(c.data).map(([k, v]) => (
              <span key={k} className="text-sm px-2 py-1 rounded bg-gray-100">
                {k}: {v}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
