// Button to trigger optimization
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { useFile } from '../context/FileContext';
import styles from './UI.module.css';

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
      className={`${styles.btn} ${styles.btnRed}`}
      onClick={click}
      disabled={!fileId || hasErrors}
      aria-label="Optimizar"
    >
      Optimizar
    </button>
  );
}
