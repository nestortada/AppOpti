export default function SuccessModal({ kpis, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-green-100 p-6 rounded-lg text-center">
        <h2 className="text-xl font-bold mb-2">¡Optimización exitosa!</h2>
        <p>Score: {kpis?.score?.toFixed(2)}</p>
        <p>% dias no preferidos: {(kpis?.non_preferred_pct * 100).toFixed(0)}%</p>
        <p>% empleados asignados: {(kpis?.assigned_pct * 100).toFixed(0)}%</p>
        <p>% empleados en zonas solos {(kpis.solo_pct*100).toFixed(0)}%</p>
        <button className="mt-4 px-4 py-2 bg-green-500 text-white" onClick={onClose}>Ver resultados</button>
      </div>
    </div>
  );
}
