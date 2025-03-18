"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Enum for manga genres
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

// Enum for ownership status
enum OwnershipStatus {
  OWNED = "owned",
  WANTED = "wanted",
  NONE = "none",
}

// Enum for reading status
enum ReadingStatus {
  UNREAD = "unread",
  READING = "reading",
  COMPLETED = "completed",
  ON_HOLD = "on-hold",
  DROPPED = "dropped",
}

// Sample user library data
const sampleLibrary = [
  {
    mangaId: "1",
    title: "One Piece",
    coverImage: "https://placehold.co/300x450/jpeg",
    author: "Eiichiro Oda",
    genres: [MangaGenre.SHONEN, MangaGenre.ADVENTURE, MangaGenre.ACTION],
    ownershipStatus: OwnershipStatus.OWNED,
    readingStatus: ReadingStatus.READING,
    addedAt: new Date(2023, 5, 15).toISOString(),
    rating: 5,
    notes: "Tome 1-10 achetés, en attente des tomes 11-15",
  },
  {
    mangaId: "2",
    title: "Berserk",
    coverImage: "https://placehold.co/300x450/jpeg",
    author: "Kentaro Miura",
    genres: [MangaGenre.SEINEN, MangaGenre.ACTION, MangaGenre.FANTASY],
    ownershipStatus: OwnershipStatus.WANTED,
    readingStatus: ReadingStatus.UNREAD,
    addedAt: new Date(2023, 8, 10).toISOString(),
    rating: null,
    notes: "",
  },
  {
    mangaId: "5",
    title: "Fruits Basket",
    coverImage: "https://placehold.co/300x450/jpeg",
    author: "Natsuki Takaya",
    genres: [MangaGenre.SHOJO, MangaGenre.ROMANCE, MangaGenre.SUPERNATURAL],
    ownershipStatus: OwnershipStatus.OWNED,
    readingStatus: ReadingStatus.COMPLETED,
    addedAt: new Date(2023, 2, 20).toISOString(),
    rating: 4,
    notes: "Collection complète",
  },
  {
    mangaId: "3",
    title: "Spy x Family",
    coverImage: "https://placehold.co/300x450/jpeg",
    author: "Tatsuya Endo",
    genres: [MangaGenre.SHONEN, MangaGenre.COMEDY, MangaGenre.ACTION],
    ownershipStatus: OwnershipStatus.OWNED,
    readingStatus: ReadingStatus.READING,
    addedAt: new Date(2023, 7, 5).toISOString(),
    rating: 4,
    notes: "",
  },
  {
    mangaId: "6",
    title: "Monster",
    coverImage: "https://placehold.co/300x450/jpeg",
    author: "Naoki Urasawa",
    genres: [MangaGenre.SEINEN, MangaGenre.THRILLER, MangaGenre.PSYCHOLOGICAL],
    ownershipStatus: OwnershipStatus.WANTED,
    readingStatus: ReadingStatus.UNREAD,
    addedAt: new Date(2023, 9, 3).toISOString(),
    rating: null,
    notes: "À acheter prochainement",
  },
];

export default function BibliothequePages() {
  const [activeTab, setActiveTab] = useState<"owned" | "wanted" | "all">("all");
  const [selectedReadingStatus, setSelectedReadingStatus] =
    useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter library based on active tab, reading status and search term
  const filteredLibrary = sampleLibrary.filter((item) => {
    // Filter by ownership status
    const matchesOwnership =
      activeTab === "all" ||
      (activeTab === "owned" &&
        item.ownershipStatus === OwnershipStatus.OWNED) ||
      (activeTab === "wanted" &&
        item.ownershipStatus === OwnershipStatus.WANTED);

    // Filter by reading status
    const matchesReadingStatus =
      selectedReadingStatus === "all" ||
      item.readingStatus === selectedReadingStatus;

    // Filter by search term
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesOwnership && matchesReadingStatus && matchesSearch;
  });

  // Calculate statistics
  const totalMangas = sampleLibrary.length;
  const ownedMangas = sampleLibrary.filter(
    (item) => item.ownershipStatus === OwnershipStatus.OWNED
  ).length;
  const wantedMangas = sampleLibrary.filter(
    (item) => item.ownershipStatus === OwnershipStatus.WANTED
  ).length;
  const readingMangas = sampleLibrary.filter(
    (item) => item.readingStatus === ReadingStatus.READING
  ).length;
  const completedMangas = sampleLibrary.filter(
    (item) => item.readingStatus === ReadingStatus.COMPLETED
  ).length;

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Ma Bibliothèque</h1>
          <p className="mt-2 text-gray-500">
            Gérez votre collection personnelle de mangas
          </p>
        </div>

        {/* Statistics cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total
            </h3>
            <p className="text-2xl font-bold">{totalMangas}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Je possède
            </h3>
            <p className="text-2xl font-bold">{ownedMangas}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Je veux
            </h3>
            <p className="text-2xl font-bold">{wantedMangas}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              En lecture
            </h3>
            <p className="text-2xl font-bold">{readingMangas}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Terminés
            </h3>
            <p className="text-2xl font-bold">{completedMangas}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            {/* Tab navigation */}
            <div className="inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 dark:bg-gray-800">
              <button
                onClick={() => setActiveTab("all")}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  activeTab === "all"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setActiveTab("owned")}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  activeTab === "owned"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Je possède
              </button>
              <button
                onClick={() => setActiveTab("wanted")}
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  activeTab === "wanted"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Je veux
              </button>
            </div>

            {/* Reading status filter */}
            <div className="flex items-center space-x-2">
              <label htmlFor="reading-status" className="text-sm font-medium">
                Statut de lecture:
              </label>
              <select
                id="reading-status"
                value={selectedReadingStatus}
                onChange={(e) => setSelectedReadingStatus(e.target.value)}
                className="rounded-md border border-input px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="all">Tous</option>
                <option value={ReadingStatus.UNREAD}>Non lu</option>
                <option value={ReadingStatus.READING}>En cours</option>
                <option value={ReadingStatus.COMPLETED}>Terminé</option>
                <option value={ReadingStatus.ON_HOLD}>En pause</option>
                <option value={ReadingStatus.DROPPED}>Abandonné</option>
              </select>
            </div>
          </div>

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
        </div>

        {/* Library content */}
        {filteredLibrary.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLibrary.map((item) => (
              <div
                key={item.mangaId}
                className="flex bg-white dark:bg-gray-800 rounded-lg shadow-sm border overflow-hidden"
              >
                <div className="relative w-24 h-36 bg-gray-100">
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col p-4 flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link
                        href={`/manga/${item.mangaId}`}
                        className="font-semibold hover:text-primary hover:underline"
                      >
                        {item.title}
                      </Link>
                      <p className="text-sm text-gray-500">{item.author}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                          item.ownershipStatus === OwnershipStatus.OWNED
                            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                        }`}
                      >
                        {item.ownershipStatus === OwnershipStatus.OWNED
                          ? "Je possède"
                          : "Je veux"}
                      </span>
                      <span className="mt-1 text-xs text-gray-500">
                        {new Date(item.addedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.genres.slice(0, 2).map((genre) => (
                      <span
                        key={genre}
                        className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold"
                      >
                        {genre.charAt(0).toUpperCase() +
                          genre.slice(1).replace("-", " ")}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex justify-between items-end">
                    <div>
                      <select
                        value={item.readingStatus}
                        className="mt-2 rounded-md border border-input px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        // In a real app, this would update the reading status in the database
                        onChange={() => {}}
                      >
                        <option value={ReadingStatus.UNREAD}>Non lu</option>
                        <option value={ReadingStatus.READING}>En cours</option>
                        <option value={ReadingStatus.COMPLETED}>Terminé</option>
                        <option value={ReadingStatus.ON_HOLD}>En pause</option>
                        <option value={ReadingStatus.DROPPED}>Abandonné</option>
                      </select>
                    </div>
                    {item.rating && (
                      <div className="flex items-center text-yellow-500">
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
                        <span className="text-sm">{item.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h3 className="mt-4 text-lg font-semibold">Aucun manga trouvé</h3>
            <p className="mt-2 text-sm text-gray-500">
              {activeTab !== "all"
                ? `Vous n'avez pas encore de mangas ${
                    activeTab === "owned"
                      ? "que vous possédez"
                      : "que vous voulez"
                  }.`
                : "Aucun manga ne correspond à vos critères de recherche."}
            </p>
            <div className="mt-6">
              <Link
                href="/catalogue"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Explorer le catalogue
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
