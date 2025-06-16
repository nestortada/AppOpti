// Group upload and optimize controls
import FileUploader from './FileUploader';
import OptimizeButton from './OptimizeButton';
import MinDaysInput from './MinDaysInput';
import MinAssistText from './MinAssistText';
import styles from './UI.module.css';

export default function ActionButtons({ min, setMin }) {
  return (
    <div className={styles.buttons}>
      <FileUploader />
      <OptimizeButton minDays={min} />
      <MinAssistText />
      <MinDaysInput value={min} onChange={setMin} />
    </div>
  );
}
