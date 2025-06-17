// Display uploaded JSON summary and sample
import { useFile } from '../context/FileContext';

export default function JsonPreview() {
  const { summary, sample } = useFile();

  if (!summary && !sample) {
    return (
      <div className="bg-gray-900 text-gray-400 p-4 rounded-lg text-sm text-center">
        No hay archivo cargado. Por favor, sube un archivo JSON.
      </div>
    );
  }

  const data = { summary, sample };
  const lines = JSON.stringify(data, null, 2).split('\n');
  const limited = lines.slice(0, 50);
  const preview = limited
    .map((l, i) => `${String(i + 1).padStart(2, ' ')}  ${l}`)
    .join('\n');
  const ellipsis = lines.length > 50 ? '\n…' : '';

  return (
    <pre className="bg-gray-900 text-green-300 overflow-y-auto max-h-96 p-4 rounded-lg text-sm" aria-label="JSON preview">
      <code className="whitespace-pre">{preview + ellipsis}</code>
    </pre>
  );
}
