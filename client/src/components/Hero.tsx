import { Link } from "wouter";
import { Play, Info } from "lucide-react";
import { type Movie } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MovieModal } from "./MovieModal";
import { useAddToMyList, useMyList } from "@/hooks/use-movies";
import { useAuth } from "@/hooks/use-auth";

interface HeroProps {
  movie: Movie;
}

export function Hero({ movie }: HeroProps) {
  const { data: myList } = useMyList();
  const { isAuthenticated } = useAuth();
  const addMutation = useAddToMyList();
  const removeMutation = useAddToMyList(); // Assuming you'd reuse logic or just pass handlers

  // Simple handler just for the modal reuse, in reality you'd share this logic more cleanly
  const isInMyList = myList?.some((item) => item.id === movie.id);
  const handleListToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) return window.location.href = "/api/login";
    // For hero, we might just add, or use the full hook logic. Simplified here:
    if (!isInMyList) addMutation.mutate(movie.id);
  };

  return (
    <div className="relative h-[85vh] w-full overflow-hidden">
      {/* Background - In a real app, this could be a video loop */}
      <div className="absolute inset-0">
        <img
          src={movie.thumbnailUrl} // Ideally a high-res backdrop
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute top-[30%] left-4 md:left-12 max-w-xl space-y-6 z-10">
        <h1 className="text-5xl md:text-7xl font-display font-bold text-white tracking-wide drop-shadow-2xl">
          {movie.title}
        </h1>
        
        <p className="text-lg md:text-xl text-white drop-shadow-md line-clamp-3">
          {movie.description}
        </p>

        <div className="flex gap-4 pt-4">
          <Link href={`/watch/${movie.id}`}>
            <Button className="bg-white text-black hover:bg-neutral-200 px-8 py-6 text-lg font-bold gap-2 rounded-md transition-transform active:scale-95">
              <Play className="fill-black w-6 h-6" /> Play
            </Button>
          </Link>

          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="secondary" 
                className="bg-neutral-500/70 text-white hover:bg-neutral-500/50 px-8 py-6 text-lg font-bold gap-2 rounded-md backdrop-blur-sm transition-transform active:scale-95"
              >
                <Info className="w-6 h-6" /> More Info
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-0 bg-[#181818] border-none text-white overflow-hidden">
               <MovieModal movie={movie} isInMyList={!!isInMyList} onToggleList={handleListToggle} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
