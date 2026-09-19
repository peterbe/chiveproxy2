import { Link } from "react-router";
import { useCards } from "./../useCards";
import { CachedInfo } from "./CachedInfo";
import styles from "./Homepage.module.css";
import { Logo } from "./Logo";
import { ReloadAlert } from "./ReloadAlert";
import { useCard } from "@/useCard";
import { useDocumentTitle } from "@/useDocumentTitle";
import { useSlowTruth } from "@/useSlowTruth";

import type { Card } from "@/types";

export function Homepage() {
  const { data, isPending, error } = useCards();
  useDocumentTitle("Chiveproxy");

  const isStillPending = useSlowTruth(isPending, { delay: 500 });

  return (
    <div className="homepage">
      {isStillPending && <p>Loading...</p>}
      {error && <ReloadAlert error={error} />}
      <Logo />
      <CachedInfo data={data?._cacheInfo} />
      {data && <List cards={data.cards} />}
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

function List({ cards }: { cards: Card[] }) {
  return (
    <div className={styles.listCards}>
      {cards.map((card, i) => {
        return (
          <article key={card.id}>
            {i < 5 && <PreloadCard uri={card.uri} />}
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
