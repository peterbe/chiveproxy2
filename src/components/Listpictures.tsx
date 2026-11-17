import { useState } from "react";
import { Link } from "react-router";
import styles from "./Cardpage.module.css";
import { PrettyPicture } from "./PrettyPicture";
import { PrettyVideo } from "./PrettyVideo";
import { useIsSafari } from "@/hooks/useIsSafari";

import type { CardPicture, PictureSearch } from "@/types";

export function Listpictures({
  uri,
  pictures,
}: {
  uri: string;
  pictures: (CardPicture | PictureSearch)[];
}) {
  const [forceVideoTag, setForceVideoTag] = useState(false);
  const isSafari = useIsSafari();

  const hasSafariVideo = isSafari && pictures.filter((picture) => picture.mp4src).length > 2;

  return (
    <div className={styles.listPictures}>
      {pictures.map((picture, i) => {
        const thisUri = "card" in picture ? picture.card.id : uri;
        return (
          <article key={picture.img} id={`img${i}`}>
            {picture.id && (
              <Link to={`/${thisUri}/${picture.id}`}>
                {picture.mp4src ? (
                  isSafari && !forceVideoTag ? (
                    <PrettyPicture src={picture.mp4src} alt={picture.caption} />
                  ) : (
                    <PrettyVideo src={picture.mp4src} />
                  )
                ) : (
                  <PrettyPicture src={picture.img} alt={picture.caption} />
                )}
              </Link>
            )}

            {/* Legacy and old cached data */}
            {!picture.id && (
              <>
                {picture.mp4src ? (
                  isSafari && !forceVideoTag ? (
                    <PrettyPicture src={picture.mp4src} alt={picture.caption} />
                  ) : (
                    <PrettyVideo src={picture.mp4src} />
                  )
                ) : (
                  <PrettyPicture src={picture.img} alt={picture.caption} />
                )}
              </>
            )}

            {picture.transcript && <Transcript picture={picture} />}

            <p>{picture.caption}</p>
          </article>
        );
      })}

      {hasSafariVideo && !forceVideoTag && (
        <button type="button" onClick={() => setForceVideoTag(true)}>
          Force Video Tag
        </button>
      )}
    </div>
  );
}

function Transcript({ picture }: { picture: CardPicture }) {
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
