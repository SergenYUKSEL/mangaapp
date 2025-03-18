import { useQuery } from "react-query";
import { MangaService } from "../services/manga.service";
import { MangaFilters } from "../services/types";

export const useMangaSearch = (filters: MangaFilters) => {
  return useQuery(
    ["mangas", filters],
    () => MangaService.searchManga(filters),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

export const useMangaDetails = (id: string) => {
  return useQuery(["manga", id], () => MangaService.getMangaById(id), {
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
