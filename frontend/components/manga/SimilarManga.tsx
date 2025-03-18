"use client";

import { useQuery } from "react-query";
import axios from "axios";
import MangaCard from "./MangaCard";
import { Manga } from "@/services/types";

interface SimilarMangaProps {
  mangaId: string;
  tags: string[];
}

export default function SimilarManga({ mangaId, tags }: SimilarMangaProps) {
  const { data, isLoading } = useQuery(
    ["similar-manga", mangaId],
    async () => {
      const response = await axios.get("https://api.mangadex.org/manga", {
        params: {
          limit: 4,
          offset: 0,
          includedTags: tags.slice(0, 2),
          excludedTags: [],
          contentRating: ["safe", "suggestive"],
          order: { followedCount: "desc" },
        },
      });
      return response.data;
    },
    {
      enabled: tags.length > 0,
    }
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="aspect-[2/3] bg-gray-200 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!data?.data.length) {
    return null;
  }

  const similarManga = data.data
    .filter((manga: Manga) => manga.id !== mangaId)
    .slice(0, 4);

  if (similarManga.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Mangas similaires</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {similarManga.map((manga: Manga) => (
          <MangaCard key={manga.id} manga={manga} />
        ))}
      </div>
    </div>
  );
}
