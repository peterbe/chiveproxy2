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
