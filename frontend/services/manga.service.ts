import axios from "axios";
import {
  MangaResponse,
  MangaFilters,
  Manga,
  Relationship,
  AuthorAttributes,
  VolumeAggregate,
  Volume,
  VolumeResponse,
  VolumeData,
  VolumeChapter,
} from "./types";

const MANGADEX_API_URL = "https://api.mangadex.org";

export class MangaService {
  static async searchManga(filters: MangaFilters): Promise<MangaResponse> {
    const params = {
      title: filters.title,
      year: filters.year,
      status: filters.status,
      order: filters.orderBy,
      limit: filters.limit || 20,
      offset: filters.offset || 0,
      "includes[]": ["cover_art", "author", "artist"],
      "contentRating[]": ["safe", "suggestive"],
    };

    const response = await axios.get(`${MANGADEX_API_URL}/manga`, { params });

    // Filtrer et transformer les résultats pour avoir les titres en français
    const data = response.data.data.filter((manga: Manga) => {
      return (
        manga.attributes.altTitles?.some(
          (title: { [key: string]: string }) => title.fr
        ) || false
      );
    });

    // Transformer les données pour inclure les titres français
    const transformedData = data.map((manga: Manga) => {
      return {
        ...manga,
        attributes: {
          ...manga.attributes,
          title: this.getFrenchTitle(manga),
          description:
            manga.attributes.description?.fr ||
            manga.attributes.description?.en ||
            "",
        },
      };
    });

    return {
      ...response.data,
      data: transformedData,
      total: transformedData.length,
    };
  }

  static async getMangaById(id: string): Promise<Manga> {
    const response = await axios.get(
      `${MANGADEX_API_URL}/manga/${id}?includes[]=cover_art&includes[]=author&includes[]=artist`
    );

    const manga = response.data.data;

    // Transformer les données pour utiliser les titres français
    return {
      ...manga,
      attributes: {
        ...manga.attributes,
        title: this.getFrenchTitle(manga),
        description:
          manga.attributes.description?.fr ||
          manga.attributes.description?.en ||
          "",
      },
    };
  }

  static getCoverImageUrl(manga: Manga | Volume): string {
    const coverArt = manga.relationships.find(
      (rel: Relationship) => rel.type === "cover_art"
    );

    if (coverArt?.attributes && "fileName" in coverArt.attributes) {
      const fileName = coverArt.attributes.fileName;
      // For volumes, extract the manga ID from the volume ID (format: mangaId-vol-number)
      const mangaId =
        "volume" in manga.attributes ? manga.id.split("-vol-")[0] : manga.id;

      // Use the 256px thumbnail version for better performance
      return `https://uploads.mangadex.org/covers/${mangaId}/${fileName}.256.jpg`;
    }

    return "/placeholder-cover.jpg";
  }

  static getAuthor(manga: Manga): string {
    const author = manga.relationships.find((rel) => rel.type === "author");
    if (author?.attributes && "name" in author.attributes) {
      return author.attributes.name;
    }
    return "Auteur inconnu";
  }

  static formatTitle(manga: Manga | Volume): string {
    if ("volume" in manga.attributes) {
      return `Tome ${manga.attributes.volume}`;
    }
    return (
      manga.attributes.title.fr ||
      manga.attributes.title.en ||
      Object.values(manga.attributes.title)[0] ||
      "Titre inconnu"
    );
  }

  static getFrenchTitle(manga: Manga): string {
    if (!manga?.attributes) return "Titre inconnu";

    // Cherche d'abord dans le titre principal
    if (manga.attributes.title.fr) {
      return manga.attributes.title.fr;
    }

    // Cherche ensuite dans les titres alternatifs
    if (manga.attributes.altTitles) {
      const frenchTitle = manga.attributes.altTitles.find(
        (title: { [key: string]: string }) => title.fr
      );
      if (frenchTitle?.fr) {
        return frenchTitle.fr;
      }
    }

    // Si aucun titre français n'est trouvé, utilise le titre anglais
    const englishTitle =
      manga.attributes.altTitles?.find(
        (title: { [key: string]: string }) => title.en
      )?.en || manga.attributes.title.en;

    if (englishTitle) {
      return englishTitle;
    }

    // En dernier recours, utilise le premier titre disponible
    return Object.values(manga.attributes.title)[0] || "Titre inconnu";
  }

  static async getPopularVolumes(
    limit: number = 20,
    offset: number = 0
  ): Promise<VolumeResponse> {
    // On demande plus de résultats pour compenser le filtrage
    const response = await axios.get(`${MANGADEX_API_URL}/manga`, {
      params: {
        limit: limit * 5, // On multiplie la limite pour avoir assez de résultats après filtrage
        offset,
        "includes[]": ["cover_art", "author", "artist"],
        "order[followedCount]": "desc",
        "contentRating[]": ["safe", "suggestive"],
        "publicationDemographic[]": ["shounen", "seinen", "josei", "shoujo"],
      },
    });

    // Transformer les mangas en volumes
    const volumes = response.data.data
      .filter((manga: Manga) => {
        // On vérifie d'abord si le manga a une traduction française
        const hasFrenchTitle =
          manga.attributes.altTitles?.some(
            (title: { [key: string]: string }) => title.fr
          ) || manga.attributes.title.fr;

        // On vérifie aussi si le manga est disponible en français
        const isAvailableInFrench =
          manga.attributes.availableTranslatedLanguages?.includes("fr");

        return hasFrenchTitle || isAvailableInFrench;
      })
      .map((manga: Manga) => {
        const coverArt = manga.relationships.find(
          (rel: Relationship) => rel.type === "cover_art"
        );

        const title = this.getFrenchTitle(manga);

        return {
          id: manga.id,
          type: "volume" as const,
          attributes: {
            volume: manga.attributes.lastVolume || "1",
            title: `${title} - Tome ${manga.attributes.lastVolume || "1"}`,
            publishAt: manga.attributes.createdAt,
            coverArt: null,
            description:
              manga.attributes.description?.fr ||
              manga.attributes.description?.en ||
              "",
            price: null,
            rating: {
              average: 0,
              votes: 0,
            },
          },
          relationships: [
            ...(coverArt ? [coverArt] : []),
            ...manga.relationships.filter(
              (rel: Relationship) => rel.type !== "cover_art"
            ),
          ],
        };
      })
      .slice(0, limit); // On limite au nombre demandé

    return {
      result: "ok",
      data: volumes,
      limit,
      offset,
      total: volumes.length,
    };
  }

  static async getVolumesByMangaId(mangaId: string): Promise<VolumeResponse> {
    const [mangaResponse, aggregateResponse, coversResponse] =
      await Promise.all([
        axios.get(`${MANGADEX_API_URL}/manga/${mangaId}?includes[]=cover_art`),
        axios.get(`${MANGADEX_API_URL}/manga/${mangaId}/aggregate`),
        axios.get(`${MANGADEX_API_URL}/cover`, {
          params: {
            "manga[]": [mangaId],
            "order[volume]": "asc",
            "locales[]": ["fr", "ja", "en"],
            limit: 100,
          },
        }),
      ]);

    const manga = mangaResponse.data.data;
    const volumes = aggregateResponse.data.volumes;
    const covers = coversResponse.data.data;

    // Créer un Map pour stocker les meilleures couvertures par volume
    const bestCovers = new Map<string, (typeof covers)[0]>();

    // Définir l'ordre de priorité des langues
    const languagePriority = ["fr", "en", "ja"];

    // Sélectionner les meilleures couvertures selon la priorité des langues
    covers.forEach(
      (cover: {
        attributes: { volume: string; locale: string; fileName: string };
        id: string;
      }) => {
        const vol = Number(cover.attributes.volume);
        if (!isNaN(vol) && Number.isInteger(vol) && vol > 0) {
          const volumeNumber = cover.attributes.volume;
          const existingCover = bestCovers.get(volumeNumber);
          const currentPriority = languagePriority.indexOf(
            cover.attributes.locale
          );
          const existingPriority = existingCover
            ? languagePriority.indexOf(existingCover.attributes.locale)
            : -1;

          // Remplacer si la nouvelle couverture a une priorité plus élevée
          if (
            !existingCover ||
            (currentPriority !== -1 && currentPriority < existingPriority)
          ) {
            bestCovers.set(volumeNumber, cover);
          }
        }
      }
    );

    // Transformer les volumes en objets Volume
    const volumeObjects = Object.entries(volumes)
      .filter(([volumeNumber]) => volumeNumber !== "none") // Exclure les chapitres sans volume
      .map(([volumeNumber, volumeData]) => {
        const cover = bestCovers.get(volumeNumber);
        return {
          id: `${mangaId}-vol-${volumeNumber}`,
          type: "volume" as const,
          attributes: {
            volume: volumeNumber,
            title: `Tome ${volumeNumber}`,
            publishAt: manga.attributes.createdAt,
            coverArt: null,
            description: manga.attributes.description?.fr || "",
            price: null,
            rating: {
              average: 0,
              votes: 0,
            },
          },
          relationships: [
            ...(cover
              ? [
                  {
                    id: cover.id,
                    type: "cover_art",
                    attributes: {
                      fileName: cover.attributes.fileName,
                      locale: cover.attributes.locale,
                    },
                  },
                ]
              : []),
            ...manga.relationships.filter(
              (rel: Relationship) => rel.type !== "cover_art"
            ),
          ],
        } as Volume;
      })
      // Trier par numéro de tome
      .sort(
        (a: Volume, b: Volume) =>
          parseInt(a.attributes.volume) - parseInt(b.attributes.volume)
      );

    return {
      result: "ok",
      data: volumeObjects,
      limit: volumeObjects.length,
      offset: 0,
      total: volumeObjects.length,
    };
  }

  static async getVolumesByAuthor(authorId: string): Promise<VolumeResponse> {
    const response = await axios.get(`${MANGADEX_API_URL}/manga`, {
      params: {
        limit: 12,
        offset: 0,
        includes: ["cover_art"],
        "authors[]": [authorId],
        "order[followedCount]": "desc",
        "contentRating[]": ["safe", "suggestive"],
        "availableTranslatedLanguage[]": ["fr"],
        hasAvailableChapters: true,
      },
    });

    const volumes = response.data.data.map((manga: Manga) => ({
      id: manga.id,
      type: "volume" as const,
      attributes: {
        volume: manga.attributes.lastVolume || "1",
        title: this.formatTitle(manga),
        publishAt: manga.attributes.createdAt,
        coverArt: null,
        description:
          manga.attributes.description?.fr ||
          manga.attributes.description?.en ||
          "",
        price: null,
        rating: {
          average: 0,
          votes: 0,
        },
      },
      relationships: manga.relationships,
    }));

    return {
      result: "ok",
      data: volumes,
      limit: volumes.length,
      offset: 0,
      total: volumes.length,
    };
  }

  static async getVolumeRating(volumeId: string): Promise<number> {
    const response = await axios.get(
      `${MANGADEX_API_URL}/volume/${volumeId}/rating`
    );
    return response.data.average || 0;
  }

  static async setVolumeRating(
    volumeId: string,
    rating: number
  ): Promise<void> {
    await axios.post(`${MANGADEX_API_URL}/volume/${volumeId}/rating`, {
      rating,
    });
  }
}
