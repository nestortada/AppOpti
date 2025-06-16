// Root component applying the folder theme and arranging UI elements
import JsonPreview from './components/JsonPreview';
import LintPanel from './components/LintPanel';
import ActionButtons from './components/ActionButtons';
import IssuesPanel from './components/IssuesPanel';
import { FileProvider } from './context/FileContext';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';

function Inner() {
  const [min, setMin] = useState('3');

  return (
    <main className="min-h-screen bg-[#FFF9F4] flex flex-col">
      <header className="py-6">
        <h1 className="text-3xl font-bold text-center tracking-widest">Gestor de Puestos &amp; Asistencias</h1>
      </header>

      <section className="flex-grow bg-[#EBF0FF] shadow-custom max-w-3xl mx-auto px-4 py-8 flex flex-col">
        <ActionButtons min={min} setMin={setMin} />

        <div className="mt-10 grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="mb-2 font-fira-code text-sm tracking-widest">Vista previa del archivo</h3>
            <JsonPreview />
          </div>

          <LintPanel />
        </div>

        <IssuesPanel />
      </section>
    </main>
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
