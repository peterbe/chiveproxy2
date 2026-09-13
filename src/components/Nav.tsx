import { Link, useNavigate, useParams } from "react-router";
import { useScrollDetection } from "@/useScrollDetection";

export function Nav() {
  const navigate = useNavigate();
  const params = useParams();
  const uri = params.uri;
  const hasScrolledDown = useScrollDetection();
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li>
          <Link to="/" className="pure-button pure-button-primary">
            Home
          </Link>
        </li>

        <li>
          {uri ? (
            <button
              className="pure-button button-secondary"
              type="button"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          ) : (
            <button
              className="pure-button button-warning"
              type="button"
              onClick={() => window.location.reload()}
            >
              Reload
            </button>
          )}
        </li>
        {hasScrolledDown && (
          <li>
            <button
              className="pure-button button-success"
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Top
            </button>
          </li>
        )}
        {uri && (
          <li>
            <button
              className="pure-button button-primary"
              type="button"
              onClick={async () => {
                try {
                  await navigator.share({ url: window.location.href });
                } catch (error) {
                  console.warn("Error sharing:", error);
                }
              }}
            >
              Share
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
