import styles from "./PrettyPicture.module.css";

export function PrettyPicture({ src, alt }: { src: string; alt: string }) {
  return <img src={src} alt={alt} className={styles.prettyPicture} />;
}
