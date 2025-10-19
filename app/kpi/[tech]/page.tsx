"use client";
import { useParams } from 'next/navigation';
import { KPIChart } from '../../../components/KPIChart';
import type { Technology } from '@/store/globalStore';

export default function TechKPIPage() {
  const params = useParams();
  const tech = (params?.tech as string || '4G').toUpperCase() as Technology;
  return (
    <div className="space-y-6">
      <KPIChart tech={tech} />
    </div>
  );
}
