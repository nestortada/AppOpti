// Display uploaded JSON summary and sample
import { useFile } from '../context/FileContext';

export default function JsonPreview() {
  const { summary, sample } = useFile();

  if (!summary) return null;
  return (
    <div className="bg-[#D9D9D9] p-4 mt-4 rounded">
      <h2 className="text-2xl mb-2">Preview Archivo Json</h2>
      <pre className="text-sm">{JSON.stringify({ summary, sample }, null, 2)}</pre>
    </div>
  );
}
