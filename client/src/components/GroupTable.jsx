export default function GroupTable({ assignments = [] }) {
  const groups = {};
  for (const a of assignments) {
    const g = a.group || 'N/A';
    const z = a.zone || '-';
    if (!groups[g]) groups[g] = {};
    groups[g][z] = (groups[g][z] || 0) + 1;
  }
  return (
    <div className="bg-gray-100 rounded-lg p-2 overflow-auto" aria-label="Tabla de Grupo - Zona">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left">
            <th className="p-2">Grupo</th>
            <th className="p-2">Zona</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groups).map(([g, zones]) => (
            Object.keys(zones).map((z, idx) => (
              <tr key={g+z+idx} className="border-t" style={{ backgroundColor: idx % 2 ? '#D2D0E5' : '#E3E3E3' }}>
                <td className="p-2">{g}</td>
                <td className="p-2">{z}</td>
              </tr>
            ))
          ))}
        </tbody>
      </table>
    </div>
  );
}
