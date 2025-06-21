import { useState } from 'react';
import EmployeeTable from './EmployeeTable';
import GroupTable from './GroupTable';
import DownloadExcel from './DownloadExcel';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

export default function DayTabs({ assignments = [] }) {
  const [day, setDay] = useState(0);
  const currentDay = DAYS[day][0];
  const dayAssignments = assignments.filter(a => (a.day || '').startsWith(currentDay));
  return (
    <div className="mb-6">
      <div className="flex gap-2 mb-2">
        {DAYS.map((d, idx) => (
          <button key={d} onClick={() => setDay(idx)} className={`px-4 py-2 rounded ${idx===day ? 'bg-purple-700 text-white' : 'bg-gray-200'}`}>{d}</button>
        ))}
      </div>
      <div className="opacity-100 transition-opacity duration-150">
        <div className="grid md:grid-cols-2 gap-4">
          <EmployeeTable assignments={dayAssignments} />
          <GroupTable assignments={dayAssignments} />
        </div>
        <DownloadExcel assignments={assignments} />
      </div>
    </div>
  );
}
