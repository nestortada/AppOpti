// Numeric input for minimum days
import { useFile } from '../context/FileContext';

export default function MinDaysInput({ value, onChange }) {
  const { fileId } = useFile();
  const regex = /^[1-9]\d{0,2}$/;

  const handle = (e) => {
    const v = e.target.value;
    if (v === '' || regex.test(v)) onChange(v);
  };

  return (
    <input
      id="min-days"
      type="text"
      placeholder="Minimo de Asistencias"
      value={value}
      onChange={handle}
      disabled={!fileId}
      className="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-mint placeholder:text-gray-400"
    />
  );
}
