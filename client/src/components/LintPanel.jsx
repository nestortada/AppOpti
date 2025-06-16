// Shows lint result from backend
import { useEffect } from 'react';
import api from '../api/axios';
import { useFile } from '../context/FileContext';

export default function LintPanel() {
  const { fileId, lint, setLint } = useFile();

  useEffect(() => {
    if (!fileId) return;
    api.get(`/files/${fileId}/lint`).then(({ data }) => setLint(data.errors));
  }, [fileId, setLint]);

  if (!lint.length) return null;

  return (
    <pre className="bg-gray-900 text-green-300 overflow-y-auto max-h-96 p-4 rounded-lg text-sm" aria-label="Lint results">
      <code className="whitespace-pre">
        {lint.map((e, i) => `${i + 1} ${e.severity}: ${e.msg}`).join('\n')}
      </code>
    </pre>
  );
}
