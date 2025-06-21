import * as XLSX from 'xlsx';
import { useResults } from '../context/ResultsContext';

export default function DownloadExcel({ assignments = [] }) {
  const { resultId } = useResults();
  const handle = () => {
    const wb = XLSX.utils.book_new();
    const ws1 = XLSX.utils.json_to_sheet(assignments.map(a => ({
      Empleado: a.employee,
      Escritorio: a.desk,
      Dia: a.day,
      Grupo: a.group || '',
      Zona: a.zone || ''
    })));
    XLSX.utils.book_append_sheet(wb, ws1, 'Empleados');
    const ws2 = XLSX.utils.json_to_sheet(assignments.map(a => ({
      Grupo: a.group || '',
      Zona: a.zone || '',
      Empleado: a.employee,
      Dia: a.day
    })));
    XLSX.utils.book_append_sheet(wb, ws2, 'Grupos');
    const name = `Asignaciones-${resultId}-${new Date().toISOString().slice(0,10)}.xlsx`;
    XLSX.writeFile(wb, name);
  };
  return (
    <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded" onClick={handle}>Descargar Excel</button>
  );
}
