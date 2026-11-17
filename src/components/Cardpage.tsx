import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { CacheOptions } from "./CacheOptions";
import styles from "./Cardpage.module.css";
import { Custom404 } from "./Errorpage";
import { Listpictures } from "./Listpictures";
import { Loading } from "./Loading";
import { PictureLoadingProgressBar } from "./PictureLoadingProgressBar";
import { PrettyPrintDate } from "./PrettyDate";
import { PrettyPicture } from "./PrettyPicture";
import { ReloadAlert } from "./ReloadAlert";
import { Card404, useCard } from "@/hooks/useCard";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useImagePreloader } from "@/hooks/useImagePreloader";
import { useTimedout } from "@/hooks/useTimedout";

import type { CardPicture } from "@/types";

export function Cardpage() {
  const params = useParams();
  const uri = params.uri as string;
  const id = params.id as string;

  const { data, isPending, isLoading, error, refetch } = useCard(uri);

  const isTimedOut = useTimedout(1000);

  const showLoading = isPending && !isTimedOut;

  let title = "Chive";
  if (isLoading) {
    title = "Loading...";
  } else if (data?.text) {
    title = data.text;
  }
  useDocumentTitle(title);

  useEffect(() => {
    if (id) {
      const html = document.documentElement;
      html.classList.add("modal-is-open");
      const dialog = document.querySelector("dialog[open]");
      if (dialog) {
        dialog.scrollIntoView();
      }
      return () => {
        html.classList.remove("modal-is-open");
      };
    }
  }, [id]);

  if (
    (error && error instanceof Card404) ||
    (id && data && !data.pictures.find((p) => `${p.id}` === id))
  ) {
    return <Custom404 />;
  }

  const picture = id && data?.pictures.find((p) => `${p.id}` === id);

  return (
    <div className={styles.cardpage}>
      {id && picture && (
        <dialog open>
          <article>
            <header>
              <button aria-label="Close" rel="prev"></button>
            </header>
            <PrettyPicture src={picture?.img} alt={picture?.caption} />
          </article>
        </dialog>
      )}
      {showLoading && <Loading />}

      <div className={styles.cardContent}>
        {data && <h1 className={styles.cardTitle}>{data.text}</h1>}
        {data?.date && <PrettyPrintDate date={data?.date} />}
        {/* <CachedInfo data={data?._cacheInfo} /> */}
        {error && <ReloadAlert error={error} />}
      </div>
      {data && <Grid pictures={data.pictures} />}
      {data && <Listpictures uri={uri} pictures={data.pictures} />}

      {data && <CacheOptions data={data._cacheInfo} refetch={refetch} uri={uri} />}
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
