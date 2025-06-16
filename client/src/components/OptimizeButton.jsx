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
    <div className="relative">
      <button
        className="w-[263px] h-[70px] flex items-center gap-4 bg-brand-optimizeBtn shadow-custom disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={click}
        disabled={!fileId || hasErrors}
        aria-label="Optimizar"
      >
        <div className="ml-3">
          <Settings className="w-12 h-12" />
        </div>
        <span className="font-inter text-base tracking-[0.5em]">Optimizar</span>
      </button>
    </div>
  );
}
