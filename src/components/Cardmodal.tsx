import { useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import styles from "./Cardmodal.module.css";
import { PrettyPicture } from "./PrettyPicture";
import { PrettyVideo } from "./PrettyVideo";
import { Transcript } from "./Transcript";

import type { CardPicture } from "@/types";

export function Cardmodal({ uri, picture }: { uri: string; picture: CardPicture }) {
  const navigate = useNavigate();
  const onClose = useCallback(() => {
    void navigate(`/${uri}`, { replace: true });
  }, [navigate, uri]);

  useEffect(() => {
    const close = (e: { key: string }) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [onClose]);

  return (
    <dialog open>
      <article className={styles.modalArticle}>
        <header>
          <div className={styles.modalHeader}>
            <div>
              <Link
                to={`/${uri}/${picture.id}`}
                role="button"
                onClick={async (event) => {
                  event.preventDefault();
                  try {
                    await navigator.share({ url: window.location.href });
                  } catch (error) {
                    console.warn("Error sharing:", error);
                  }
                }}
              >
                Share
              </Link>
            </div>

            <div style={{ textAlign: "right" }}>
              <Link to={`/${uri}`} role="button" replace>
                Close
              </Link>
            </div>
          </div>
        </header>

        {picture.mp4src ? (
          <PrettyVideo src={picture.mp4src} />
        ) : (
          <PrettyPicture src={picture.img} alt={picture.caption} />
        )}

        {picture.transcript && <Transcript picture={picture} />}

        <p>{picture.caption}</p>
      </article>
    </dialog>
  );
}
