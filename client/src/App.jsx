// Root component applying the folder theme and arranging UI elements
import JsonPreview from './components/JsonPreview';
import LintPanel from './components/LintPanel';
import ActionButtons from './components/ActionButtons';
import IssuesPanel from './components/IssuesPanel';
import { FileProvider } from './context/FileContext';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';
function Inner() {
  const [min, setMin] = useState('');

  return (
    <div className="container">
      <h1 className="text-3xl font-semibold text-center mb-8">Gestor de Puestos &amp; Asistencias</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <JsonPreview />
        <LintPanel />
      </div>
      <ActionButtons min={min} setMin={setMin} />
      <IssuesPanel />
    </div>
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
