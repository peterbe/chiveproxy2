import { useCards } from "./../useCards";
import styles from "./Homepage.module.css";
import { Listcards } from "./Listcards";
import { Loading } from "./Loading";
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
    <div className={styles.homepage}>
      {error && <ReloadAlert error={error} />}
      <Logo />
      {/* <CachedInfo data={data?._cacheInfo} /> */}
      {data && <Searchform />}
      {isStillPending && <Loading />}
      {data && <Listcards cards={data.cards} preloadCards={5} />}
    </div>
  );
}
