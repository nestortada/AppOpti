// Group upload and optimize controls
import FileUploader from './FileUploader';
import OptimizeButton from './OptimizeButton';
import MinDaysInput from './MinDaysInput';
import MinAssistText from './MinAssistText';

export default function ActionButtons({ min, setMin }) {
  return (
    <div className="flex flex-col items-center gap-16">
      <FileUploader />
      <div className="flex items-center gap-4">
        <MinAssistText />
        <MinDaysInput value={min} onChange={setMin} />
      </div>
      <OptimizeButton minDays={min} />
    </div>
  );
}
