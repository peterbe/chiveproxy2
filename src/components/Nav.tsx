import { Link, useLocation, useNavigate, useParams } from "react-router";
import styles from "./Nav.module.css";
import { useScrollDetection } from "@/useScrollDetection";

export function Nav() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const currentHref = location.pathname + location.search;
  const uri = params.uri;
  const hasScrolledDown = useScrollDetection();
  return (
    <nav className={styles.navbar}>
      <ul className={styles.navLinks}>
        <li>
          <Link to="/" role="button" viewTransition>
            Home
          </Link>
        </li>

        <li>
          {uri ? (
            <Link
              to="/"
              role="button"
              onClick={(event) => {
                event.preventDefault();
                navigate(-1);
              }}
            >
              Back
            </Link>
          ) : (
            <Link
              to={currentHref}
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
              to={currentHref}
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
              to={currentHref}
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
