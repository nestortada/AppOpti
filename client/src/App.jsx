// Root component applying the folder theme and arranging UI elements
import JsonPreview from './components/JsonPreview';
import LintPanel from './components/LintPanel';
import ActionButtons from './components/ActionButtons';
import IssuesPanel from './components/IssuesPanel';
import { FileProvider } from './context/FileContext';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import styles from './components/UI.module.css';

function Inner() {
  const [min, setMin] = useState('');

  return (
    <>
      <header className={styles.header} />
      <main className={styles.main}>
        <div className={styles.grid}>
          <JsonPreview />
          <LintPanel />
        </div>
        <ActionButtons min={min} setMin={setMin} />
        <IssuesPanel />
      </main>
    </>
  );
}

export default function App() {
  return (
    <FileProvider>
      <Inner />
      <Toaster />
    </FileProvider>
  );
}
