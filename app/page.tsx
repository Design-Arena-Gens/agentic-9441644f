import { SummaryCards } from '../components/SummaryCards';

export default function Page() {
  return (
    <div className="space-y-6">
      <SummaryCards />
      <div className="text-sm text-gray-600">Use the header filters and Import/Export to load or extract data. Real-time updates occur every 5 seconds.</div>
    </div>
  );
}
