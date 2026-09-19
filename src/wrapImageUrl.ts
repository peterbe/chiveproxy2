import type { Card, CardPicture } from "./types";

const wrapImageUrl = (url: string) => {
  const sp = new URLSearchParams({ url, redirect_to_file: "true" });
  return `https://chiveproxy.peterbe.com/api/imageproxy?${sp.toString()}`;
};

export const wrapPicture = (picture: CardPicture) => {
  if (picture.img.startsWith("https://thechive.com")) {
    picture.img = wrapImageUrl(picture.img);
  }
  if (picture.mp4src?.startsWith("https://thechive.com")) {
    picture.mp4src = wrapImageUrl(picture.mp4src);
  }
};

export const wrapCard = (picture: Card) => {
  if (picture.img.startsWith("https://thechive.com")) {
    picture.img = wrapImageUrl(picture.img);
  }
};
