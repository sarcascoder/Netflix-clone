import { useMyList } from "@/hooks/use-movies";
import { Navbar } from "@/components/Navbar";
import { MovieCard } from "@/components/MovieCard";
import { Loader2, Plus } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function MyList() {
  const { data: movies, isLoading, isError } = useMyList();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  // Handle unauthorized state (typically handled by router guard, but doubled here)
  if (isError || movies === null) {
      return (
         <div className="min-h-screen bg-[#141414] text-white flex flex-col items-center justify-center space-y-4">
             <Navbar />
             <h2 className="text-3xl font-bold">Please Log In</h2>
             <p className="text-neutral-400">Sign in to view and manage your list.</p>
             <Button 
               className="bg-primary hover:bg-primary/80" 
               onClick={() => window.location.href = "/api/login"}
             >
               Sign In
             </Button>
         </div>
      )
  }

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Navbar />
      
      <div className="pt-24 px-4 md:px-12 pb-20">
        <h1 className="text-3xl font-bold mb-8">My List</h1>

        {movies && movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 gap-y-8">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} className="w-full" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
             <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-500">
                <Plus className="w-8 h-8" />
             </div>
             <p className="text-xl text-neutral-400">You haven't added any titles to your list yet.</p>
             <Link href="/">
               <Button variant="outline" className="border-white/50 text-white hover:bg-white/10 hover:border-white">
                 Browse Content
               </Button>
             </Link>
          </div>
        )}
      </div>
    </div>
  );
}
