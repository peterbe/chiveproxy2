/**
 * In react-router 8.5.0 it tells you to use:
 *
 *   import { ViewTransition } from "react";
 *
 * and
 *
 *       <ViewTransition>
          <Outlet />
        </ViewTransition>

 * But doing so causes a really slow behavior of clicking links in
 * Safari.
 */

import { Outlet } from "react-router";
import { Nav } from "./components/Nav";

export function Root() {
  return (
    <div>
      <Nav />
      <Outlet />
    </div>
  );
}
