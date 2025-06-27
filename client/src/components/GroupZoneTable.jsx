export default function GroupZoneTable({ groupZones = [] }) {
  return (
    <div className="bg-gray-100 rounded-lg p-2 overflow-auto" aria-label="Tabla de Grupos por Zona">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left">
            <th className="p-2">Grupo</th>
            <th className="p-2">Zona(s)</th>
            <th className="p-2">Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {groupZones.map((row, idx) => (
            <tr key={row.group + row.day} className="border-t" style={{ backgroundColor: idx % 2 ? '#D2D0E5' : '#E3E3E3' }}>
              <td className="p-2">{row.group}</td>
              <td className="p-2">{row.zones}</td>
              <td className="p-2">{row.cantidad}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
