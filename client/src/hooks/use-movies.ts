import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { type Movie, type MyListItem } from "@shared/schema";

// GET /api/movies (Optional filtering)
export function useMovies(filters?: { search?: string; genre?: string; featured?: boolean; type?: string }) {
  return useQuery({
    queryKey: [api.movies.list.path, filters],
    queryFn: async () => {
      // Build query string manually or use URLSearchParams
      const url = new URL(api.movies.list.path, window.location.origin);
      if (filters?.search) url.searchParams.append("search", filters.search);
      if (filters?.genre) url.searchParams.append("genre", filters.genre);
      if (filters?.featured !== undefined) url.searchParams.append("featured", String(filters.featured));
      if (filters?.type) url.searchParams.append("type", filters.type);

      const res = await fetch(url.toString(), { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch movies");
      return api.movies.list.responses[200].parse(await res.json());
    },
  });
}

// GET /api/movies/:id
export function useMovie(id: number) {
  return useQuery({
    queryKey: [api.movies.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.movies.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch movie");
      return api.movies.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

// GET /api/mylist
export function useMyList() {
  return useQuery({
    queryKey: [api.mylist.list.path],
    queryFn: async () => {
      const res = await fetch(api.mylist.list.path, { credentials: "include" });
      if (res.status === 401) return null; // Handle unauthorized gracefully
      if (!res.ok) throw new Error("Failed to fetch my list");
      return api.mylist.list.responses[200].parse(await res.json());
    },
  });
}

// POST /api/mylist
export function useAddToMyList() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (movieId: number) => {
      const res = await fetch(api.mylist.add.path, {
        method: api.mylist.add.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId }),
        credentials: "include",
      });

      if (res.status === 401) throw new Error("Please login to add to list");
      if (!res.ok) throw new Error("Failed to add to list");
      return api.mylist.add.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.mylist.list.path] });
      toast({
        title: "Added to My List",
        description: "This title has been added to your list.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

// DELETE /api/mylist/:movieId
export function useRemoveFromMyList() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (movieId: number) => {
      const url = buildUrl(api.mylist.remove.path, { movieId });
      const res = await fetch(url, {
        method: api.mylist.remove.method,
        credentials: "include",
      });

      if (res.status === 401) throw new Error("Please login to remove from list");
      if (!res.ok) throw new Error("Failed to remove from list");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.mylist.list.path] });
      toast({
        title: "Removed from My List",
        description: "This title has been removed from your list.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
