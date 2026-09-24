import { useSearchParams } from "react-router";
import { Listcards } from "./Listcards";
import { Loading } from "./Loading";
import { ReloadAlert } from "./ReloadAlert";
import { Searchform } from "./Searchform";
import { useTimedout } from "./useTimedout";
import { useDocumentTitle } from "@/useDocumentTitle";
import { useSearch } from "@/useSearch";

export function Searchpage() {
  const [searchParams] = useSearchParams();

  const q = searchParams.get("q") || "";
  const { data, isPending, error } = useSearch(q);
  useDocumentTitle("Search Chive");

  const isTimedOut = useTimedout(500);
  const showLoading = isPending && !isTimedOut;

  return (
    <div>
      {error && <ReloadAlert error={error} />}
      <Searchform />
      {showLoading && <Loading />}
      {data && <p>Found {data.search.count} results.</p>}
      {data && <Listcards cards={data.cards} preloadCards={1} />}
    </div>
  );
}
