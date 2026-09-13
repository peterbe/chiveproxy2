export const wrapImageUrl = (url: string) => {
  const sp = new URLSearchParams({ url });
  return `https://chiveproxy.peterbe.com/api/imageproxy?${sp.toString()}`;
};
