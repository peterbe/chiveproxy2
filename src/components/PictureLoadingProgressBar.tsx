import styles from "./PictureLoadingProgressBar.module.css";
import { useTimedout } from "./useTimedout";

export function PictureLoadingProgressBar({
  percent,
  failed,
  onClose,
}: {
  percent: number;
  failed: number;
  onClose: () => void;
}) {
  const timedOut = useTimedout(1000);

  return (
    <div className={styles.pictureLoadingProgressBar}>
      <progress value={percent} max="100" />

      {failed > 0 && <p className={styles.failed}>{failed} failed</p>}

      <div className={styles.closeButtonWrapper}>
        {!timedOut && (
          <button onClick={onClose} type="button" className="outline secondary">
            Close
          </button>
        )}
      </div>
    </div>
  );
}
