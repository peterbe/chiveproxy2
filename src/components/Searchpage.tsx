import { useState } from "react";
import { useSearchParams } from "react-router";
import { Listcards } from "./Listcards";
import { Listpictures } from "./Listpictures";
import { Loading } from "./Loading";
import { ReloadAlert } from "./ReloadAlert";
import { Searchform } from "./Searchform";
import styles from "./Searchpage.module.css";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useSearchCards } from "@/hooks/useSearchCards";
import { useSearchPictures } from "@/hooks/useSearchPictures";
import { useTimedout } from "@/hooks/useTimedout";

export function Searchpage() {
  const [searchOn, setSearchOn] = useState<"cards" | "pictures" | "both">("cards");

  const [searchParams] = useSearchParams();

  const q = searchParams.get("q") || "";
  const cardSearch = useSearchCards(q);
  const pictureSearch = useSearchPictures(q);
  useDocumentTitle("Search Chive");

  const isTimedOut = useTimedout(500);
  const showLoading =
    ((searchOn === "cards" && cardSearch.isPending) ||
      (searchOn === "pictures" && pictureSearch.isPending)) &&
    !isTimedOut;

  return (
    <div>
      {cardSearch.error && <ReloadAlert error={cardSearch.error} />}
      <Searchform />
      <fieldset className={styles.typeSelection}>
        {/* <legend>Search:</legend> */}
        <input
          type="radio"
          id="id_cards"
          name="search-on"
          checked={searchOn === "cards"}
          onChange={() => setSearchOn("cards")}
        />
        <label htmlFor="id_cards">
          Cards
          {cardSearch.data && ` (${cardSearch.data.search.count})`}
        </label>
        <input
          type="radio"
          id="id_pictures"
          name="search-on"
          checked={searchOn === "pictures"}
          onChange={() => setSearchOn("pictures")}
        />
        <label htmlFor="id_pictures">
          Pictures
          {pictureSearch.data && ` (${pictureSearch.data.pictures.length})`}
        </label>
      </fieldset>
      {showLoading && <Loading />}

      {cardSearch.data && searchOn === "cards" && (
        <Listcards cards={cardSearch.data.cards} preloadCards={1} />
      )}
      {pictureSearch.data && searchOn === "pictures" && (
        <Listpictures uri="" pictures={pictureSearch.data.pictures} />
      )}
    </div>
  );
}
