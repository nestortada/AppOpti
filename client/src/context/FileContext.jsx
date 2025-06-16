// React context to share uploaded file information
import { createContext, useState, useContext } from 'react';

const FileContext = createContext();

export function FileProvider({ children }) {
  const [fileId, setFileId] = useState(null);
  const [summary, setSummary] = useState(null);
  const [sample, setSample] = useState(null);
  const [lint, setLint] = useState([]);

  return (
    <FileContext.Provider value={{ fileId, setFileId, summary, setSummary, sample, setSample, lint, setLint }}>
      {children}
    </FileContext.Provider>
  );
}

export function useFile() {
  return useContext(FileContext);
}
