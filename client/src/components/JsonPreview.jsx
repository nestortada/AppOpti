// Display uploaded JSON summary and sample
import { useFile } from '../context/FileContext';

export default function JsonPreview() {
  const { summary, sample } = useFile();

  if (!summary) return null;
  const lines = JSON.stringify({ summary, sample }, null, 2).split('\n');
  const preview = lines.slice(0, 10).join('\n') + (lines.length > 10 ? '\u2026' : '');

  return (
    <div className="w-[411px] h-[385px] bg-brand-preview rounded-lg relative overflow-hidden">
      <div className="w-[68.5px] h-full bg-brand-lineNumbers rounded-l-lg absolute left-0 top-0 font-fira-code font-bold text-[14px] text-white">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="h-[35px] flex items-center justify-center tracking-[0.2em]">
            {i + 1}
          </div>
        ))}
      </div>
      <pre className="pl-[80px] pt-4 text-white font-fira-code text-sm">
        <code className="block whitespace-pre">{preview}</code>
      </pre>
    </div>
  );
}
