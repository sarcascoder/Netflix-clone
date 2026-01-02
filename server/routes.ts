import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Helper to ensure auth
  await setupAuth(app);
  registerAuthRoutes(app);

  app.get(api.movies.list.path, async (req, res) => {
    const genre = req.query.genre as string | undefined;
    const search = req.query.search as string | undefined;
    const featured = req.query.featured === 'true';
    
    const movies = await storage.getMovies({ genre, search, featured: featured ? true : undefined });
    res.json(movies);
  });

  app.get(api.movies.get.path, async (req, res) => {
    const movie = await storage.getMovie(Number(req.params.id));
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  });

  app.get(api.mylist.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const movies = await storage.getMyList(req.user!.id);
    res.json(movies);
  });

  app.post(api.mylist.add.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    try {
      const { movieId } = api.mylist.add.input.parse(req.body);
      const item = await storage.addToMyList(req.user!.id, movieId);
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.delete(api.mylist.remove.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    await storage.removeFromMyList(req.user!.id, Number(req.params.movieId));
    res.sendStatus(204);
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const movies = await storage.getMovies();
  if (movies.length === 0) {
    const sampleMovies = [
      {
        title: "Stranger Things",
        description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
        thumbnailUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=800&q=80",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        genre: "Sci-Fi",
        releaseYear: 2016,
        rating: "TV-14",
        duration: "4 Seasons",
        featured: true
      },
      {
        title: "The Crown",
        description: "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the twentieth century.",
        thumbnailUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800&q=80",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        genre: "Drama",
        releaseYear: 2016,
        rating: "TV-MA",
        duration: "6 Seasons",
        featured: false
      },
      {
        title: "Inception",
        description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
        thumbnailUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        genre: "Action",
        releaseYear: 2010,
        rating: "PG-13",
        duration: "2h 28m",
        featured: false
      },
      {
        title: "The Office",
        description: "A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.",
        thumbnailUrl: "https://images.unsplash.com/photo-1527068560086-64c8d55c7a33?w=800&q=80",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        genre: "Comedy",
        releaseYear: 2005,
        rating: "TV-14",
        duration: "9 Seasons",
        featured: false
      },
      {
        title: "Interstellar",
        description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
        thumbnailUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        genre: "Sci-Fi",
        releaseYear: 2014,
        rating: "PG-13",
        duration: "2h 49m",
        featured: false
      }
    ];

    for (const m of sampleMovies) {
      await storage.createMovie(m);
    }
  }
}
