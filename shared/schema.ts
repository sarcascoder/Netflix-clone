import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const movies = pgTable("movies", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  videoUrl: text("video_url").notNull(),
  genre: text("genre").notNull(),
  releaseYear: integer("release_year").notNull(),
  rating: text("rating").notNull(), // e.g. "PG-13", "TV-MA"
  duration: text("duration").notNull(), // e.g. "1h 45m"
  featured: boolean("featured").default(false),
  cast: text("cast").array(),
  director: text("director"),
  maturityRating: text("maturity_rating"), // e.g. "Adults", "Teens"
  type: text("type").notNull().default("movie"), // "movie" or "tv"
});

export const myList = pgTable("my_list", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // Linked to Replit Auth user ID (which might be int or string, usually int in our schema if we map it)
  movieId: integer("movie_id").notNull(),
});

// We need a users table to satisfy Replit Auth if we want to store extra data, 
// but Replit Auth blueprint often handles the session. 
// However, typically we map the Replit user to a local user record.
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  // Replit auth doesn't expose password, so we don't store it.
  // We might store external ID or just trust the session.
  // For simplicity with the standard auth blueprint, we'll keep a minimal users table
  // but often the blueprint sets up its own or we just use the session.
  // Let's assume we store the user to link MyList.
});

export const insertMovieSchema = createInsertSchema(movies).omit({ id: true });
export const insertMyListSchema = createInsertSchema(myList).omit({ id: true });
export const insertUserSchema = createInsertSchema(users).omit({ id: true });

export type Movie = typeof movies.$inferSelect;
export type InsertMovie = z.infer<typeof insertMovieSchema>;
export type MyListItem = typeof myList.$inferSelect;
export type InsertMyList = z.infer<typeof insertMyListSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export * from "./models/auth";
