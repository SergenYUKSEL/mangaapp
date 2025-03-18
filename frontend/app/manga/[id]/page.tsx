"use client";

import { useMangaDetails } from "@/hooks/useManga";
import { useParams } from "next/navigation";
import MangaDetails from "@/components/manga/MangaDetails";

export default function MangaPage() {
  const { id } = useParams();
  const { data: manga, isLoading, error } = useMangaDetails(id as string);

  if (isLoading) {
    return (
      <div className="container px-4 md:px-6 py-6">
        <div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:gap-12">
          <div className="space-y-4">
            <div className="aspect-[2/3] bg-gray-200 rounded-lg animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-6 bg-gray-200 rounded w-1/2 mt-2 animate-pulse" />
            </div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container px-4 md:px-6 py-6">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-red-500">
            Une erreur est survenue
          </h1>
          <p className="text-gray-500 mt-2">
            Impossible de charger les informations du manga.
          </p>
        </div>
      </div>
    );
  }

  if (!manga) {
    return (
      <div className="container px-4 md:px-6 py-6">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold">Manga non trouvé</h1>
          <p className="text-gray-500 mt-2">
            Le manga que vous recherchez n'existe pas.
          </p>
        </div>
      </div>
    );
  }

  return <MangaDetails manga={manga} />;
}
