import Image from "next/image";
import Link from "next/link";
import FeaturedManga from "@/components/sections/FeaturedManga";

export default function Home() {
  return (
    <div className="flex flex-col gap-12 pb-8">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-primary/20 to-primary/5">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Découvrez et gérez votre collection de mangas
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  MangaApp vous permet de découvrir de nouveaux mangas, suivre
                  votre collection et organiser vos lectures facilement.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link
                  href="/catalogue"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Explorer le catalogue
                </Link>
                <Link
                  href="/auth"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Créer un compte
                </Link>
              </div>
            </div>
            <div className="mx-auto lg:ml-auto flex justify-center">
              <Image
                alt="Manga Collection"
                className="rounded-lg object-cover object-center"
                height={400}
                src="https://placehold.co/600x400/jpeg"
                width={600}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Mangas Section */}
      <section className="container px-4 md:px-6 py-6">
        <FeaturedManga />
      </section>

      {/* Features Section */}
      <section className="container px-4 md:px-6 py-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div className="flex flex-col gap-4 text-center">
          <h2 className="text-2xl font-bold tracking-tight">Fonctionnalités</h2>
          <p className="text-gray-500 md:text-lg/relaxed mx-auto max-w-[700px]">
            MangaApp vous offre tout ce dont vous avez besoin pour gérer votre
            passion pour les mangas.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="rounded-full bg-primary/10 p-4">
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
                className="text-primary h-6 w-6"
              >
                <path d="M12 20V4"></path>
                <path d="M5 12H4a9 9 0 0 0 0 18h1"></path>
                <path d="M19 12h1a9 9 0 0 1 0 18h-1"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Découvrez</h3>
            <p className="text-gray-500">
              Explorez une vaste collection de mangas avec des informations
              détaillées.
            </p>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <div className="rounded-full bg-primary/10 p-4">
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
                className="text-primary h-6 w-6"
              >
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Collectionnez</h3>
            <p className="text-gray-500">
              Gérez votre bibliothèque personnelle et suivez les mangas que vous
              possédez.
            </p>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <div className="rounded-full bg-primary/10 p-4">
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
                className="text-primary h-6 w-6"
              >
                <path d="M12 6v6l4 2"></path>
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Suivez</h3>
            <p className="text-gray-500">
              Gardez une trace de vos lectures et de votre progression dans
              chaque série.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
