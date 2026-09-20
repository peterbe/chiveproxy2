import styles from "./PrettyPicture.module.css";

export function PrettyVideo({ src }: { src: string }) {
  return <video src={src} controls muted autoPlay className={styles.prettyPicture} />;
}
