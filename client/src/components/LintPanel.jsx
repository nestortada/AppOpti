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
    <div className="w-[411px] h-[385px] bg-brand-preview rounded-lg relative overflow-hidden">
      <div className="w-[68.5px] h-full bg-brand-lineNumbers rounded-l-lg absolute left-0 top-0 font-fira-code font-bold text-[14px] text-white">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="h-[35px] flex items-center justify-center tracking-[0.2em]">
            {i + 1}
          </div>
        ))}
      </div>
      <div className="pl-[80px] pt-4">
        <h2 className="text-white font-fira-code text-sm mb-2">Lint Results</h2>
        <pre className="text-white font-fira-code text-sm whitespace-pre">
          {lint.map((e, i) => `${e.severity}: ${e.msg}`).join('\n')}
        </pre>
      </div>
    </div>
  );
}
