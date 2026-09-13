import { useState } from "react";

export function ReloadAlert({ error }: { error: Error }) {
  const [showError, setShowError] = useState(false);
  return (
    <div>
      <p>There was an error loading the data. Please try again.</p>
      <button type="button" onClick={() => window.location.reload()}>
        Reload
      </button>
      <p>
        <button type="button" onClick={() => setShowError(!showError)}>
          {showError ? "Hide Error" : "Show Error"}
        </button>
      </p>
      {showError && <pre>{error.message}</pre>}
    </div>
  );
}
