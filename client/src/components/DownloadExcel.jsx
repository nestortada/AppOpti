import * as XLSX from 'xlsx-js-style';
import { useResults } from '../context/ResultsContext';

function styleHeader(ws, range) {
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cell = ws[XLSX.utils.encode_cell({ r: 0, c: C })];
    if (cell) {
      cell.s = {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '4F81BD' } },
        alignment: { horizontal: 'center', vertical: 'center' },
        border: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } },
        },
      };
    }
  }
}

function autoWidth(ws, data) {
  const cols = Object.keys(data[0] || {});
  ws['!cols'] = cols.map(key => ({ wch: Math.max(key.length + 2, ...data.map(row => (row[key] ? String(row[key]).length : 0))) + 2 }));
}

export default function DownloadExcel({ assignments = [] }) {
  const { resultId, data } = useResults();
  const handle = () => {
    const wb = XLSX.utils.book_new();
    // Hoja 1: Empleado
    const empleados = assignments.map(a => ({
      Empleado: a.employee,
      Escritorio: a.desk,
      Día: a.day,
      Grupo: (data?.employees_g?.[a.employee] || a.group || ''),
    }));
    const ws1 = XLSX.utils.json_to_sheet(empleados);
    autoWidth(ws1, empleados);
    styleHeader(ws1, XLSX.utils.decode_range(ws1['!ref']));
    XLSX.utils.book_append_sheet(wb, ws1, 'Empleado');
    // Hoja 2: Grupo
    let meetingDays = [];
    if (Array.isArray(data?.meeting_days)) {
      meetingDays = data.meeting_days;
    } else if (data?.meeting_days && typeof data.meeting_days === 'object') {
      meetingDays = Object.entries(data.meeting_days).map(([g, d]) => ({ Grupo: g, 'Día de reunión': d }));
    }
    const ws2 = XLSX.utils.json_to_sheet(meetingDays);
    autoWidth(ws2, meetingDays);
    styleHeader(ws2, XLSX.utils.decode_range(ws2['!ref']));
    XLSX.utils.book_append_sheet(wb, ws2, 'Grupo');
    // Hoja 3: Puestos variables
    const diffDesks = Array.isArray(data?.different_desks) ? data.different_desks.map(e => ({ Empleado: e, Escritorios_distintos: 'Múltiples' })) : [];
    const ws3 = XLSX.utils.json_to_sheet(diffDesks);
    autoWidth(ws3, diffDesks);
    styleHeader(ws3, XLSX.utils.decode_range(ws3['!ref']));
    XLSX.utils.book_append_sheet(wb, ws3, 'Puestos variables');
    // Hoja 4: Solos en reunión
    let lonely = [];
    if (Array.isArray(data?.lonely_members)) {
      lonely = data.lonely_members.map(obj =>
        obj && typeof obj === 'object' && !Array.isArray(obj)
          ? { Grupo: obj.group, Empleado: obj.employee, Día: obj.day, Zona: obj.zone }
          : Array.isArray(obj)
            ? { Grupo: obj[0], Empleado: obj[1], Día: obj[2], Zona: obj[3] }
            : {});
    }
    const ws4 = XLSX.utils.json_to_sheet(lonely);
    autoWidth(ws4, lonely);
    styleHeader(ws4, XLSX.utils.decode_range(ws4['!ref']));
    XLSX.utils.book_append_sheet(wb, ws4, 'Solos en reunión');
    // Hoja 5: Días no preferidos
    let violated = [];
    if (Array.isArray(data?.violated_preferences)) {
      violated = data.violated_preferences.map(obj =>
        obj && typeof obj === 'object' && !Array.isArray(obj)
          ? { Empleado: obj.employee, Día_asignado: obj.day, Preferencias: obj.preferences }
          : Array.isArray(obj)
            ? { Empleado: obj[0], Día_asignado: obj[1], Preferencias: Array.isArray(obj[2]) ? obj[2].join(', ') : String(obj[2]) }
            : {});
    }
    const ws5 = XLSX.utils.json_to_sheet(violated);
    autoWidth(ws5, violated);
    styleHeader(ws5, XLSX.utils.decode_range(ws5['!ref']));
    XLSX.utils.book_append_sheet(wb, ws5, 'Días no preferidos');
    // Hoja 6: Sin uso
    let unused = [];
    if (Array.isArray(data?.unused_desks)) {
      unused = data.unused_desks.map(obj =>
        obj && typeof obj === 'object' && !Array.isArray(obj)
          ? { Escritorio: obj.desk, Día: obj.day, Observación: obj.obs }
          : Array.isArray(obj)
            ? { Escritorio: obj[0], Día: obj[1], Observación: obj[2] }
            : {});
    }
    const ws6 = XLSX.utils.json_to_sheet(unused);
    autoWidth(ws6, unused);
    styleHeader(ws6, XLSX.utils.decode_range(ws6['!ref']));
    XLSX.utils.book_append_sheet(wb, ws6, 'Sin uso');
    // Guardar archivo
    const name = `Asignaciones-${resultId}-${new Date().toISOString().slice(0,10)}.xlsx`;
    XLSX.writeFile(wb, name);
  };
  return (
    <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded" onClick={handle}>Descargar Excel</button>
  );
}
