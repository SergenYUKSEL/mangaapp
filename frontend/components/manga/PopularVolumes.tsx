"use client";

import { useQuery } from "react-query";
import { MangaService } from "@/services/manga.service";
import Image from "next/image";
import Link from "next/link";
import { Volume, VolumeResponse } from "@/services/types";
import { useEffect, useState } from "react";

export default function PopularVolumes() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data, isLoading } = useQuery<VolumeResponse>(
    ["popular-volumes"],
    () => MangaService.getPopularVolumes(20),
    {
      enabled: isClient,
    }
  );

  if (!isClient || isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Volumes Populaires</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="aspect-[2/3] bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!data?.data.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucun volume disponible</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Volumes Populaires</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {data.data.map((volume: Volume) => (
          <Link
            key={volume.id}
            href={`/volumes/${volume.id}`}
            className="group relative"
          >
            <div className="aspect-[2/3] relative overflow-hidden rounded-lg border border-gray-200 transition-shadow group-hover:shadow-lg">
              <Image
                src={MangaService.getCoverImageUrl(volume)}
                alt={volume.attributes.title || "Volume cover"}
                fill
                priority
                loading="eager"
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              />
            </div>
            <div className="mt-2 space-y-1">
              <h3 className="font-medium line-clamp-2 group-hover:text-primary">
                {volume.attributes.title ||
                  `Volume ${volume.attributes.volume}`}
              </h3>
              {volume.attributes.rating && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <svg
                    className="w-4 h-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>
                    {volume.attributes.rating.average.toFixed(1)}{" "}
                    <span className="text-xs">
                      ({volume.attributes.rating.votes})
                    </span>
                  </span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
