import { useState } from "react";
import { useSearchParams } from "react-router";
import { Listcards } from "./Listcards";
import { Listpictures } from "./Listpictures";
import { Loading } from "./Loading";
import { ReloadAlert } from "./ReloadAlert";
import { Searchform } from "./Searchform";
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
      <fieldset>
        <legend>Search:</legend>
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
        {/* <input
          type="radio"
          id="id_both"
          name="search-on"
          checked={searchOn === "both"}
          onChange={() => setSearchOn("both")}
        />
        <label htmlFor="id_both">
          Both
          {cardSearch.data &&
            pictureSearch.data &&
            ` (${(cardSearch.data.search.count ?? 0) + (pictureSearch.data?.pictures.length ?? 0)})`}
        </label> */}
      </fieldset>
      {showLoading && <Loading />}
      {/* {cardSearch.data && (
        <p className={styles.searchCount}>
          Found {cardSearch.data.search.count} card{cardSearch.data.search.count !== 1 ? "s" : ""}.
        </p>
      )} */}
      {/* {pictureSearch.data && (
        <p className={styles.searchCount}>
          Found {pictureSearch.data.pictures.length} picture
          {pictureSearch.data.pictures.length !== 1 ? "s" : ""}.
        </p>
      )} */}
      {cardSearch.data && searchOn === "cards" && (
        <Listcards cards={cardSearch.data.cards} preloadCards={1} />
      )}
      {pictureSearch.data && searchOn === "pictures" && (
        <Listpictures uri="" pictures={pictureSearch.data.pictures} />
      )}
    </div>
  );
}
