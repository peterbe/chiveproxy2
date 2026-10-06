import { dehydrate, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from "react-router";
import { routes } from "./routes";
import { wrapCard, wrapPicture } from "./wrapImageUrl";

import type { ServerCard, ServerCards } from "./types";
import type { DehydratedState } from "@tanstack/react-query";

const API_TARGET = process.env.VITE_API_TARGET ?? "https://chive.peterbe.com";

async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API_TARGET}${path}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${path} (${res.status})`);
  }
  return (await res.json()) as T;
}

// Fill the cache with the same query keys and data shapes that
// useCards() and useCard() use, so useQuery() finds the data while rendering.
async function prefetch(queryClient: QueryClient, pathname: string, uri?: string) {
  try {
    if (pathname === "/") {
      await queryClient.fetchQuery({
        queryKey: ["cards"],
        queryFn: async () => {
          const data = await fetchJSON<ServerCards>("/api/cards/");
          for (const card of data.cards) {
            wrapCard(card);
          }
          return data;
        },
      });
    } else if (uri) {
      await queryClient.fetchQuery({
        queryKey: ["card", uri],
        queryFn: async () => {
          const data = await fetchJSON<ServerCard>(`/api/cards/${uri}/`);
          for (const picture of data.pictures) {
            wrapPicture(picture);
          }
          return data;
        },
      });
    }
  } catch (error) {
    console.warn(`Prefetching data for ${pathname} failed; rendering without it.`, error);
  }
}

// Renders the app for the given URL (e.g. "/search" or "/some-card-uri")
// to an HTML string. Used by scripts/prerender.ts.
export async function render(
  url: string,
): Promise<{ html: string; dehydratedState: DehydratedState }> {
  const handler = createStaticHandler(routes);
  const request = new Request(new URL(url, "http://localhost"));
  const context = await handler.query(request);
  if (context instanceof Response) {
    throw new Error(`Rendering ${url} resulted in a redirect/response (${context.status})`);
  }
  const router = createStaticRouter(handler.dataRoutes, context);

  const queryClient = new QueryClient();
  const uri = context.matches.at(-1)?.params.uri;
  await prefetch(queryClient, new URL(request.url).pathname, uri);

  const html = renderToString(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <StaticRouterProvider router={router} context={context} hydrate={false} />
      </QueryClientProvider>
    </StrictMode>,
  );

  return { html, dehydratedState: dehydrate(queryClient) };
}
