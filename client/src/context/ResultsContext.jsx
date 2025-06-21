import { createContext, useContext, useState } from 'react';

const ResultsContext = createContext();

export function ResultsProvider({ children }) {
  const [resultId, setResultId] = useState(null);
  const [data, setData] = useState(null);
  return (
    <ResultsContext.Provider value={{ resultId, setResultId, data, setData }}>
      {children}
    </ResultsContext.Provider>
  );
}

export function useResults() {
  return useContext(ResultsContext);
}
