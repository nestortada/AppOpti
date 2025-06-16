import checkJsonConsistency from '../utils/checkJsonConsistency';
import { useFile } from '../context/FileContext';
import styles from './UI.module.css';

export default function InconsistencyPanel() {
  const { sample } = useFile();
  const issues = checkJsonConsistency(sample);

  if (!issues.length) return null;

  return (
    <div className={styles.previewBox} aria-label="panel-inconsistencias">
      <h2>Inconsistencias</h2>
      <ul>
        {issues.map((i, idx) => (
          <li key={idx}>{i}</li>
        ))}
      </ul>
    </div>
  );
}
