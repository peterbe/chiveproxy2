import { useSearchParams } from "react-router";
import { Listcards } from "./Listcards";
import { Loading } from "./Loading";
import { ReloadAlert } from "./ReloadAlert";
import { Searchform } from "./Searchform";
import { useDocumentTitle } from "@/useDocumentTitle";
import { useSearch } from "@/useSearch";
import { useSlowTruth } from "@/useSlowTruth";

export function Searchpage() {
  const [searchParams] = useSearchParams();

  const q = searchParams.get("q") || "";
  const { data, isPending, error } = useSearch(q);
  useDocumentTitle("Search Chive");

  const isStillPending = useSlowTruth(isPending, { delay: 500 });

  return (
    <div>
      {error && <ReloadAlert error={error} />}
      <Searchform />
      {isStillPending && <Loading />}
      {data && <p>Found {data.search.count} results.</p>}
      {data && <Listcards cards={data.cards} preloadCards={1} />}
    </div>
  );
}
