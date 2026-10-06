declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

interface Window {
  __REACT_QUERY_STATE__?: import("@tanstack/react-query").DehydratedState;
}
