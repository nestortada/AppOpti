// Component to upload a JSON file
import { useRef } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { useFile } from '../context/FileContext';

export default function FileUploader() {
  const inputRef = useRef();
  const { setFileId, setLint, setSummary, setSample } = useFile();

  const onChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append('file', file);
    try {
      const { data } = await api.post('/files', form);
      setFileId(data.id);
      setSummary(data.summary);
      setSample(data.sample);
      setLint([]);
      toast.success('Archivo cargado');
    } catch (_) {
      // error toast handled by interceptor
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="application/json"
        onChange={onChange}
        className="hidden"
      />
      <button
        className="bg-[#2ECC71] text-black rounded-full shadow-lg px-8 py-2 text-xl"
        onClick={() => inputRef.current.click()}
      >
        Cargar archivo
      </button>
    </div>
  );
}
