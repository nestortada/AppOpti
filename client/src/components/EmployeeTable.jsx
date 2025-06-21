export default function EmployeeTable({ assignments = [] }) {
  return (
    <div className="bg-gray-100 rounded-lg p-2 overflow-auto" aria-label="Tabla de Empleado - Escritorio - Zona">
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
    </div>
  );
}
