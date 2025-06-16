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
    <div className="relative w-[1440px] h-[1024px] bg-[#FFF9F4]">
      <h1 className="absolute w-[701px] h-[39px] left-[369px] top-[46px] font-inter font-bold text-[32px] tracking-[0.2em]">
        Gestor de Puestos &amp; Asistencias
      </h1>
      
      <div className="absolute w-[941px] h-[803px] left-[250px] top-[106px] bg-[#EBF0FF] shadow-[0px_4px_16px_rgba(0,0,1,0.25)]">
        <div className="flex flex-col items-center">
          <ActionButtons min={min} setMin={setMin} />
          
          <div className="mt-[100px] flex gap-12">
            <div className="w-[411px]">
              <h3 className="mb-4 font-fira-code font-normal text-[15px] tracking-[0.2em]">Vista previa del archivo</h3>
              <JsonPreview />
            </div>
            
            <LintPanel />
          </div>
          
          <IssuesPanel />
        </div>
      </div>
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
