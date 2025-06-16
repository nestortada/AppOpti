// Component to upload a JSON file
import { useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { useFile } from '../context/FileContext';
import { FileIcon } from 'lucide-react';


export default function FileUploader() {
  const { setFileId, setLint, setSummary, setSample } = useFile();
  const [fileName, setFileName] = useState(() => localStorage.getItem('lastFileName') || '');
  const [loading, setLoading] = useState(false);

  const onChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    setLoading(true);
    try {
      const { data } = await api.post('/files', form);
      setFileId(data.id);
      setSummary(data.summary);
      setSample(data.sample);
      setLint([]);
      setFileName(file.name);
      localStorage.setItem('lastFileName', file.name);
      toast.success('Archivo cargado');
    } catch (_) {
      // error toast handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <input
        id="file-input"
        type="file"
        accept="application/json"
        onChange={onChange}
        className="sr-only"
      />
      <label
        htmlFor="file-input"
        className="w-[371px] h-[70px] flex items-center gap-6 bg-brand-uploadBtn text-black shadow-custom cursor-pointer"
        aria-label="Cargar archivo"
      >
        <div className="ml-3">
          <FileIcon className="w-10 h-10" />
        </div>
        <span className="font-inter text-base tracking-[0.5em]">Subir archivo json</span>
      </label>
    </div>
  );
}
