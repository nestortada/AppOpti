// Hook to manage JSON file data and lint
import { useState } from 'react';
import api from '../api/axios';
import checkJsonConsistency from '../utils/checkJsonConsistency';

export default function useJsonFile() {
  const [jsonData, setJsonData] = useState(null);
  const [issues, setIssues] = useState([]);
  const [lintResult, setLintResult] = useState('');

  // Parse file and collect issues
  const handleSelectFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        setJsonData(data);
        setIssues(checkJsonConsistency(data));
      } catch {
        setIssues(['JSON inválido']);
      }
    };
    reader.readAsText(file);
  };

  // Upload and get lint text
  const handleUpload = async () => {
    if (!jsonData) return;
    try {
      const { data } = await api.post('/lint', jsonData);
      setLintResult(data.text);
    } catch {
      /* ignored */
    }
  };

  return { jsonData, issues, lintResult, handleSelectFile, handleUpload };
}
