"use client";

import Image from "next/image";
import { useQuery } from "react-query";
import { Manga, Volume, Relationship, VolumeResponse } from "@/services/types";
import { MangaService } from "@/services/manga.service";
import MangaRating from "./MangaRating";
import Link from "next/link";

interface MangaDetailsProps {
  manga: Manga;
}

export default function MangaDetails({ manga }: MangaDetailsProps) {
  const coverUrl = MangaService.getCoverImageUrl(manga);
  const title = MangaService.getFrenchTitle(manga);
  const author = MangaService.getAuthor(manga);

  console.log("Description:", manga.attributes.description);

  // Formater la description pour l'affichage HTML
  const formattedDescription =
    (typeof manga.attributes.description === "object"
      ? manga.attributes.description.fr || manga.attributes.description.en
      : manga.attributes.description) || "Aucune description disponible";

  const [synopsis, publisher] = formattedDescription
    .split("---")
    .map((part) => part.trim());

  const authorId = manga.relationships.find((rel) => rel.type === "author")?.id;

  // Récupérer les volumes de ce manga
  const { data: volumesData } = useQuery<VolumeResponse>(
    ["volumes", manga.id],
    () => MangaService.getVolumesByMangaId(manga.id),
    {
      enabled: !!manga.id,
    }
  );

  // Récupérer les autres volumes du même auteur
  const { data: authorVolumesData } = useQuery<VolumeResponse, Error>(
    ["author-volumes", authorId],
    async () => {
      if (!authorId) {
        return {
          result: "ok",
          data: [],
          limit: 0,
          offset: 0,
          total: 0,
        };
      }
      return MangaService.getVolumesByAuthor(authorId);
    },
    {
      enabled: !!authorId,
    }
  );

  return (
    <div className="container px-4 md:px-6 py-6">
      <div className="grid gap-6 lg:grid-cols-[300px_1fr] lg:gap-12">
        {/* Image et informations principales */}
        <div className="space-y-6">
          <div className="aspect-[2/3] relative overflow-hidden rounded-lg border border-gray-200">
            <Image
              src={coverUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 300px"
              priority
            />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              {manga.attributes.year && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Année:</span>
                  <span className="text-sm text-gray-500">
                    {manga.attributes.year}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-1">
              {manga.attributes.tags
                .filter((tag) => tag.attributes.group === "genre")
                .map((tag) => (
                  <span
                    key={tag.attributes.name.en}
                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    {tag.attributes.name.en}
                  </span>
                ))}
            </div>
          </div>
        </div>

        {/* Description et détails */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="text-lg text-gray-500">par {author}</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Synopsis</h2>
            <div className="prose max-w-none dark:prose-invert">
              <p>{synopsis}</p>
            </div>
          </div>

          {/* Liste des volumes */}
          {volumesData?.data && volumesData.data.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Volumes</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {volumesData.data.map((volume) => (
                  <Link
                    key={volume.id}
                    href={`/volumes/${volume.id}`}
                    className="group"
                  >
                    <div className="aspect-[2/3] relative overflow-hidden rounded-lg border border-gray-200">
                      <Image
                        src={MangaService.getCoverImageUrl(volume)}
                        alt={MangaService.formatTitle(volume)}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                      />
                    </div>
                    <div className="mt-2">
                      <h3 className="font-medium">
                        {MangaService.formatTitle(volume)}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Autres volumes du même auteur */}
      {authorVolumesData?.data && authorVolumesData.data.length > 0 && (
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-bold">Autres œuvres de {author}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {authorVolumesData.data
              .filter((volume: Volume) =>
                volume.relationships.some(
                  (rel: Relationship) => rel.id !== manga.id
                )
              )
              .slice(0, 12)
              .map((volume: Volume) => (
                <Link
                  key={volume.id}
                  href={`/volumes/${volume.id}`}
                  className="group"
                >
                  <div className="aspect-[2/3] relative overflow-hidden rounded-lg border border-gray-200">
                    <Image
                      src={
                        volume.attributes.coverArt || "/placeholder-cover.jpg"
                      }
                      alt={
                        volume.attributes.title ||
                        `Volume ${volume.attributes.volume}`
                      }
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16.666vw"
                    />
                  </div>
                  <div className="mt-2">
                    <h3 className="font-medium text-sm line-clamp-2">
                      {volume.attributes.title ||
                        `Volume ${volume.attributes.volume}`}
                    </h3>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
