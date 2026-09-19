export type Card = {
  text: string;
  img: string;
  url: string;
  id: number;
  created: string;
  human_time: string;
  count_pictures?: number;
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

export type CardPicture = {
  img: string;
  gifsrc: string | null;
  mp4src: string | null;
  caption: string;
  caption_html: string;
};

export type ServerCard = {
  id: number;
  text: string;
  date: string;
  pictures: CardPicture[];
  _cacheInfo?: CacheInfo;
};
