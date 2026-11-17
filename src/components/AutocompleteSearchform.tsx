import { useCombobox } from "downshift";
import { useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { useDebounceValue } from "usehooks-ts";
import "../downshift-search.scss";
import { PrettyPrintDate } from "./PrettyDate";
import styles from "./Searchform.module.css";
import { useSearchPictures } from "@/hooks/useSearchPictures";

export function Searchform() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const [q, setQ] = useState(() => searchParams.get("q") || "");

  const [debouncedQ] = useDebounceValue(q, 400);
  const { data } = useSearchPictures(debouncedQ);

  const hasSearchResults = data ? data?.pictures.length > 0 : false;
  const items = data?.pictures || [];

  const { isOpen, getLabelProps, getMenuProps, getInputProps, highlightedIndex, getItemProps } =
    useCombobox({
      onIsOpenChange: ({ type, isOpen, selectedItem, inputValue }) => {
        // This happens when the user ignores any suggestions and simply
        // pressed Enter after having typed something.
        // Essentially this is as if the user had entirely ignored that
        // there were any suggestions and just typed and Enter.
        if (
          type === useCombobox.stateChangeTypes.InputKeyDownEnter &&
          !isOpen &&
          !selectedItem &&
          inputValue
        ) {
          void navigate(`/search?q=${encodeURIComponent(q)}`);
        }
      },
      onInputValueChange({ inputValue }) {
        setQ(inputValue);
      },
      inputValue: q,
      initialInputValue: q,
      items: items,
      itemToString(item) {
        return item ? item.caption : "";
      },
      onSelectedItemChange: ({ selectedItem }) => {
        if (selectedItem) {
          void navigate(`/${selectedItem.card.id}/${selectedItem.id}`);
        }
      },
    });

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
        }
      }}
      className={styles.searchForm}
    >
      <div className="downshift-wrapper">
        <div className="grid">
          <div>
            <label className="visually-hidden" {...getLabelProps()}>
              Search terms:
            </label>
            <fieldset role="search">
              <input placeholder="" type="search" {...getInputProps()} />
            </fieldset>
          </div>
          <article
            className={`downshift-dropdown ${!(isOpen && hasSearchResults) && "visually-hidden"}`}
          >
            <ul className={styles.picturesList} {...getMenuProps()}>
              {isOpen &&
                items.map((item, index) => {
                  let className = "";
                  if (highlightedIndex === index) className += "downshift-highlighted ";

                  const url = `/${item.card.id}/${item.id}`;

                  return (
                    <li className={className} key={item.id} {...getItemProps({ item, index })}>
                      <Link to={url}>
                        <img src={item.img} alt={item.caption || "*no caption*"} />
                      </Link>
                      from <Link to={`/${item.card.id}`}>{item.card.text}</Link>
                      <br />
                      <small>
                        <PrettyPrintDate date={item.card.date} withDate={false} />
                      </small>
                    </li>
                  );
                })}
            </ul>
          </article>
        </div>
      </div>
    </form>
  );
}
