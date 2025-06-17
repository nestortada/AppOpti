// Root component applying the folder theme and arranging UI elements
import JsonPreview from './components/JsonPreview';
import LintPanel from './components/LintPanel';
import ActionButtons from './components/ActionButtons';
import IssuesPanel from './components/IssuesPanel';
import { FileProvider } from './context/FileContext';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import JobMonitor from './components/JobMonitor';
import api from './api/axios';

function Inner() {
  const [min, setMin] = useState('1');
  const [jobId, setJobId] = useState(() => localStorage.getItem('job_id'));

  const startJob = async (fileId, m) => {
    try {
      const { data } = await api.post('/optimization', { file_id: fileId, min_days: m });
      setJobId(data.job_id);
      localStorage.setItem('job_id', data.job_id);
    } catch (_) {}
  };

  const finishJob = (newMin) => {
    localStorage.removeItem('job_id');
    setJobId(null);
    if (newMin) setMin(String(newMin));
  };

  return (
    <main className="min-h-screen bg-[#FFF9F4] flex flex-col">
      <header className="py-6">
        <h1 className="text-3xl font-bold text-center tracking-widest">Gestor de Puestos &amp; Asistencias</h1>
      </header>

      <section className="flex-grow bg-[#EBF0FF] shadow-custom max-w-3xl mx-auto px-4 py-8 flex flex-col">
        <ActionButtons min={min} setMin={setMin} onStart={startJob} />

        <div className="mt-10 grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="mb-2 font-fira-code text-sm tracking-widest">Vista previa del archivo</h3>
            <JsonPreview />
          </div>

          <LintPanel />
        </div>

        <IssuesPanel />
        {jobId && <JobMonitor jobId={jobId} onFinish={finishJob} />}
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
