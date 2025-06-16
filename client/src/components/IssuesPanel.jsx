// Shows data issues from sample
import checkJsonConsistency from '../utils/checkJsonConsistency';
import { useFile } from '../context/FileContext';
export default function IssuesPanel() {
  const { sample } = useFile();
  const issues = checkJsonConsistency(sample);

  if (!issues.length) return null;

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg" role="alert">
      <h2 className="text-lg font-medium text-brand-blue mt-6 mb-2 first:mt-0">Inconsistencias</h2>
      <ul className="list-disc pl-5">
        {issues.map((i, idx) => (
          <li key={idx}>{i}</li>
        ))}
      </ul>
    </div>
  );
}
