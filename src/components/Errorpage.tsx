import { useEffect } from "react";
import { isRouteErrorResponse, Link, useRouteError, useSearchParams } from "react-router";
import styles from "./Errorpage.module.css";

export default function ErrorPage() {
  const error = useRouteError();

  // When doing client-side navigation, sometimes the location of the dynamically imported
  // module does not work because the page you were originally on was from a different
  // build. By reloading, we're starting over again.
  const [searchParams] = useSearchParams();
  useEffect(() => {
    if (error && error instanceof Error) {
      if (error.message.includes("Failed to fetch dynamically imported module:")) {
        if (!searchParams.get("reloaded")) {
          const oldURL = window.location.href;
          const newURL = `${oldURL}${oldURL.includes("?") ? "&" : "?"}reloaded=1`;
          console.warn("Reloading the page because a dynamically loaded module failed");
          window.location.href = newURL;
        } else {
          console.warn("Already tried to reload the page");
        }
      }
    }
  }, [error, searchParams]);

  if (isRouteErrorResponse(error)) {
    console.warn(error);
    if (error.status === 404) {
      return <Custom404 />;
    }
  } else {
    console.error(error);
  }

  return (
    <div className={styles.errorPage}>
      <h1>Error!</h1>
      <p>Some sort of error was thrown during the rendering.</p>
      {error instanceof Error ? (
        <p className={styles.errorMessage}>
          Error message: <code>{error.message}</code>
        </p>
      ) : (
        <p className={styles.errorMessage}>Error unknown. See console logs.</p>
      )}
    </div>
  );
}

export function Custom404() {
  return (
    <div className={styles.errorPage}>
      <h1>Page not found</h1>
      <p className={styles.linkBack}>
        <Link to="/">Take me back to home page</Link>
      </p>
    </div>
  );
}
