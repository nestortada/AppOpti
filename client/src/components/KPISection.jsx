import { useEffect, useRef } from 'react';

function AnimatedGauge({ value, color = '#4332E0', label }) {
  const ref = useRef();
  useEffect(() => {
    if (ref.current) {
      ref.current.style.strokeDasharray = `${value * 1.26}, 126`;
    }
  }, [value]);
  return (
    <div className="flex flex-col items-center justify-center">
      <svg width="120" height="80" viewBox="0 0 120 80">
        <path d="M20,70 A40,40 0 0,1 100,70" fill="none" stroke="#E3E3E3" strokeWidth="16" />
        <path ref={ref} d="M20,70 A40,40 0 0,1 100,70" fill="none" stroke={color} strokeWidth="16" strokeLinecap="round" style={{ strokeDasharray: `${value * 1.26}, 126`, transition: 'stroke-dasharray 1s cubic-bezier(0.4,0,0.2,1)' }} />
      </svg>
      <span className="text-3xl font-bold mt-[-32px]">{value}%</span>
      <span className="text-lg mt-1 text-black font-medium text-center">{label}</span>
    </div>
  );
}

function AnimatedBar({ value, color = '#7AE090', label }) {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden mb-2">
        <div
          className="h-8 rounded-full transition-all duration-700"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      <span className="text-3xl font-bold">{value}%</span>
      <span className="text-lg mt-1 text-black font-medium text-center">{label}</span>
    </div>
  );
}

export default function KPISection({ kpis }) {
  if (!kpis) return null;
  const desk = Math.round(kpis.weekly_desk_occupancy *100 || 0);
  const same = Math.round(kpis.same_desk_pct *100 || 0);
  const groups = Math.round((kpis.groups_together_pct || 0) * 100);
  const preferred = Math.round(100 - (kpis.non_preferred_pct || 0) * 100);

  return (
    <section className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10 mt-8">
      <div className="bg-[#E3E3E3] shadow-lg rounded-xl p-6 flex flex-col items-center relative">
        <AnimatedGauge value={desk} color="#4332E0" label="Puestos Ocupados" />
      </div>
      <div className="bg-[#E3E3E3] shadow-lg rounded-xl p-6 flex flex-col items-center relative">
        <AnimatedGauge value={same} color="#4332E0" label="Mismo Puesto Durante la Semana" />
      </div>
      <div className="bg-[#E3E3E3] shadow-lg rounded-xl p-6 flex flex-col items-center relative">
        <AnimatedBar value={groups} color="#7AE090" label="Grupos Juntos" />
      </div>
      <div className="bg-[#E3E3E3] shadow-lg rounded-xl p-6 flex flex-col items-center relative">
        <AnimatedBar value={preferred} color="#7AE090" label="Cumplimiento Días Preferidos" />
      </div>
    </section>
  );
}
