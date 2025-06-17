import { useEffect, useState } from 'react';
import api from '../api/axios';
import SuccessModal from './SuccessModal';
import FailureModal from './FailureModal';

const MESSAGES = [
  'Calculando asignaciones…',
  'Ajustando preferencias…',
  'Resolviendo restricciones…'
];

export default function JobMonitor({ jobId, onFinish }) {
  const [state, setState] = useState('queued');
  const [msgIdx, setMsgIdx] = useState(0);
  const [kpis, setKpis] = useState(null);

  useEffect(() => {
    if (!jobId) return;
    const poll = setInterval(async () => {
      try {
        const { data } = await api.get(`/optimization/${jobId}/status`);
        setState(data.state);
        if (data.state === 'success') {
          setKpis({ score: data.score, non_preferred_pct: data.non_preferred_pct, assigned_pct: data.assigned_pct , solo_pct: data.solo_pct });
          clearInterval(poll);
        }
        if (data.state === 'failure') {
          setKpis({ error: data.error });
          clearInterval(poll);
        }
      } catch (error) {
        if (error.response?.status === 404) {
          // Job not found, treat as failure
          setState('failure');
          setKpis({ error: 'Proceso de optimización no encontrado. Por favor intente de nuevo.' });
          clearInterval(poll);
        }
      }
    }, 3000);
    return () => clearInterval(poll);
  }, [jobId]);

  useEffect(() => {
    if (!jobId) return;
    const rot = setInterval(() => setMsgIdx((m) => (m + 1) % MESSAGES.length), 4000);
    return () => clearInterval(rot);
  }, [jobId]);

  if (!jobId || state === 'success' || state === 'failure') {
    if (state === 'success') return <SuccessModal kpis={kpis} onClose={onFinish} />;
    if (state === 'failure') return <FailureModal error={kpis?.error} onRetry={onFinish} />;
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg flex flex-col items-center gap-4">
        <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <p>{MESSAGES[msgIdx]}</p>
      </div>
    </div>
  );
}
