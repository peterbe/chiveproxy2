import { useParams } from "react-router";
import { useCard } from "../useCard";
import { CachedInfo } from "./CachedInfo";
import { Loading } from "./Loading";
import { PrettyDate } from "./PrettyDate";
import { ReloadAlert } from "./ReloadAlert";
import { useDocumentTitle } from "@/useDocumentTitle";
import { useSlowTruth } from "@/useSlowTruth";

import type { CardPicture } from "@/types";

export function Cardpage() {
  const params = useParams();
  const uri = params.uri as string;

  const { data, isPending, isLoading, error } = useCard(uri);
  const isStillPending = useSlowTruth(isPending, { delay: 500 });
  useDocumentTitle(isLoading ? "Loading..." : data?.text ? data.text : "Chiveproxy");
  return (
    <div className="cardpage">
      {isStillPending && <Loading />}
      {data && <h1>{data.text}</h1>}
      <PrettyDate date={data?.date} />
      <CachedInfo data={data?._cacheInfo} />
      {error && <ReloadAlert error={error} />}
      {data && <Grid pictures={data.pictures} />}
      {data && <List pictures={data.pictures} />}
    </div>
  );
}

function List({ pictures }: { pictures: CardPicture[] }) {
  return (
    <div className="list-pictures">
      {pictures.map((picture, i) => (
        <article key={picture.img} id={`img${i}`} style={{ marginBottom: 40 }}>
          <img src={picture.img} alt={picture.caption} style={{ width: "99%" }} />
          <p>{picture.caption}</p>
        </article>
      ))}
    </div>
  );
}

function Grid({ pictures }: { pictures: CardPicture[] }) {
  return (
    <div className="grid-pictures">
      {pictures.map((picture, i) => (
        <a
          key={picture.img}
          href={`#img${i}`}
          onClick={(e) => {
            e.preventDefault();
            const element = document.getElementById(`img${i}`);
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          <img
            src={picture.img}
            alt={picture.caption}
            style={{ maxWidth: 75, marginRight: 10, marginBottom: 10 }}
          />
        </a>
      ))}
    </div>
  );
}
