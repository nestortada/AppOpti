// Shows lint result from backend
import { useEffect } from 'react';
import api from '../api/axios';
import { useFile } from '../context/FileContext';
import styles from './UI.module.css';

export default function LintPanel() {
  const { fileId, lint, setLint } = useFile();

  useEffect(() => {
    if (!fileId) return;
    api.get(`/files/${fileId}/lint`).then(({ data }) => setLint(data.errors));
  }, [fileId, setLint]);

  if (!lint.length) return null;
  return (
    <div className={`${styles.lintBox} ${styles.lint} ${styles.preview}`} role="alert">
      <h2>Lint Result</h2>
      <pre>{lint.map((e) => `${e.severity}: ${e.msg}`).join('\n')}</pre>
    </div>
  );
}
