// Component to upload a JSON file
import { useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { useFile } from '../context/FileContext';


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
    <div className="flex items-center gap-2">
      <input
        id="file-input"
        type="file"
        accept="application/json"
        onChange={onChange}
        className="sr-only"
      />
      <label
        htmlFor="file-input"
        className="w-full h-14 flex items-center justify-center gap-3 bg-brand-lightmint text-brand-blue font-semibold rounded-xl transition hover:bg-brand-lightmint/90 hover:-translate-y-[2px] hover:shadow-md cursor-pointer"
        aria-label="Cargar archivo"
      >
        Cargar archivo
      </label>
      {fileName && <span className="ml-2 text-sm">{fileName}</span>}
      {loading && (
        <span className="ml-2 inline-block w-6 h-6 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
      )}
    </div>
  );
}
