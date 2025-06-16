// Root component applying the folder theme and arranging UI elements
import FileUploader from './components/FileUploader';
import JsonPreview from './components/JsonPreview';
import LintAccordion from './components/LintAccordion';
import MinDaysInput from './components/MinDaysInput';
import OptimizeButton from './components/OptimizeButton';
import { FileProvider, useFile } from './context/FileContext';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';

function Inner() {
  const [min, setMin] = useState('');
  const { fileId } = useFile();

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-[40px] mt-[25px] font-normal">Optimización de Puestsos</h1>
      <div className="flex flex-col items-center mt-10 space-y-4">
        <FileUploader />
        <OptimizeButton minDays={min} />
        <MinDaysInput value={min} onChange={setMin} />
      </div>
      <JsonPreview />
      <LintAccordion />
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
