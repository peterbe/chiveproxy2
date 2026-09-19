import { useParams } from "react-router";
import { Card404, useCard } from "../useCard";
import { CachedInfo } from "./CachedInfo";
import styles from "./Cardpage.module.css";
import { Custom404 } from "./Errorpage";
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
  console.log(data);
  const isStillPending = useSlowTruth(isPending, { delay: 500 });
  useDocumentTitle(isLoading ? "Loading..." : data?.text ? data.text : "Chiveproxy");
  if (error && error instanceof Card404) {
    return <Custom404 />;
  }
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

function Grid({ pictures }: { pictures: CardPicture[] }) {
  return (
    <div className={styles.gridPictures}>
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
          <img src={picture.img} alt={picture.caption} />
        </a>
      ))}
    </div>
  );
}

function List({ pictures }: { pictures: CardPicture[] }) {
  return (
    <div className={styles.listPictures}>
      {pictures.map((picture, i) => (
        <article key={picture.img} id={`img${i}`}>
          {picture.mp4src ? (
            <video src={picture.mp4src} controls muted />
          ) : (
            <img src={picture.img} alt={picture.caption} />
          )}

          <p>{picture.caption}</p>
        </article>
      ))}
    </div>
  );
}
