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
      className="w-24 sm:w-32 px-3 py-1 bg-brand-inputBg shadow-custom rounded-lg text-center font-inter text-xl tracking-[0.5em] focus:outline-none"
    />
  );
}
