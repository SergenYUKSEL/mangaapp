"use client";

import Image from "next/image";
import Link from "next/link";
import { Manga } from "@/services/types";
import { MangaService } from "@/services/manga.service";

interface MangaCardProps {
  manga: Manga;
}

export default function MangaCard({ manga }: MangaCardProps) {
  const coverUrl = MangaService.getCoverImageUrl(manga);
  const title = MangaService.formatTitle(manga);
  const author = MangaService.getAuthor(manga);
  const tags = manga.attributes.tags
    .filter((tag) => tag.attributes.group === "genre")
    .slice(0, 3)
    .map((tag) => tag.attributes.name.en);

  return (
    <Link
      href={`/manga/${manga.id}`}
      className="group flex flex-col rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
    >
      <div className="aspect-[2/3] relative overflow-hidden bg-gray-100">
        <Image
          src={coverUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>
      <div className="flex flex-col gap-1 p-4">
        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-gray-500">{author}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {tags.map((genre) => (
            <span
              key={genre}
              className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
