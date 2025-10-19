# Network Monitoring Platform

A Next.js + Tailwind CSS application providing multi-vendor (Ericsson, Huawei, Nokia) and multi-technology (2G, 3G, 4G) network monitoring:

- NOC Operation Dashboard with summaries by vendor, technology, and region
- Technology-specific KPI dashboards (2G, 3G, 4G)
- Alarm Management with severity filters
- Work Order Management with team and status filters
- Import/Export CSV/XLSX/TXT across all pages
- Real-time simulated updates every 5 seconds

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build && npm start
```

## Deploy

```bash
vercel deploy --prod --yes --name agentic-9441644f
```
