// Shows data issues from sample
import checkJsonConsistency from '../utils/checkJsonConsistency';
import { useFile } from '../context/FileContext';
export default function IssuesPanel() {
  const { sample } = useFile();
  const issues = checkJsonConsistency(sample);

  if (!issues.length) return null;

  return (
    <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-md text-red-800" role="alert">
      <h2 className="font-medium mb-2">Inconsistencias</h2>
      <ul className="list-disc pl-5 space-y-1 text-sm">
        {issues.map((i, idx) => (
          <li key={idx}>{i}</li>
        ))}
      </ul>
    </div>
  );
}
