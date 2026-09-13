import { createBrowserRouter } from "react-router";
import ErrorPage from "./components/error-page";
import { Homepage } from "./components/Homepage";
import { Cardpage } from "./components/Cardpage";
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
          { path: ":uri", element: <Cardpage /> },
        ],
      },
    ],
  },
]);
