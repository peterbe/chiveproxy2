import { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import styles from "./Searchform.module.css";

export function Searchform() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") || "");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (q.trim()) {
          navigate(`/search?q=${encodeURIComponent(q)}`);
        } else {
          if (pathname === "/search") {
            navigate(`/`);
          }
          console.log({ CURRENT_LOCATION: pathname });
        }
      }}
      className={styles.searchForm}
    >
      <input
        type="search"
        placeholder="Search..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <button type="submit">Search</button>
      <button
        type="button"
        onClick={() => {
          setQ("");
          if (pathname === "/search") {
            navigate(`/`);
          }
        }}
      >
        Clear
      </button>
    </form>
  );
}
