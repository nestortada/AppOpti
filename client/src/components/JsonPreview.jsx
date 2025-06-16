// Display uploaded JSON summary and sample
import { useFile } from '../context/FileContext';
import styles from './UI.module.css';

export default function JsonPreview() {
  const { summary, sample } = useFile();

  if (!summary) return null;
  const lines = JSON.stringify({ summary, sample }, null, 2).split('\n');
  const preview = lines.slice(0, 40).join('\n') + (lines.length > 40 ? '\u2026' : '');

  return (
    <div>
      <h2>Preview Archivo Json</h2>
      <div className={styles.previewBox}>
        <pre>{preview}</pre>
      </div>
    </div>
  );
}
