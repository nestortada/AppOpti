// Component to upload a JSON file
import { useRef, useState } from 'react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { useFile } from '../context/FileContext';
import styles from './UI.module.css';

export default function FileUploader() {
  const inputRef = useRef();
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
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="application/json"
        onChange={onChange}
        className={styles.hiddenInput}
      />
      <button
        className={`${styles.btn} ${styles.btnGreen}`}
        onClick={() => inputRef.current.click()}
        aria-label="Cargar archivo"
      >
        Cargar archivo
      </button>
      {fileName && <span className={styles.fileName}>{fileName}</span>}
      {loading && <span className={styles.loader} />}
    </div>
  );
}
