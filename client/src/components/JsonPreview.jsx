// Display uploaded JSON summary and sample
import { useFile } from '../context/FileContext';

export default function JsonPreview() {
  const { summary, sample } = useFile();

  if (!summary) return null;
  const lines = JSON.stringify({ summary, sample }, null, 2).split('\n');
  const limited = lines.slice(0, 20);
  const preview = limited
    .map((l, i) => `${String(i + 1).padStart(2, ' ')}  ${l}`)
    .join('\n');
  const ellipsis = lines.length > 20 ? '\n…' : '';

  return (
    <pre className="bg-gray-900 text-green-300 overflow-y-auto max-h-96 p-4 rounded-lg text-sm" aria-label="JSON preview">
      <code className="whitespace-pre">{preview + ellipsis}</code>
    </pre>
  );
}
