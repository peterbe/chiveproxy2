import { Link, useLocation, useNavigate, useParams } from "react-router";
import styles from "./Nav.module.css";
import { useScrollDetection } from "@/useScrollDetection";

export function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const here = location.pathname + location.search;
  const params = useParams();
  const uri = params.uri;
  const hasScrolledDown = useScrollDetection();
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navLinks}>
        <li>
          <Link
            to="/"
            role="button"
            // className={styles.standardButton}
            viewTransition
          >
            Home
          </Link>
        </li>

        <li>
          {uri ? (
            <Link
              to="/"
              role="button"
              // className={styles.standardButton}
              onClick={(event) => {
                event.preventDefault();
                navigate(-1);
              }}
            >
              Back
            </Link>
          ) : (
            <Link
              to={here}
              // className={styles.standardButton}
              type="button"
              onClick={(event) => {
                event.preventDefault();
                window.location.reload();
              }}
            >
              Reload
            </Link>
          )}
        </li>

        {uri && (
          <li>
            <Link
              role="button"
              to={here}
              // className={styles.standardButton}
              onClick={async (event) => {
                event.preventDefault();
                try {
                  await navigator.share({ url: window.location.href });
                } catch (error) {
                  console.warn("Error sharing:", error);
                }
              }}
            >
              Share
            </Link>
          </li>
        )}
        {hasScrolledDown && (
          <li>
            <Link
              role="button"
              to={here}
              // className={styles.standardButton}
              type="button"
              onClick={(event) => {
                event.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Top
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
