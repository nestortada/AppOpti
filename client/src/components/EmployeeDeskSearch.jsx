import { useState, useMemo } from 'react';
import Select from 'react-select';
import Fuse from 'fuse.js';
import { useResults } from '../context/ResultsContext';
import { User, Monitor } from 'lucide-react';

export default function EmployeeDeskSearch({ assignments = [] }) {
  const { data } = useResults();
  const employees = Array.from(new Set(assignments.map(a => a.employee)));
  const desks = Array.from(new Set(assignments.map(a => a.desk)));
  const options = [
    ...employees.map(e => ({ value: { type: 'employee', id: e }, label: e })),
    ...desks.map(d => ({ value: { type: 'desk', id: d }, label: d }))
  ];
  const fuse = useMemo(() => new Fuse(options, { keys: ['label'], threshold: 0.3 }), [options]);
  const [selected, setSelected] = useState(null);
  const filterOption = (option, input) => {
    if (!input) return true;
    return fuse.search(input).some(r => r.item.label === option.label);
  };

  let card = null;
  if (selected) {
    if (selected.type === 'employee') {
      const days = assignments.filter(a => a.employee === selected.id);
      // Buscar grupo del empleado usando data.employees_g
      const group = data?.employees_g?.[selected.id] || '-';
      card = (
        <div className="p-4 bg-white rounded shadow mt-4">
          <div className="flex items-center gap-2 font-bold"><User className="w-5" /> {selected.id}</div>
          <div className="text-sm text-gray-500 mb-2">Grupo: <span className="font-semibold text-black">{group}</span></div>
          {days.map((a,i) => <p key={i}>{a.day}: {a.desk}</p>)}
        </div>
      );
    } else {
      const days = assignments.filter(a => a.desk === selected.id);
      // Buscar zona del escritorio (la más frecuente en las asignaciones)
      const zone = days.length > 0 ? (days[0].zone || '-') : '-';
      card = (
        <div className="p-4 bg-white rounded shadow mt-4">
          <div className="flex items-center gap-2 font-bold"><Monitor className="w-5" /> {selected.id}</div>
          <div className="text-sm text-gray-500 mb-2">Zona: <span className="font-semibold text-black">{zone}</span></div>
          {days.map((a,i) => <p key={i}>{a.day}: {a.employee}</p>)}
        </div>
      );
    }
  }

  return (
    <div className="max-w-xs mx-auto mb-6">
      <Select options={options} onChange={o => setSelected(o?.value || null)}
        placeholder="Buscar empleado o escritorio" filterOption={filterOption}
        isClearable classNamePrefix="select" />
      {card}
    </div>
  );
}
