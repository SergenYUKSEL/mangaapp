"use client";

import Link from "next/link";
import { useQuery } from "react-query";
import Image from "next/image";
import { MangaService } from "@/services/manga.service";
import { Volume } from "@/services/types";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FeaturedManga() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const itemsToShow = 4; // Nombre de mangas affichés à la fois

  const { data, isLoading, error } = useQuery(
    ["featured-manga"],
    () => MangaService.getPopularVolumes(20), // 20 mangas
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  );

  const totalItems = data?.data?.length || 0;

  const handlePrev = () => {
    if (isAnimating || !totalItems) return;

    setIsAnimating(true);
    setActiveIndex((prev) => (prev === 0 ? totalItems - 1 : prev - 1));

    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const handleNext = () => {
    if (isAnimating || !totalItems) return;

    setIsAnimating(true);
    setActiveIndex((prev) => (prev + 1) % totalItems);

    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  // Créer un tableau des mangas à afficher
  const getVisibleItems = () => {
    if (!data?.data || totalItems === 0) return [];

    const items = [];
    for (let i = 0; i < itemsToShow; i++) {
      const index = (activeIndex + i) % totalItems;
      items.push(data.data[index]);
    }
    return items;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Mangas Populaires</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="aspect-[2/3] bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data?.data.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Aucun manga disponible</p>
      </div>
    );
  }

  const visibleItems = getVisibleItems();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mangas Populaires</h2>
        <div className="flex space-x-2">
          <button
            onClick={handlePrev}
            disabled={isAnimating}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Précédent"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            disabled={isAnimating}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Suivant"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="w-full">
        <div className="grid grid-cols-4 gap-6">
          {visibleItems.map((volume, index) => (
            <div
              key={`${volume.id}-${index}`}
              className={`transition-all duration-500 ${
                isAnimating ? "opacity-90 scale-95" : "opacity-100 scale-100"
              }`}
            >
              <Link href={`/manga/${volume.id}`} className="group block">
                <div className="aspect-[2/3] relative overflow-hidden rounded-lg border border-gray-200 transition-shadow group-hover:shadow-lg">
                  <Image
                    src={MangaService.getCoverImageUrl(volume)}
                    alt={volume.attributes.title || "Couverture du manga"}
                    fill
                    priority
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="mt-2">
                  <h3 className="font-medium line-clamp-2 group-hover:text-primary">
                    {volume.attributes.title}
                  </h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
