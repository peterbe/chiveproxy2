import { useState } from "react";
import { useParams } from "react-router";
import { Card404, useCard } from "../useCard";
import { CachedInfo } from "./CachedInfo";
import styles from "./Cardpage.module.css";
import { Custom404 } from "./Errorpage";
import { Loading } from "./Loading";
import { PictureLoadingProgressBar } from "./PictureLoadingProgressBar";
import { PrettyPrintDate } from "./PrettyDate";
import { PrettyPicture } from "./PrettyPicture";
import { PrettyVideo } from "./PrettyVideo";
import { ReloadAlert } from "./ReloadAlert";
import { useImagePreloader } from "./useImagePreloader";
import { useIsSafari } from "./useIsSafari";
import { useDocumentTitle } from "@/useDocumentTitle";
import { useSlowTruth } from "@/useSlowTruth";

import type { CardPicture } from "@/types";

export function Cardpage() {
  const params = useParams();
  const uri = params.uri as string;

  const { data, isPending, isLoading, error } = useCard(uri);

  const isStillPending = useSlowTruth(isPending, { delay: 1000 });

  useDocumentTitle(isLoading ? "Loading..." : data?.text ? data.text : "Chive");
  if (error && error instanceof Card404) {
    return <Custom404 />;
  }
  return (
    <div className={styles.cardpage}>
      {isStillPending && <Loading />}

      {data && <h1 className={styles.cardTitle}>{data.text}</h1>}
      {data?.date && <PrettyPrintDate date={data?.date} />}
      <CachedInfo data={data?._cacheInfo} />
      {error && <ReloadAlert error={error} />}
      {data && <Grid pictures={data.pictures} />}
      {data && <List pictures={data.pictures} />}
    </div>
  );
}

function Grid({ pictures }: { pictures: CardPicture[] }) {
  const [closeProgressBar, setCloseProgressBar] = useState(false);
  const pictureUrls = pictures.filter((p) => !p.mp4src).map((picture) => picture.img);

  const { loaded, failed, total, done } = useImagePreloader(pictureUrls);

  if (pictureUrls.length && !done && !closeProgressBar) {
    return (
      <PictureLoadingProgressBar
        percent={Math.ceil((loaded / total) * 100)}
        failed={failed}
        onClose={() => setCloseProgressBar(true)}
      />
    );
  }

  return (
    <div>
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
    </div>
  );
}

function List({ pictures }: { pictures: CardPicture[] }) {
  const isSafari = useIsSafari();
  return (
    <div className={styles.listPictures}>
      {pictures.map((picture, i) => (
        <article key={picture.img} id={`img${i}`}>
          {picture.mp4src ? (
            isSafari ? (
              <PrettyPicture src={picture.mp4src} alt={picture.caption} />
            ) : (
              <PrettyVideo src={picture.mp4src} />
            )
          ) : (
            <PrettyPicture src={picture.img} alt={picture.caption} />
          )}

          <p>{picture.caption}</p>
        </article>
      ))}
    </div>
  );
}
