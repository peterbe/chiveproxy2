export const wrapImageUrl = (url: string) => {
  const sp = new URLSearchParams({ url, redirect_to_file: "true" });
  return `https://chiveproxy.peterbe.com/api/imageproxy?${sp.toString()}`;
};
