import { useState } from "react";
import { useTimeout } from "usehooks-ts";
import styles from "./PictureLoadingProgressBar.module.css";

export function PictureLoadingProgressBar({
  percent,
  failed,
  onClose,
}: {
  percent: number;
  failed: number;
  onClose: () => void;
}) {
  const [hideCloseButton, setHideCloseButton] = useState(true);

  const hide = () => {
    setHideCloseButton(false);
  };

  useTimeout(hide, 3000);

  return (
    <div className={styles.pictureLoadingProgressBar}>
      <progress value={percent} max="100" />

      {failed > 0 && <p className={styles.failed}>{failed} failed</p>}

      <div className={styles.closeButtonWrapper}>
        {!hideCloseButton && (
          <button onClick={onClose} type="button" className="outline secondary">
            Close
          </button>
        )}
      </div>
    </div>
  );
}
