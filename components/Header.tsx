"use client";
import Link from 'next/link';
import { useGlobalStore, Vendor, Technology, Region } from '../store/globalStore';
import clsx from 'clsx';

export function Header() {
  const { vendorFilter, technologyFilter, regionFilter, setFilters, importData, exportData } = useGlobalStore();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-gray-200">
      <div className="container mx-auto px-4 h-[var(--header-height)] flex items-center gap-4">
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <Link href="/noc" className="hover:text-blue-600">NOC</Link>
          <Link href="/kpi/2g" className="hover:text-blue-600">2G KPI</Link>
          <Link href="/kpi/3g" className="hover:text-blue-600">3G KPI</Link>
          <Link href="/kpi/4g" className="hover:text-blue-600">4G KPI</Link>
          <Link href="/alarms" className="hover:text-blue-600">Alarms</Link>
          <Link href="/work-orders" className="hover:text-blue-600">Work Orders</Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <select
            className="border rounded px-2 py-1 text-sm"
            value={vendorFilter || ''}
            onChange={(e) => setFilters({ vendor: (e.target.value || undefined) as Vendor | undefined })}
          >
            <option value="">All Vendors</option>
            <option>Ericsson</option>
            <option>Huawei</option>
            <option>Nokia</option>
          </select>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={technologyFilter || ''}
            onChange={(e) => setFilters({ technology: (e.target.value || undefined) as Technology | undefined })}
          >
            <option value="">All Tech</option>
            <option>2G</option>
            <option>3G</option>
            <option>4G</option>
          </select>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={regionFilter || ''}
            onChange={(e) => setFilters({ region: (e.target.value || undefined) as Region | undefined })}
          >
            <option value="">All Regions</option>
            <option>EMEA</option>
            <option>APAC</option>
            <option>AMER</option>
          </select>
          <label className="cursor-pointer text-sm px-2 py-1 border rounded bg-gray-50 hover:bg-gray-100">
            Import
            <input
              type="file"
              className="hidden"
              accept=".csv,.xlsx,.xls,.txt"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) importData(file);
                e.currentTarget.value = '';
              }}
            />
          </label>
          <button
            className={clsx(
              'text-sm px-2 py-1 border rounded bg-blue-600 text-white hover:bg-blue-700')}
            onClick={() => exportData('xlsx')}
          >
            Export
          </button>
        </div>
      </div>
    </header>
  );
}
