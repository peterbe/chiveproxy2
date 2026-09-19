import { useCards } from "./../useCards";
import { Listcards } from "./Listcards";
import { Logo } from "./Logo";
import { ReloadAlert } from "./ReloadAlert";
import { Searchform } from "./Searchform";
import { useDocumentTitle } from "@/useDocumentTitle";
import { useSlowTruth } from "@/useSlowTruth";

export function Homepage() {
  const { data, isPending, error } = useCards();
  useDocumentTitle("Chiveproxy");

  const isStillPending = useSlowTruth(isPending, { delay: 500 });

  return (
    <div className="homepage">
      {error && <ReloadAlert error={error} />}
      <Logo />
      {/* <CachedInfo data={data?._cacheInfo} /> */}
      {data && <Searchform />}
      {isStillPending && <p>Loading...</p>}
      {data && <Listcards cards={data.cards} preload />}
    </div>
  );
}
