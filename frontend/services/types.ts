export interface MangaResponse {
  result: string;
  data: Manga[];
  limit: number;
  offset: number;
  total: number;
}

export interface Manga {
  id: string;
  type: "manga";
  attributes: MangaAttributes;
  relationships: Relationship[];
}

export interface Tag {
  id: string;
  type: "tag";
  attributes: {
    name: {
      en: string;
      [key: string]: string;
    };
    group: string;
  };
}

export interface Relationship {
  id: string;
  type: "author" | "artist" | "cover_art";
  attributes?: CoverAttributes | AuthorAttributes;
}

export interface CoverAttributes {
  fileName: string;
}

export interface AuthorAttributes {
  name: string;
  imageUrl: string | null;
  biography: {
    en: string;
    [key: string]: string;
  };
  twitter: string | null;
  pixiv: string | null;
  website: string | null;
}

export interface MangaFilters {
  title?: string;
  year?: number;
  status?: string;
  orderBy?: {
    [key: string]: "asc" | "desc";
  };
  limit?: number;
  offset?: number;
}

export interface VolumeResponse {
  result: string;
  data: Volume[];
  limit: number;
  offset: number;
  total: number;
}

export interface Volume {
  id: string;
  type: "volume";
  attributes: {
    volume: string;
    title: string | null;
    publishAt: string;
    coverArt: string | null;
    description: string | null;
    price: number | null;
    rating: {
      average: number;
      votes: number;
    } | null;
  };
  relationships: Relationship[];
}

export interface MangaAttributes {
  title: {
    [key: string]: string;
    en: string;
  };
  altTitles: Array<{ [key: string]: string }>;
  description: {
    [key: string]: string;
    en: string;
  };
  status: "ongoing" | "completed" | "hiatus" | "cancelled";
  year: number | null;
  contentRating: "safe" | "suggestive" | "erotica" | "pornographic";
  tags: Tag[];
  originalLanguage: string;
  lastVolume: string | null;
  lastChapter: string | null;
  publicationDemographic: "shounen" | "shoujo" | "josei" | "seinen" | null;
  state: string;
  chapterNumbersResetOnNewVolume: boolean;
  availableTranslatedLanguages: string[];
  createdAt: string;
  updatedAt: string;
}

export interface VolumeChapter {
  chapter: string;
  id: string;
  translatedLanguage: string;
  others: string[];
}

export interface VolumeData {
  volume: string;
  count: number;
  chapters: { [key: string]: VolumeChapter };
}

export interface VolumeAggregate {
  volumes: { [key: string]: VolumeData };
}
