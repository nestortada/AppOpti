// Display uploaded JSON summary and sample
import { useFile } from '../context/FileContext';
export default function JsonPreview() {
  const { summary, sample } = useFile();

  if (!summary) return null;
  const lines = JSON.stringify({ summary, sample }, null, 2).split('\n');
  const preview = lines.slice(0, 40).join('\n') + (lines.length > 40 ? '\u2026' : '');

  return (
    <div>
      <h2 className="text-lg font-medium text-brand-blue mt-6 mb-2">Preview Archivo Json</h2>
      <pre className="h-[220px] overflow-auto rounded-xl bg-gradient-to-b from-[#162338] to-[#0f1b2c] text-[#c9d1e9] font-mono text-sm relative before:absolute before:left-0 before:top-0 before:h-full before:w-12 before:bg-black/10 before:content-['']"><code className="block whitespace-pre">{preview}</code></pre>
    </div>
  );
}
