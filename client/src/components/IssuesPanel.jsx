// Shows data issues from sample
import checkJsonConsistency from '../utils/checkJsonConsistency';
import { useFile } from '../context/FileContext';
import styles from './UI.module.css';

export default function IssuesPanel() {
  const { sample } = useFile();
  const issues = checkJsonConsistency(sample);

  if (!issues.length) return null;

  return (
    <div className={styles.previewBox} role="alert">
      <h2>Inconsistencias</h2>
      <ul>
        {issues.map((i, idx) => (
          <li key={idx}>{i}</li>
        ))}
      </ul>
    </div>
  );
}
