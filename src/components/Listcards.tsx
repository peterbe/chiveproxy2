import { Link } from "react-router";
import styles from "./Listcards.module.css";
import { useImagePreloader } from "./useImagePreloader";
import { useCard } from "@/useCard";

import type { Card } from "@/types";

export function Listcards({ cards, preloadCards = 0 }: { cards: Card[]; preloadCards?: number }) {
  return (
    <div className={styles.listCards}>
      {cards.map((card, i) => {
        return (
          <article key={card.id}>
            {preloadCards && i < preloadCards && <PreloadCard uri={card.uri} />}
            <h2>
              <Link to={`/${card.uri}`} viewTransition>
                {card.text}
              </Link>
            </h2>
            {card.count_pictures && <small>({card.count_pictures} pictures)</small>}

            <Link to={`/${card.uri}`} viewTransition>
              <img src={card.img} alt={card.text} />
            </Link>
            <p>{card.human_time}</p>
          </article>
        );
      })}
    </div>
  );
}

function PreloadCard({ uri }: { uri: number }) {
  const { data, isError } = useCard(uri);
  if (data) {
    // console.log("Preloaded", uri);
    const pictureUrls = data.pictures.filter((p) => !p.mp4src).map((picture) => picture.img);
    return <PreloadPictureUrls urls={pictureUrls} />;
  } else if (isError) {
    console.log("Preload failed", uri);
  }
  return null;
}

function PreloadPictureUrls({ urls }: { urls: string[] }) {
  const { failed, total, done } = useImagePreloader(urls);
  if (failed) {
    console.warn(`Failed ${failed} images to preload`, urls);
  } else if (done) {
    console.log(`Successfully preloaded ${total} images`);
  }
  return null;
}
