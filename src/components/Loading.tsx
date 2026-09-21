import styles from "./Loading.module.css";
import { LoadingSpinner } from "./LoadingSpinner";

export function Loading() {
  return (
    <div className={styles.loading}>
      <LoadingSpinner />
      <p>Loading...</p>
    </div>
  );
}
