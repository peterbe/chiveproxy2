import { hydrate, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import "./index.scss";
import { router } from "./routes";

const queryClient = new QueryClient();

// Set by scripts/prerender.ts in pre-rendered pages
if (window.__REACT_QUERY_STATE__) {
  hydrate(queryClient, window.__REACT_QUERY_STATE__);
}

const e = document.getElementById("root");
if (!e) throw new Error("no root");
if (!router) throw new Error("no router");

const app = (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);

if (e.hasChildNodes()) {
  hydrateRoot(e, app);
} else {
  createRoot(e).render(app);
}
