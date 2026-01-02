import { useState } from "react";
import { Link } from "wouter";
import { Play, Plus, ThumbsUp, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { type Movie } from "@shared/schema";
import { useAddToMyList, useRemoveFromMyList, useMyList } from "@/hooks/use-movies";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MovieModal } from "./MovieModal";

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

export function MovieCard({ movie, className }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { data: myList } = useMyList();
  const { isAuthenticated } = useAuth();
  
  const addMutation = useAddToMyList();
  const removeMutation = useRemoveFromMyList();

  const isInMyList = myList?.some((item) => item.id === movie.id);

  const handleListToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
        window.location.href = "/api/login";
        return;
    }
    if (isInMyList) {
      removeMutation.mutate(movie.id);
    } else {
      addMutation.mutate(movie.id);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div
          className={cn("relative cursor-pointer group rounded-md transition-all duration-300", className)}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          whileHover={{ scale: 1.05, zIndex: 10 }}
        >
          {/* Base Image */}
          <div className="aspect-video relative rounded-md overflow-hidden bg-zinc-800">
             {/* Descriptive alt text for accessibility */}
            <img 
              src={movie.thumbnailUrl} 
              alt={movie.title} 
              className="object-cover w-full h-full"
            />
            {/* Fallback title if image fails to load or for SEO */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
            
             {/* Title overlay on non-hover */}
             <div className="absolute bottom-0 left-0 p-2 w-full bg-gradient-to-t from-black/80 to-transparent opacity-100 group-hover:opacity-0 transition-opacity">
                <p className="text-xs font-semibold text-white truncate">{movie.title}</p>
             </div>
          </div>

          {/* Hover Expanded Card Content - This would typically be a portal or absolute positioned overlay in a real Netflix clone to break container bounds, 
              but for simplicity we are keeping it contained or using scale */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-zinc-900 rounded-md shadow-xl flex flex-col justify-between p-3 z-20 border border-zinc-700"
              >
                <div className="relative w-full h-24 mb-2 overflow-hidden rounded-sm">
                   <img 
                      src={movie.thumbnailUrl} 
                      alt={movie.title} 
                      className="object-cover w-full h-full"
                    />
                     <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center pl-1 hover:scale-110 transition-transform shadow-lg">
                           <Play className="fill-black text-black w-5 h-5" />
                        </div>
                     </div>
                </div>

                <div>
                   <div className="flex items-center gap-2 mb-2">
                      <Link href={`/watch/${movie.id}`}>
                        <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-neutral-200 transition-colors">
                           <Play className="w-4 h-4 fill-black text-black" />
                        </button>
                      </Link>
                      
                      <button 
                        onClick={handleListToggle}
                        className="w-8 h-8 rounded-full border-2 border-neutral-400 flex items-center justify-center hover:border-white hover:bg-white/10 transition-all text-white"
                        title={isInMyList ? "Remove from My List" : "Add to My List"}
                      >
                         {isInMyList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </button>

                      <button className="w-8 h-8 rounded-full border-2 border-neutral-400 flex items-center justify-center hover:border-white hover:bg-white/10 transition-all text-white ml-auto">
                         <ThumbsUp className="w-3 h-3" />
                      </button>
                   </div>

                   <div className="text-white text-xs space-y-1">
                      <div className="flex items-center gap-2 text-[10px] font-semibold">
                         <span className="text-green-500">98% Match</span>
                         <span className="border border-neutral-500 px-1 rounded-[2px]">{movie.rating}</span>
                         <span>{movie.duration}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 text-neutral-400 text-[10px]">
                         {movie.genre.split(',').slice(0, 3).map((g, i) => (
                            <span key={i}>{g}{i < 2 ? ' •' : ''}</span>
                         ))}
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl p-0 bg-[#181818] border-none text-white overflow-hidden dialog-content">
         <MovieModal movie={movie} isInMyList={!!isInMyList} onToggleList={handleListToggle} />
      </DialogContent>
    </Dialog>
  );
}
