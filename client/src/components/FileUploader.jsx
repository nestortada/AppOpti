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
    
    // Validar que sea un archivo JSON
    if (!file.name.toLowerCase().endsWith('.json')) {
      toast.error('Por favor, sube un archivo JSON');
      return;
    }

    const form = new FormData();
    form.append('file', file);
    setLoading(true);
    
    try {
      const { data } = await api.post('/files', form);
      
      if (!data) {
        throw new Error('No se recibieron datos del servidor');
      }

      setFileId(data.id);
      setSummary(data.summary || null);
      setSample(data.sample || null);
      setLint([]);
      setFileName(file.name);
      localStorage.setItem('lastFileName', file.name);
      toast.success('Archivo cargado correctamente');
    } catch (error) {
      console.error('Error al cargar el archivo:', error);
      toast.error(error.response?.data?.detail || 'Error al cargar el archivo');
      // Limpiar los datos en caso de error
      setFileId(null);
      setSummary(null);
      setSample(null);
      setLint([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        id="file-input"
        type="file"
        accept="application/json"
        onChange={onChange}
        className="sr-only"
        disabled={loading}
      />
      <label
        htmlFor="file-input"
        className={`w-full h-14 flex items-center justify-center gap-3 ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-brand-uploadBtn cursor-pointer'
        } text-black shadow-custom`}
        aria-label="Cargar archivo"
      >
        <FileIcon className="w-6 h-6" />
        {loading ? 'Cargando...' :  'Cargar archivo'}
      </label>
    </div>
  );
}
