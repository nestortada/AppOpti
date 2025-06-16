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
      type="text"
      placeholder="Minimo de Asistencias"
      value={value}
      onChange={handle}
      disabled={!fileId}
      className="bg-[#FFFDFD] rounded-full shadow px-4 py-2 text-center text-xl placeholder-[#B9B9B9]"
    />
  );
}
