import { ViewTransition } from "react";
import { Outlet } from "react-router";
import { Nav } from "./components/Nav";

export function Root() {
  return (
    <div>
      <Nav />
      <ViewTransition>
        <Outlet />
      </ViewTransition>
    </div>
  );
}
