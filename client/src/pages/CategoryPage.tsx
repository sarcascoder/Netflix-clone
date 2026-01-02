import { useMovies } from "@/hooks/use-movies";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { CarouselRow } from "@/components/CarouselRow";
import { Loader2 } from "lucide-react";

interface CategoryPageProps {
  type?: "movie" | "tv";
  title?: string;
}

export default function CategoryPage({ type, title }: CategoryPageProps) {
  const { data: movies, isLoading } = useMovies(type ? { type } : undefined);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!movies) return null;

  const featuredMovie = movies.find(m => m.featured) || movies[0];
  
  // Group by genre
  const genres = [...new Set(movies.map(m => m.genre))];

  return (
    <div className="min-h-screen bg-[#141414] text-white pb-20">
      <Navbar />
      
      {featuredMovie && <Hero movie={featuredMovie} />}

      <div className="-mt-32 relative z-20 space-y-4">
        {title && <h1 className="px-4 md:px-12 text-3xl font-bold mb-4">{title}</h1>}
        {genres.map(genre => {
          const genreMovies = movies.filter(m => m.genre === genre);
          return (
            <CarouselRow 
              key={genre} 
              title={genre} 
              movies={genreMovies} 
            />
          );
        })}
      </div>
    </div>
  );
}
