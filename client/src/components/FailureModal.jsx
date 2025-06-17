import { useState } from 'react';

export default function FailureModal({ error, onRetry }) {
  const [val, setVal] = useState('');
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-red-100 p-6 rounded-lg text-center">
        <h2 className="text-xl font-bold mb-2">No se encontró solución</h2>
        <p className="mb-2">{error}</p>
        <input className="border px-2 py-1" value={val} onChange={(e)=>setVal(e.target.value)} placeholder="Nuevo mínimo" />
        <div className="mt-4 flex justify-center gap-4">
          <button className="px-4 py-2 bg-gray-300" onClick={onRetry}>Regresar</button>
          <button className="px-4 py-2 bg-blue-500 text-white" onClick={()=>onRetry(val)}>Reintentar</button>
        </div>
      </div>
    </div>
  );
}
