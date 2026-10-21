import { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import styles from "./Searchform.module.css";

export function Searchform() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const [q, setQ] = useState(() => searchParams.get("q") || "");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (q.trim()) {
          void navigate(`/search?q=${encodeURIComponent(q)}`);
        } else {
          if (pathname === "/search") {
            void navigate(`/`);
          }
          console.log({ CURRENT_LOCATION: pathname });
        }
      }}
      className={styles.searchForm}
    >
      <div className="grid">
        <div>
          <input
            type="search"
            placeholder="Search..."
            value={q}
            name="search"
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>
    </form>
  );
}
