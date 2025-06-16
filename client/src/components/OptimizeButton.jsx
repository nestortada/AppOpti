// Button to trigger optimization
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { useFile } from '../context/FileContext';
export default function OptimizeButton({ minDays }) {
  const { fileId, lint } = useFile();
  const hasErrors = lint.some((e) => e.severity === 'error');

  const click = async () => {
    try {
      await api.post('/optimization', { file_id: fileId, min_days: Number(minDays) });
      toast.success('Optimización en cola');
    } catch (_) {}
  };

  return (
    <button
      className="w-3/5 max-w-[240px] h-12 mx-auto mt-6 flex items-center justify-center gap-2 bg-brand-mint text-white font-semibold rounded-xl transition hover:bg-brand-mint/90 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={click}
      disabled={!fileId || hasErrors}
      aria-label="Optimizar"
    >
      Optimizar
    </button>
  );
}
