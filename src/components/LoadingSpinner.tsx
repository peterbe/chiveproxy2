import { Watch } from "react-loader-spinner";
export function LoadingSpinner() {
  return (
    <Watch
      visible={true}
      height="80"
      width="80"
      radius="48"
      color="rgb(45, 49, 56)"
      ariaLabel="watch-loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  );
}
