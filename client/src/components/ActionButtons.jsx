// Group upload and optimize controls
import FileUploader from './FileUploader';
import OptimizeButton from './OptimizeButton';
import MinDaysInput from './MinDaysInput';
import MinAssistText from './MinAssistText';
export default function ActionButtons({ min, setMin }) {
  return (
    <div className="flex flex-col gap-4">
      <FileUploader />
      <OptimizeButton minDays={min} />
      <MinAssistText />
      <MinDaysInput value={min} onChange={setMin} />
    </div>
  );
}
