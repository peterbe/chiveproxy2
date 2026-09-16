import { Link } from "react-router";
import { useCards } from "./../useCards";
import { ReloadAlert } from "./ReloadAlert";
import { useCard } from "@/useCard";
import { useDocumentTitle } from "@/useDocumentTitle";
import { useSlowTruth } from "@/useSlowTruth";

export function Homepage() {
  const { data, isPending, error } = useCards();
  useDocumentTitle("Chiveproxy");

  const isStillPending = useSlowTruth(isPending, { delay: 500 });

  return (
    <div className="homepage">
      {isStillPending && <p>Loading...</p>}
      {error && <ReloadAlert error={error} />}
      {data && (
        <div>
          {data.cards.map((card, i) => {
            return (
              <article key={card.id} style={{ marginBottom: 60 }}>
                {i < 5 && <PreloadCard uri={card.uri} />}
                <h2>
                  <Link to={`/${card.uri}`}>{card.text}</Link>
                </h2>
                {card.count_pictures && <small>({card.count_pictures} pictures)</small>}

                <Link to={`/${card.uri}`}>
                  <img src={card.img} alt={card.text} style={{ width: "99%" }} />
                </Link>
                <p>{card.human_time}</p>
              </article>
            );
          })}
        </div>
      )}
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
