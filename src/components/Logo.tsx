import logo from "./kcco.png";
import styles from "./Logo.module.css";

export function Logo() {
  return (
    <p className={styles.logo}>
      <img src={logo} alt="Chive" />
    </p>
  );
}
