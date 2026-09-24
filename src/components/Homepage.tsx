import { useCards } from "./../useCards";
import styles from "./Homepage.module.css";
import { Listcards } from "./Listcards";
import { Loading } from "./Loading";
import { Logo } from "./Logo";
import { ReloadAlert } from "./ReloadAlert";
import { Searchform } from "./Searchform";
import { useTimedout } from "./useTimedout";
import { useDocumentTitle } from "@/useDocumentTitle";

export function Homepage() {
  const { data, isPending, error } = useCards();
  useDocumentTitle("Chive");

  const isTimedOut = useTimedout(1000);
  const showLoading = isPending && !isTimedOut;

  return (
    <div className={styles.homepage}>
      {error && <ReloadAlert error={error} />}
      <Logo />
      {/* <CachedInfo data={data?._cacheInfo} /> */}
      {data && <Searchform />}
      {showLoading && <Loading />}
      {data && <Listcards cards={data.cards} preloadCards={5} />}
    </div>
  );
}
