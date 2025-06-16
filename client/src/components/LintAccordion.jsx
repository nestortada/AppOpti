// Accordion listing lint messages
import { useEffect } from 'react';
import api from '../api/axios';
import { useFile } from '../context/FileContext';

export default function LintAccordion() {
  const { fileId, lint, setLint } = useFile();

  useEffect(() => {
    if (!fileId) return;
    api.get(`/files/${fileId}/lint`).then(({ data }) => setLint(data.errors));
  }, [fileId, setLint]);

  if (!lint.length) return null;
  return (
    <details className="mt-4">
      <summary>Lint Result</summary>
      <ul>
        {lint.map((e, idx) => (
          <li key={idx}>{e.severity}: {e.msg}</li>
        ))}
      </ul>
    </details>
  );
}
