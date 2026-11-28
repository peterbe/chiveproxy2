import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import "./index.scss";
import { CARD_CACHE_MAX_AGE } from "./constants";
import { router } from "./routes";

const queryClient = new QueryClient();

const persister = createAsyncStoragePersister({
  storage: window.localStorage,
  key: "chiveproxy2-query-cache",
});

const e = document.getElementById("root");
if (!e) throw new Error("no root");
createRoot(e).render(
  <StrictMode>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: CARD_CACHE_MAX_AGE,
        dehydrateOptions: {
          // Only persist successful `useCard` and `useCards` queries to
          // localStorage, and only if they were fetched within maxAge.
          // Older ones are dropped from storage on the next save, which
          // stops localStorage from growing with every card ever viewed.
          shouldDehydrateQuery: (query) =>
            (query.queryKey[0] === "card" || query.queryKey[0] === "cards") &&
            query.state.status === "success" &&
            Date.now() - query.state.dataUpdatedAt < CARD_CACHE_MAX_AGE,
        },
      }}
    >
      <RouterProvider router={router} />
    </PersistQueryClientProvider>
  </StrictMode>,
);
