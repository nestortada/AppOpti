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
    <div className="mt-6 p-4 bg-[#FFEEDB] border-2 border-dashed border-orange-400 overflow-auto rounded-lg" role="alert">
      <h2 className="text-lg font-medium text-brand-blue mt-6 mb-2 first:mt-0">Lint Result</h2>
      <pre className="font-mono text-sm whitespace-pre">{lint.map((e) => `${e.severity}: ${e.msg}`).join('\n')}</pre>
    </div>
  );
}
