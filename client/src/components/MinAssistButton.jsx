import styles from './UI.module.css';

export default function MinAssistButton() {
  return (
    <button className={`${styles.btn} ${styles.btnGrey}`} disabled aria-label="minimo-asistencias">
      Mínimo de Asistencias
    </button>
  );
}
