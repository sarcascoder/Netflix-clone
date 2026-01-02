import { Link, useParams } from "wouter";
import { useMovie } from "@/hooks/use-movies";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function Watch() {
  const { id } = useParams();
  const { data: movie, isLoading } = useMovie(Number(id));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white gap-4">
        <h1 className="text-2xl">Title not found</h1>
        <Link href="/" className="text-neutral-400 hover:text-white underline">Back to Browse</Link>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden group">
      {/* Back Button (appears on hover) */}
      <Link href="/">
        <div className="absolute top-4 left-4 z-50 p-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <div className="flex items-center gap-2 text-white bg-black/50 px-4 py-2 rounded-full hover:bg-black/80">
              <ArrowLeft className="w-6 h-6" />
              <span className="font-bold">Back to Browse</span>
           </div>
        </div>
      </Link>

      {/* Video Player Mockup */}
      <div className="w-full h-full flex items-center justify-center relative">
         {/* In a real app, this would be a <video> tag or player component */}
         <video 
            className="w-full h-full object-contain"
            controls
            autoPlay
            poster={movie.thumbnailUrl}
            src={movie.videoUrl || "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"} // Fallback for demo
         >
            Your browser does not support the video tag.
         </video>
         
         <div className="absolute bottom-20 left-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-white drop-shadow-lg">
            <h2 className="text-2xl font-bold">{movie.title}</h2>
            <p className="text-lg opacity-80">{movie.genre} • {movie.rating}</p>
         </div>
      </div>
    </div>
  );
}
