// import { Container } from "@mantine/core"
import { Outlet } from "react-router";
// import { Nav } from "../components/simple-nav"

export function Root() {
  return (
    <div>
      {/* <Nav /> */}
      <Outlet />
    </div>
  );
}
