import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MovieCard } from "./MovieCard";
import { type Movie } from "@shared/schema";
import { cn } from "@/lib/utils";

interface CarouselRowProps {
  title: string;
  movies: Movie[];
}

export function CarouselRow({ title, movies }: CarouselRowProps) {
  // Using Embla Carousel for smooth sliding
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: false, align: "start", slidesToScroll: "auto" }
  );

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  if (!movies || movies.length === 0) return null;

  return (
    <div className="mb-12 relative group/row">
      <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 px-4 md:px-12 hover:text-primary transition-colors cursor-pointer">
        {title}
      </h2>

      <div className="relative group">
        <button 
          onClick={scrollPrev}
          className="absolute left-0 top-0 bottom-0 z-30 w-12 bg-black/50 hover:bg-black/80 hidden group-hover/row:flex items-center justify-center transition-opacity opacity-0 group-hover/row:opacity-100"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>

        <div className="overflow-hidden px-4 md:px-12" ref={emblaRef}>
          <div className="flex gap-4">
            {movies.map((movie) => (
              <div key={movie.id} className="flex-[0_0_45%] sm:flex-[0_0_30%] md:flex-[0_0_20%] lg:flex-[0_0_16%] min-w-0">
                <MovieCard movie={movie} className="w-full h-full" />
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={scrollNext}
          className="absolute right-0 top-0 bottom-0 z-30 w-12 bg-black/50 hover:bg-black/80 hidden group-hover/row:flex items-center justify-center transition-opacity opacity-0 group-hover/row:opacity-100"
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>
      </div>
    </div>
  );
}
