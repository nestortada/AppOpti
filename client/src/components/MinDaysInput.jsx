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
    <div className="w-[151px]">
      <input
        id="min-days"
        type="text"
        value={value}
        onChange={handle}
        disabled={!fileId}
        className="w-full h-[36px] px-4 bg-brand-inputBg shadow-custom rounded-lg text-center font-inter text-[32px] tracking-[0.5em] focus:outline-none"
      />
    </div>
  );
}
