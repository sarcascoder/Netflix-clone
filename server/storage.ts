import { db } from "./db";
import {
  movies,
  myList,
  users,
  type User,
  type InsertUser,
  type Movie,
  type InsertMovie,
  type MyListItem,
  type InsertMyList
} from "@shared/schema";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Movies
  getMovies(params?: { search?: string; genre?: string; featured?: boolean; type?: string }): Promise<Movie[]>;
  getMovie(id: number): Promise<Movie | undefined>;
  createMovie(movie: InsertMovie): Promise<Movie>;
  
  // My List
  getMyList(userId: number): Promise<Movie[]>; // Returns the movies, not the join rows
  addToMyList(userId: number, movieId: number): Promise<MyListItem>;
  removeFromMyList(userId: number, movieId: number): Promise<void>;
  
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  async getMovies(params?: { search?: string; genre?: string; featured?: boolean; type?: string }): Promise<Movie[]> {
    let query = db.select().from(movies);
    
    // Simple in-memory filtering logic for now if we don't build complex dynamic queries
    // Or we can use .where() with conditions.
    const conditions = [];
    if (params?.genre) conditions.push(eq(movies.genre, params.genre));
    if (params?.featured !== undefined) conditions.push(eq(movies.featured, params.featured));
    if (params?.type) conditions.push(eq(movies.type, params.type));
    
    // Search would use ilike, but let's just return all and filter if needed or implement properly
    if (conditions.length > 0) {
      // @ts-ignore - simple and/or handling
      return await db.select().from(movies).where(and(...conditions));
    }
    
    const results = await db.select().from(movies);
    if (params?.search) {
      const lowerSearch = params.search.toLowerCase();
      return results.filter(m => m.title.toLowerCase().includes(lowerSearch));
    }
    return results;
  }

  async getMovie(id: number): Promise<Movie | undefined> {
    const [movie] = await db.select().from(movies).where(eq(movies.id, id));
    return movie;
  }

  async createMovie(movie: InsertMovie): Promise<Movie> {
    const [newMovie] = await db.insert(movies).values(movie).returning();
    return newMovie;
  }

  async getMyList(userId: number): Promise<Movie[]> {
    const listItems = await db.select()
      .from(myList)
      .where(eq(myList.userId, userId));
      
    if (listItems.length === 0) return [];
    
    const movieIds = listItems.map(item => item.movieId);
    
    // Fetch movies
    // Drizzle's `inArray` would be good here, but for now let's just select all and filter or do individual gets (inefficient but safe for MVP)
    // Better:
    // return await db.select().from(movies).where(inArray(movies.id, movieIds));
    // Since I didn't import inArray, I'll do a raw query or loop. 
    // Let's rely on standard select for MVP
    
    const allMovies = await db.select().from(movies);
    return allMovies.filter(m => movieIds.includes(m.id));
  }

  async addToMyList(userId: number, movieId: number): Promise<MyListItem> {
    const [item] = await db.insert(myList).values({ userId, movieId }).returning();
    return item;
  }

  async removeFromMyList(userId: number, movieId: number): Promise<void> {
    await db.delete(myList)
      .where(and(eq(myList.userId, userId), eq(myList.movieId, movieId)));
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }
}

export const storage = new DatabaseStorage();
