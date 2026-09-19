import { Link } from "react-router";
import styles from "./Listcards.module.css";
import { useCard } from "@/useCard";

import type { Card } from "@/types";

export function Listcards({ cards, preload = false }: { cards: Card[]; preload?: boolean }) {
  return (
    <div className={styles.listCards}>
      {cards.map((card, i) => {
        return (
          <article key={card.id}>
            {preload && i < 5 && <PreloadCard uri={card.uri} />}
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
  } else if (isError) {
    console.log("Preload failed", uri);
  }
  return null;
}
