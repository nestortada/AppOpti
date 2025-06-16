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
      className="bg-[#E74C3C] text-black rounded-full shadow-lg px-8 py-2 text-xl disabled:opacity-50"
      onClick={click}
      disabled={!fileId || hasErrors}
    >
      Optimizar
    </button>
  );
}
