// Root component applying the folder theme and arranging UI elements
import FileUploader from './components/FileUploader';
import JsonPreview from './components/JsonPreview';
import LintAccordion from './components/LintAccordion';
import MinDaysInput from './components/MinDaysInput';
import OptimizeButton from './components/OptimizeButton';
import InconsistencyPanel from './components/InconsistencyPanel';
import MinAssistButton from './components/MinAssistButton';
import { FileProvider, useFile } from './context/FileContext';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import styles from './components/UI.module.css';

function Inner() {
  const [min, setMin] = useState('');
  const { fileId } = useFile();

  return (
    <>
      <header className={styles.header} />
      <main className={styles.main}>
        <section>
          <JsonPreview />
          <InconsistencyPanel />
          <LintAccordion />
        </section>
        <section className={styles.buttons}>
          <FileUploader />
          <OptimizeButton minDays={min} />
          <MinAssistButton />
          <MinDaysInput value={min} onChange={setMin} />
        </section>
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
