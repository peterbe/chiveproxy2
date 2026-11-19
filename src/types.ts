export type Card = {
  text: string;
  text_headline?: string;
  img: string;
  url: string;
  id: number;
  created: string;
  count_pictures: number;
  uri: number;
};

export type CacheInfo = {
  created: string;
  hit: boolean;
};

export type ServerCards = {
  cards: Card[];
  _oldest_card: string;
  _cacheInfo?: CacheInfo;
};

export type ServerSearchCards = ServerCards & {
  search: {
    string: string;
    count: number;
  };
};

export type CardPicture = {
  id: number;
  img: string;
  gifsrc: string | null;
  mp4src: string | null;
  caption: string;
  caption_html: string;
  transcript: string | null;
};

export type ServerCard = {
  id: number;
  text: string;
  date: string;
  pictures: CardPicture[];
  _cacheInfo?: CacheInfo;
};

export type PictureSearch = CardPicture & {
  card: {
    id: number;
    text: string;
    date: string;
    img?: string;
  };
};
