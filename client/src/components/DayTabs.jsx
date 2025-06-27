import { useState } from 'react';
import EmployeeTable from './EmployeeTable';
import GroupTable from './GroupTable';
import GroupZoneTable from './GroupZoneTable';
import DownloadExcel from './DownloadExcel';

const DAYS = [
  { label: 'Lunes', code: 'L' },
  { label: 'Martes', code: 'Ma' },
  { label: 'Miércoles', code: 'Mi' },
  { label: 'Jueves', code: 'J' },
  { label: 'Viernes', code: 'V' },
];

export default function DayTabs({ assignments = [], groupZonesTable = [] }) {
  const [day, setDay] = useState(0); // Por defecto Lunes
  const currentCode = DAYS[day].code;

  // Filtrar solo por el código de día exacto
  const dayAssignments = assignments.filter(a => (a.day || '') === currentCode);
  const dayGroupZones = groupZonesTable.filter(gz => (gz.day || '') === currentCode);

  return (
    <div className="mb-6">
      <div className="flex gap-2 mb-2">
        {DAYS.map((d, idx) => (
          <button key={d.code} onClick={() => setDay(idx)} className={`px-4 py-2 rounded ${idx===day ? 'bg-purple-700 text-white' : 'bg-gray-200'}`}>{d.label}</button>
        ))}
      </div>
      <div className="opacity-100 transition-opacity duration-150">
        <div className="grid md:grid-cols-2 gap-4">
          <EmployeeTable assignments={dayAssignments} />
          {dayGroupZones.length > 0 ? (
            <GroupZoneTable groupZones={dayGroupZones} />
          ) : (
            <div className="bg-gray-100 rounded-lg p-2 flex items-center justify-center min-h-[120px]">No hay datos de grupos para este día.</div>
          )}
        </div>
        <DownloadExcel assignments={assignments} />
      </div>
    </div>
  );
}
