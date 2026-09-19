import { createBrowserRouter } from "react-router";
import { Cardpage } from "./components/Cardpage";
import ErrorPage from "./components/Errorpage";
import { Homepage } from "./components/Homepage";
import { Searchpage } from "./components/Searchpage";
import { Root } from "./root";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    id: "root",
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <Homepage />,
          },
          { path: "search", element: <Searchpage /> },
          { path: ":uri", element: <Cardpage /> },
        ],
      },
    ],
  },
]);
