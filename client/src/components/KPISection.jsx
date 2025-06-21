import { RadialBarChart, RadialBar, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function KPISection({ kpis }) {
  if (!kpis) return null;
  const desk = Math.round((kpis.deskOccupancy || kpis.assigned_pct || 0) * 100);
  const zone = Math.round((
    kpis.zoneOccupancy ??
    kpis.zoneOccupan ??
    kpis.zone_occupancy ??
    0
  ) * 100);
  const groups = Math.round((
    kpis.groupsTogether ??
    kpis.groupsTogheter ??
    kpis.gropusTogheter ??
    0
  ) * 100);
  const preferred = Math.round((kpis.preferredDays || (1 - (kpis.non_preferred_pct || 0))) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="bg-gray-200 rounded-lg p-4 flex flex-col items-center" aria-label="% puestos ocupados">
        <RadialBarChart width={150} height={100} innerRadius="70%" data={[{ name: 'a', value: desk }]} startAngle={180} endAngle={0}>
          <RadialBar dataKey="value" cornerRadius={10} fill="#4332E0" />
        </RadialBarChart>
        <p className="text-2xl font-bold">{desk}%</p>
        <p className="text-lg">Puestos Ocupados</p>
      </div>
      <div className="bg-gray-200 rounded-lg p-4 flex flex-col items-center" aria-label="% zonas ocupadas">
        <RadialBarChart width={150} height={100} innerRadius="70%" data={[{ name: 'a', value: zone }]} startAngle={180} endAngle={0}>
          <RadialBar dataKey="value" cornerRadius={10} fill="#4332E0" />
        </RadialBarChart>
        <p className="text-2xl font-bold">{zone}%</p>
        <p className="text-lg">Zonas Ocupadas</p>
      </div>
      <div className="bg-gray-200 rounded-lg p-4 flex flex-col items-center" aria-label="% grupos juntos">
        <BarChart width={200} height={100} data={[{ name: 'groups', value: groups }]} layout="vertical">
          <Bar dataKey="value" fill="#7AE090" />
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis type="category" dataKey="name" hide />
          <Tooltip />
        </BarChart>
        <p className="text-2xl font-bold">{groups}%</p>
        <p className="text-lg">Grupos Juntos</p>
      </div>
      <div className="bg-gray-200 rounded-lg p-4 flex flex-col items-center" aria-label="% cumplimiento días preferidos">
        <BarChart width={200} height={100} data={[{ name: 'pref', value: preferred }]} layout="vertical">
          <Bar dataKey="value" fill="#7AE090" />
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis type="category" dataKey="name" hide />
          <Tooltip />
        </BarChart>
        <p className="text-2xl font-bold">{preferred}%</p>
        <p className="text-lg text-center">Cumplimiento Días Preferidos</p>
      </div>
    </div>
  );
}
