import { useMovies } from "@/hooks/use-movies";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { CarouselRow } from "@/components/CarouselRow";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { data: movies, isLoading } = useMovies();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!movies) return null;

  // Filter movies for different sections
  const featuredMovie = movies.find(m => m.featured) || movies[0];
  const trendingMovies = movies.slice(0, 10);
  const actionMovies = movies.filter(m => m.genre.includes("Action"));
  const comedyMovies = movies.filter(m => m.genre.includes("Comedy"));
  const dramaMovies = movies.filter(m => m.genre.includes("Drama"));
  const sciFiMovies = movies.filter(m => m.genre.includes("Sci-Fi"));

  return (
    <div className="min-h-screen bg-[#141414] text-white pb-20">
      <Navbar />
      
      {featuredMovie && <Hero movie={featuredMovie} />}

      <div className="-mt-32 relative z-20 space-y-4">
        <CarouselRow title="Trending Now" movies={trendingMovies} />
        {actionMovies.length > 0 && <CarouselRow title="Adrenaline-Pumping Action" movies={actionMovies} />}
        {comedyMovies.length > 0 && <CarouselRow title="Laugh-Out-Loud Comedies" movies={comedyMovies} />}
        {dramaMovies.length > 0 && <CarouselRow title="Critically Acclaimed Dramas" movies={dramaMovies} />}
        {sciFiMovies.length > 0 && <CarouselRow title="Sci-Fi & Fantasy" movies={sciFiMovies} />}
      </div>
    </div>
  );
}
