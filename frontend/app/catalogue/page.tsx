"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Enum for manga genres (matching the backend definition)
enum MangaGenre {
  SEINEN = "seinen",
  SHOJO = "shojo",
  SHONEN = "shonen",
  JOSEI = "josei",
  KODOMO = "kodomo",
  ACTION = "action",
  ADVENTURE = "adventure",
  COMEDY = "comedy",
  DRAMA = "drama",
  FANTASY = "fantasy",
  HORROR = "horror",
  MYSTERY = "mystery",
  ROMANCE = "romance",
  SCIFI = "sci-fi",
  SLICE_OF_LIFE = "slice-of-life",
  SPORTS = "sports",
  SUPERNATURAL = "supernatural",
  THRILLER = "thriller",
  HISTORICAL = "historical",
  PSYCHOLOGICAL = "psychological",
}

// Sample manga data
const sampleMangas = [
  {
    id: "1",
    title: "One Piece",
    coverImage: "https://placehold.co/300x450/jpeg",
    author: "Eiichiro Oda",
    genres: [MangaGenre.SHONEN, MangaGenre.ADVENTURE, MangaGenre.ACTION],
    description:
      "Monkey D. Luffy refuses to let anyone or anything stand in the way of his quest to become king of all pirates.",
    rating: 4.8,
    year: 1999,
  },
  {
    id: "2",
    title: "Berserk",
    coverImage: "https://placehold.co/300x450/jpeg",
    author: "Kentaro Miura",
    genres: [MangaGenre.SEINEN, MangaGenre.ACTION, MangaGenre.FANTASY],
    description:
      "Guts, a former mercenary now known as the Black Swordsman, seeks revenge.",
    rating: 4.9,
    year: 1989,
  },
  {
    id: "3",
    title: "Spy x Family",
    coverImage: "https://placehold.co/300x450/jpeg",
    author: "Tatsuya Endo",
    genres: [MangaGenre.SHONEN, MangaGenre.COMEDY, MangaGenre.ACTION],
    description:
      "A spy on an undercover mission gets married and adopts a child as part of his cover. His wife and daughter have secrets of their own.",
    rating: 4.7,
    year: 2019,
  },
  {
    id: "4",
    title: "Jujutsu Kaisen",
    coverImage: "https://placehold.co/300x450/jpeg",
    author: "Gege Akutami",
    genres: [MangaGenre.SHONEN, MangaGenre.ACTION, MangaGenre.SUPERNATURAL],
    description:
      "A boy joins a secret organization to fight demonic creatures called 'Curses.'",
    rating: 4.8,
    year: 2018,
  },
  {
    id: "5",
    title: "Fruits Basket",
    coverImage: "https://placehold.co/300x450/jpeg",
    author: "Natsuki Takaya",
    genres: [MangaGenre.SHOJO, MangaGenre.ROMANCE, MangaGenre.SUPERNATURAL],
    description:
      "A girl discovers a family cursed to transform into animals of the Chinese Zodiac.",
    rating: 4.7,
    year: 1998,
  },
  {
    id: "6",
    title: "Monster",
    coverImage: "https://placehold.co/300x450/jpeg",
    author: "Naoki Urasawa",
    genres: [MangaGenre.SEINEN, MangaGenre.THRILLER, MangaGenre.PSYCHOLOGICAL],
    description:
      "A brilliant neurosurgeon's life is turned upside down when he saves a former patient who turns out to be a dangerous psychopath.",
    rating: 4.9,
    year: 1994,
  },
  {
    id: "7",
    title: "Nana",
    coverImage: "https://placehold.co/300x450/jpeg",
    author: "Ai Yazawa",
    genres: [MangaGenre.JOSEI, MangaGenre.DRAMA, MangaGenre.ROMANCE],
    description:
      "Two young women with the same name meet on a train to Tokyo and end up living together, developing a deep friendship.",
    rating: 4.8,
    year: 2000,
  },
  {
    id: "8",
    title: "Doraemon",
    coverImage: "https://placehold.co/300x450/jpeg",
    author: "Fujiko F. Fujio",
    genres: [MangaGenre.KODOMO, MangaGenre.COMEDY, MangaGenre.SCIFI],
    description:
      "A robotic cat from the future helps a young boy with his everyday problems using futuristic gadgets.",
    rating: 4.6,
    year: 1969,
  },
];

export default function CataloguePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<MangaGenre[]>([]);
  const [sortBy, setSortBy] = useState<"title" | "year" | "rating">("title");

  // Filter and sort mangas
  const filteredMangas = sampleMangas
    .filter((manga) => {
      // Search filter
      const matchesSearch =
        manga.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manga.author.toLowerCase().includes(searchTerm.toLowerCase());

      // Genre filter
      const matchesGenre =
        selectedGenres.length === 0 ||
        selectedGenres.some((genre) => manga.genres.includes(genre));

      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "year") {
        return b.year - a.year;
      } else {
        return b.rating - a.rating;
      }
    });

  // Get unique genres from all mangas
  const allGenres = Object.values(MangaGenre);

  // Toggle genre selection
  const toggleGenre = (genre: MangaGenre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Catalogue de Mangas</h1>

        {/* Search and filters */}
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="space-y-4">
            {/* Search input */}
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
              <input
                type="text"
                placeholder="Rechercher par titre ou auteur..."
                className="w-full rounded-md border border-input pl-10 pr-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Genre filters */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Filtrer par genre</h3>
              <div className="flex flex-wrap gap-2">
                {allGenres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${
                      selectedGenres.includes(genre)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {genre.charAt(0).toUpperCase() +
                      genre.slice(1).replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sort options */}
          <div className="flex items-center">
            <label htmlFor="sort" className="text-sm font-medium mr-2">
              Trier par:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "title" | "year" | "rating")
              }
              className="rounded-md border border-input px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="title">Titre</option>
              <option value="year">Année (récent)</option>
              <option value="rating">Note</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500">
          {filteredMangas.length} mangas trouvés
        </p>

        {/* Manga grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredMangas.map((manga) => (
            <Link
              key={manga.id}
              href={`/manga/${manga.id}`}
              className="group flex flex-col rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="aspect-[2/3] relative overflow-hidden bg-gray-100">
                <Image
                  src={manga.coverImage}
                  alt={manga.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex flex-col gap-1 p-4">
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
                  {manga.title}
                </h3>
                <p className="text-sm text-gray-500">{manga.author}</p>
                <div className="flex items-center text-sm text-yellow-500 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-1"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <span>{manga.rating.toFixed(1)}</span>
                  <span className="text-gray-400 ml-2">{manga.year}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {manga.genres.slice(0, 2).map((genre) => (
                    <span
                      key={genre}
                      className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors"
                    >
                      {genre.charAt(0).toUpperCase() +
                        genre.slice(1).replace("-", " ")}
                    </span>
                  ))}
                  {manga.genres.length > 2 && (
                    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors">
                      +{manga.genres.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No results */}
        {filteredMangas.length === 0 && (
          <div className="text-center py-8">
            <p className="text-lg font-medium">
              Aucun manga ne correspond à votre recherche
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Essayez d'autres termes ou filtres
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
