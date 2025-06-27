export default function EmployeeTable({ assignments = [] }) {
  return (
    <div className="bg-gray-100 rounded-lg p-2 overflow-y-auto" style={{ maxHeight: '28rem' }} aria-label="Tabla de Empleado - Escritorio - Zona">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left">
            <th className="p-2">Empleado</th>
            <th className="p-2">Escritorio</th>
            <th className="p-2">Zona</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((a, idx) => (
            <tr key={idx} className="border-t">
              <td className="p-2" title={a.employee}>{a.employee}</td>
              <td className="p-2">{a.desk}</td>
              <td className="p-2">{a.zone || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {assignments.length > 9 && (
        <div className="text-xs text-center text-gray-500 mt-2">Mostrando 9 de {assignments.length} empleados. Usa scroll para ver más.</div>
      )}
    </div>
  );
}
