import { Link } from "wouter";
import { Play, Plus, Check, ThumbsUp, Volume2, X } from "lucide-react";
import { type Movie } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface MovieModalProps {
  movie: Movie;
  isInMyList: boolean;
  onToggleList: (e: React.MouseEvent) => void;
}

export function MovieModal({ movie, isInMyList, onToggleList }: MovieModalProps) {
  return (
    <div className="relative w-full overflow-y-auto max-h-[90vh]">
      {/* Hero Header in Modal */}
      <div className="relative aspect-video w-full">
        <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent z-10" />
        <img 
          src={movie.thumbnailUrl} 
          alt={movie.title} 
          className="w-full h-full object-cover"
        />
        
        <div className="absolute bottom-8 left-8 z-20 w-2/3">
          <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">{movie.title}</h2>
          
          <div className="flex items-center gap-3 mb-6">
             <Link href={`/watch/${movie.id}`}>
               <Button className="bg-white text-black hover:bg-neutral-200 px-8 py-6 text-lg font-bold gap-2">
                 <Play className="fill-black w-6 h-6" /> Play
               </Button>
             </Link>
             
             <Button 
                variant="outline" 
                className="border-2 border-neutral-400 bg-transparent text-white hover:bg-neutral-800 hover:text-white hover:border-white h-12 w-12 rounded-full p-0"
                onClick={onToggleList}
             >
                {isInMyList ? <Check className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
             </Button>
             
             <Button variant="outline" className="border-2 border-neutral-400 bg-transparent text-white hover:bg-neutral-800 hover:text-white hover:border-white h-12 w-12 rounded-full p-0">
                <ThumbsUp className="w-5 h-5" />
             </Button>
          </div>
        </div>

        <div className="absolute bottom-8 right-8 z-20">
           <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white bg-black/20 rounded-full">
              <Volume2 className="w-6 h-6" />
           </Button>
        </div>
      </div>

      {/* Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 p-8 md:p-12 pt-4">
        <div className="space-y-6">
           <div className="flex items-center gap-3 text-lg">
              <span className="text-green-500 font-bold">98% Match</span>
              <span className="text-neutral-400">{movie.releaseYear}</span>
              <span className="border border-neutral-500 px-2 rounded text-sm py-0.5">{movie.rating}</span>
              <span className="text-neutral-400">{movie.duration}</span>
              <span className="border border-neutral-500 text-[10px] px-1 rounded text-neutral-300">HD</span>
           </div>
           
           <p className="text-white text-lg leading-relaxed">
             {movie.description}
           </p>
        </div>

        <div className="space-y-4 text-sm">
           <div>
              <span className="text-neutral-500">Cast: </span>
              <span className="text-white hover:underline cursor-pointer">Example Actor, Another Actor, Famous Star</span>
           </div>
           <div>
              <span className="text-neutral-500">Genres: </span>
              <span className="text-white hover:underline cursor-pointer">{movie.genre}</span>
           </div>
           <div>
              <span className="text-neutral-500">This show is: </span>
              <span className="text-white hover:underline cursor-pointer">Exciting, Suspenseful</span>
           </div>
        </div>
      </div>
    </div>
  );
}
