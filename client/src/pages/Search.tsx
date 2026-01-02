import { useState, useEffect } from "react";
import { useMovies } from "@/hooks/use-movies";
import { Navbar } from "@/components/Navbar";
import { MovieCard } from "@/components/MovieCard";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce"; // We'll implement this inline if needed, but standard hook is better.
// Implementing simple debounce inside component for simplicity or standard hook

function useDebounceValue(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounceValue(searchTerm, 500);
  
  const { data: movies, isLoading } = useMovies({ search: debouncedSearch });

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Navbar />
      
      <div className="pt-24 px-4 md:px-12">
        <div className="max-w-xl mx-auto mb-12 relative">
           <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
           <Input 
             className="w-full bg-black/50 border-zinc-700 h-14 pl-12 text-lg text-white placeholder:text-zinc-500 focus:border-white focus:ring-0 rounded-none transition-colors"
             placeholder="Titles, people, genres"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             autoFocus
           />
        </div>

        {isLoading ? (
          <div className="flex justify-center pt-20">
             <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
          <div>
            {movies && movies.length > 0 ? (
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 gap-y-8">
                  {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} className="w-full" />
                  ))}
               </div>
            ) : (
              debouncedSearch && (
                <div className="text-center text-zinc-400 pt-20">
                   <p className="text-xl">Your search for "{debouncedSearch}" did not find any matches.</p>
                   <p className="mt-2 text-sm">Suggestions:</p>
                   <ul className="text-sm mt-1 list-inside">
                      <li>Try different keywords</li>
                      <li>Looking for a movie or TV show?</li>
                      <li>Try using a movie title, actor name, or genre</li>
                   </ul>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
