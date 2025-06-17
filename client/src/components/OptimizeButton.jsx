// Button to trigger optimization
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { useFile } from '../context/FileContext';
import { Settings } from 'lucide-react';

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
      className="flex items-center justify-center gap-2 bg-brand-optimizeBtn text-brand-blue w-full max-w-xs py-4 rounded-lg shadow-custom disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={click}
      disabled={!fileId || hasErrors}
      aria-label="Optimizar"
    >
      <Settings className="w-6 h-6" />
      <span className="tracking-widest font-medium">Optimizar</span>
    </button>
  );
}
