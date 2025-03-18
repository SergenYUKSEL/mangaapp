"use client";

import { useQuery } from "react-query";
import axios from "axios";
import { useState } from "react";

interface Chapter {
  id: string;
  attributes: {
    title: string;
    chapter: string;
    volume: string | null;
    publishAt: string;
    pages: number;
  };
}

interface ChapterResponse {
  result: string;
  data: Chapter[];
  total: number;
  offset: number;
  limit: number;
}

interface ChapterListProps {
  mangaId: string;
}

export default function ChapterList({ mangaId }: ChapterListProps) {
  const [page, setPage] = useState(1);
  const limit = 30;

  const { data, isLoading, error } = useQuery<ChapterResponse>(
    ["chapters", mangaId, page],
    async () => {
      const response = await axios.get(
        `https://api.mangadex.org/manga/${mangaId}/feed`,
        {
          params: {
            limit,
            offset: (page - 1) * limit,
            translatedLanguage: ["en", "fr"],
            order: { chapter: "desc" },
          },
        }
      );
      return response.data;
    },
    {
      keepPreviousData: true,
    }
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-500">Erreur lors du chargement des chapitres</p>
      </div>
    );
  }

  if (!data?.data.length) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">Aucun chapitre disponible</p>
      </div>
    );
  }

  const totalPages = Math.ceil((data.total || 0) / limit);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {data.data.map((chapter) => (
          <div
            key={chapter.id}
            className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {chapter.attributes.volume
                    ? `Volume ${chapter.attributes.volume}`
                    : ""}{" "}
                  Chapitre {chapter.attributes.chapter}
                </span>
                {chapter.attributes.title && (
                  <span className="text-gray-500">
                    - {chapter.attributes.title}
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(chapter.attributes.publishAt).toLocaleDateString()}
                {" • "}
                {chapter.attributes.pages} pages
              </div>
            </div>
            <button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
              Lire
            </button>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex h-9 items-center justify-center rounded-md border border-input px-4 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
          >
            Précédent
          </button>
          <span className="inline-flex h-9 items-center justify-center px-4 text-sm">
            Page {page} sur {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="inline-flex h-9 items-center justify-center rounded-md border border-input px-4 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}
