import { useState } from "react";
import styles from "./Transcript.module.css";

import type { CardPicture } from "@/types";

export function Transcript({ picture }: { picture: CardPicture }) {
  const [showTranscript, setShowTranscript] = useState(false);

  return (
    <div className={styles.transcript}>
      <button
        type="button"
        onClick={() => setShowTranscript(!showTranscript)}
        className="outline secondary"
      >
        {showTranscript ? "Hide Transcript" : "Show Transcript"}
      </button>
      {showTranscript && <p className={styles.transcriptText}>{picture.transcript}</p>}
    </div>
  );
}
