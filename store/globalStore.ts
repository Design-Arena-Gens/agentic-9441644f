"use client";
import { create } from 'zustand';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export type Vendor = 'Ericsson' | 'Huawei' | 'Nokia';
export type Technology = '2G' | '3G' | '4G';
export type Region = 'EMEA' | 'APAC' | 'AMER';
export type Severity = 'Critical' | 'Major' | 'Minor' | 'Normal';
export type Team = 'R&D' | 'Transmission' | 'Core';

export interface KPIRecord {
  id: string;
  timestamp: number;
  vendor: Vendor;
  technology: Technology;
  region: Region;
  kpis: {
    availability: number; // percent
    traffic: number; // Erlangs or GB
    dropRate: number; // percent
    throughput?: number; // Mbps (3G/4G)
    cssr?: number; // Call setup success rate (2G/3G)
  };
}

export interface AlarmRecord {
  id: string;
  timestamp: number;
  vendor: Vendor;
  technology: Technology;
  region: Region;
  severity: Severity;
  title: string;
  site: string;
}

export interface WorkOrderRecord {
  id: string;
  number: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  team: Team;
  region: Region;
  vendor: Vendor;
}

export interface GlobalState {
  vendorFilter?: Vendor;
  technologyFilter?: Technology;
  regionFilter?: Region;
  kpi: KPIRecord[];
  alarms: AlarmRecord[];
  workOrders: WorkOrderRecord[];
  setFilters: (f: { vendor?: Vendor; technology?: Technology; region?: Region }) => void;
  importData: (file: File) => void;
  exportData: (format: 'csv' | 'xlsx') => void;
  addRandomUpdate: () => void;
  mergeParsedRows: (rows: any[]) => void;
}

function randomChoice<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function seedData(): Pick<GlobalState, 'kpi' | 'alarms' | 'workOrders'> {
  const vendors: Vendor[] = ['Ericsson', 'Huawei', 'Nokia'];
  const techs: Technology[] = ['2G', '3G', '4G'];
  const regions: Region[] = ['EMEA', 'APAC', 'AMER'];

  const kpi: KPIRecord[] = [];
  const now = Date.now();
  for (let i = 0; i < 120; i++) {
    const vendor = randomChoice(vendors);
    const technology = randomChoice(techs);
    const region = randomChoice(regions);
    const base = 0.95 + Math.random() * 0.05;
    kpi.push({
      id: `kpi_${i}`,
      timestamp: now - (120 - i) * 60_000,
      vendor,
      technology,
      region,
      kpis: {
        availability: Math.round(base * 10000) / 100,
        traffic: Math.round(50 + Math.random() * 500),
        dropRate: Math.round(Math.random() * 200) / 100,
        throughput: technology !== '2G' ? Math.round(10 + Math.random() * 100) : undefined,
        cssr: technology !== '4G' ? Math.round(96 + Math.random() * 4) : undefined,
      },
    });
  }

  const severities: Severity[] = ['Critical', 'Major', 'Minor', 'Normal'];
  const alarms: AlarmRecord[] = Array.from({ length: 24 }).map((_, i) => ({
    id: `al_${i}`,
    timestamp: now - Math.floor(Math.random() * 3600_000),
    vendor: randomChoice(vendors),
    technology: randomChoice(techs),
    region: randomChoice(regions),
    severity: randomChoice(severities),
    title: randomChoice(['Link Down', 'High Utilization', 'Power Failure', 'Interference Detected']),
    site: `SITE-${1000 + i}`,
  }));

  const teams: Team[] = ['R&D', 'Transmission', 'Core'];
  const workOrders: WorkOrderRecord[] = Array.from({ length: 20 }).map((_, i) => ({
    id: `wo_${i}`,
    number: `WO-${10000 + i}`,
    description: randomChoice([
      'Investigate packet loss',
      'Replace faulty transmission card',
      'Optimize handover parameters',
      'Upgrade baseband module',
    ]),
    status: randomChoice(['Open', 'In Progress', 'Resolved']),
    team: randomChoice(teams),
    region: randomChoice(regions),
    vendor: randomChoice(vendors),
  }));

  return { kpi, alarms, workOrders };
}

export const useGlobalStore = create<GlobalState>()((set, get) => {
  const seeded = seedData();
  return {
    vendorFilter: undefined,
    technologyFilter: undefined,
    regionFilter: undefined,
    kpi: seeded.kpi,
    alarms: seeded.alarms,
    workOrders: seeded.workOrders,
    setFilters: (f) => set(() => ({
      vendorFilter: f.vendor,
      technologyFilter: f.technology,
      regionFilter: f.region,
    })),
    importData: async (file: File) => {
      const name = file.name.toLowerCase();
      const ext = name.endsWith('.csv') ? 'csv' : name.endsWith('.txt') ? 'txt' : 'xlsx';
      if (ext === 'csv' || ext === 'txt') {
        const text = await file.text();
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
        get().mergeParsedRows(parsed.data as any[]);
      } else {
        const buf = await file.arrayBuffer();
        const wb = XLSX.read(buf);
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);
        get().mergeParsedRows(rows as any[]);
      }
    },
    exportData: (format) => {
      const data = get();
      if (format === 'csv') {
        const csv = Papa.unparse([
          { section: 'KPI' },
          ...data.kpi.map(k => ({ section: 'KPI', ...k })),
          { section: 'ALARMS' },
          ...data.alarms.map(a => ({ section: 'ALARMS', ...a })),
          { section: 'WORKORDERS' },
          ...data.workOrders.map(w => ({ section: 'WORKORDERS', ...w })),
        ] as any[]);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'export.csv';
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data.kpi as any), 'KPI');
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data.alarms as any), 'Alarms');
        XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data.workOrders as any), 'WorkOrders');
        XLSX.writeFile(wb, 'export.xlsx');
      }
    },
    addRandomUpdate: () => {
      const current = get().kpi;
      if (current.length === 0) return;
      const last = current[current.length - 1];
      const next: KPIRecord = {
        ...last,
        id: `kpi_${Date.now()}`,
        timestamp: Date.now(),
        kpis: {
          ...last.kpis,
          availability: Math.max(90, Math.min(100, last.kpis.availability + (Math.random() - 0.5))),
          traffic: Math.max(0, last.kpis.traffic + Math.round((Math.random() - 0.5) * 20)),
          dropRate: Math.max(0, Math.min(10, last.kpis.dropRate + (Math.random() - 0.5))),
          throughput: last.kpis.throughput !== undefined ? Math.max(1, last.kpis.throughput + Math.round((Math.random() - 0.5) * 5)) : undefined,
          cssr: last.kpis.cssr !== undefined ? Math.max(90, Math.min(100, last.kpis.cssr + (Math.random() - 0.5))) : undefined,
        },
      };
      set({ kpi: [...current.slice(-119), next] });

      // Occasionally add or update alarms
      if (Math.random() < 0.3) {
        set((state) => {
          const sev: Severity[] = ['Critical', 'Major', 'Minor', 'Normal'];
          const newAlarm: AlarmRecord = {
            id: `al_${Date.now()}`,
            timestamp: Date.now(),
            vendor: next.vendor,
            technology: next.technology,
            region: next.region,
            severity: randomChoice(sev),
            title: randomChoice(['Link Down', 'High Utilization', 'Power Failure', 'Interference Detected']),
            site: `SITE-${Math.floor(Math.random() * 9999)}`,
          };
          return { alarms: [newAlarm, ...state.alarms].slice(0, 100) };
        });
      }
    },
    mergeParsedRows: (rows: any[]) => {},
  } as GlobalState & { mergeParsedRows: (rows: any[]) => void };
});

// augment store with helper not in interface
useGlobalStore.getState().mergeParsedRows = (rows: any[]) => {
  const parseVendor = (v: any): Vendor | undefined => ['Ericsson','Huawei','Nokia'].includes(v) ? v : undefined;
  const parseTech = (t: any): Technology | undefined => ['2G','3G','4G'].includes(t) ? t : undefined;
  const parseRegion = (r: any): Region | undefined => ['EMEA','APAC','AMER'].includes(r) ? r : undefined;

  const kpi: KPIRecord[] = [];
  const alarms: AlarmRecord[] = [];
  const workOrders: WorkOrderRecord[] = [];

  for (const row of rows) {
    const type = (row.type || row.Type || row.sheet || '').toString().toLowerCase();
    if (type.includes('kpi')) {
      const technology = (row.technology || row.Technology) as Technology;
      kpi.push({
        id: row.id || `kpi_imp_${Math.random().toString(36).slice(2, 8)}`,
        timestamp: row.timestamp ? Number(row.timestamp) : Date.now(),
        vendor: parseVendor(row.vendor || row.Vendor) || 'Ericsson',
        technology: parseTech(technology) || '4G',
        region: parseRegion(row.region || row.Region) || 'EMEA',
        kpis: {
          availability: Number(row.availability ?? row.Availability ?? 99),
          traffic: Number(row.traffic ?? row.Traffic ?? 100),
          dropRate: Number(row.dropRate ?? row.DropRate ?? 1),
          throughput: technology !== '2G' ? Number(row.throughput ?? row.Throughput ?? 50) : undefined,
          cssr: technology !== '4G' ? Number(row.cssr ?? row.CSSR ?? 98) : undefined,
        }
      });
    } else if (type.includes('alarm')) {
      alarms.push({
        id: row.id || `al_imp_${Math.random().toString(36).slice(2, 8)}`,
        timestamp: row.timestamp ? Number(row.timestamp) : Date.now(),
        vendor: parseVendor(row.vendor || row.Vendor) || 'Ericsson',
        technology: parseTech(row.technology || row.Technology) || '4G',
        region: parseRegion(row.region || row.Region) || 'EMEA',
        severity: (row.severity || row.Severity || 'Minor') as Severity,
        title: (row.title || row.Title || 'Imported Alarm').toString(),
        site: (row.site || row.Site || 'SITE-0000').toString(),
      });
    } else if (type.includes('wo') || type.includes('ticket')) {
      workOrders.push({
        id: row.id || `wo_imp_${Math.random().toString(36).slice(2, 8)}`,
        number: (row.number || row.Number || 'WO-0000').toString(),
        description: (row.description || row.Description || 'Imported Work Order').toString(),
        status: (row.status || row.Status || 'Open') as any,
        team: (row.team || row.Team || 'R&D') as any,
        region: parseRegion(row.region || row.Region) || 'EMEA',
        vendor: parseVendor(row.vendor || row.Vendor) || 'Ericsson',
      });
    }
  }

  useGlobalStore.setState((s) => ({
    kpi: kpi.length ? kpi : s.kpi,
    alarms: alarms.length ? alarms : s.alarms,
    workOrders: workOrders.length ? workOrders : s.workOrders,
  }));
};
