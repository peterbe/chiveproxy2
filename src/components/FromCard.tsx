import { Link } from "react-router";
import styles from "./FromCard.module.css";
import { PrettyPrintDate } from "./PrettyDate";
import { PrettyPicture } from "./PrettyPicture";

import type { PictureSearch } from "@/types";

export function FromCard({ picture }: { picture: PictureSearch }) {
  if (!picture.card) return null;
  if (picture.card.img) {
    return (
      <div className={styles.row}>
        <div className={styles["col-fixed"]}>
          <PrettyPicture src={picture.card.img} alt={picture.caption} />
        </div>
        <div className={styles["col-fluid"]}>
          <p>
            From <Link to={`/${picture.card.id}`}>{picture.card.text}</Link>
            <br />
            <small>
              <PrettyPrintDate date={picture.card.date} withDate={false} />
            </small>
          </p>
        </div>
      </div>
    );
  }
  return (
    <div>
      <p>
        From <Link to={`/${picture.card.id}`}>{picture.card.text}</Link>
        <br />
        <small>
          <PrettyPrintDate date={picture.card.date} withDate={false} />
        </small>
      </p>
    </div>
  );
}
