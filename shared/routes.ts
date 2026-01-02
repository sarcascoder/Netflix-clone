import { z } from 'zod';
import { insertMovieSchema, insertMyListSchema, movies, myList } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  movies: {
    list: {
      method: 'GET' as const,
      path: '/api/movies',
      input: z.object({
        search: z.string().optional(),
        genre: z.string().optional(),
        featured: z.coerce.boolean().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof movies.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/movies/:id',
      responses: {
        200: z.custom<typeof movies.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  mylist: {
    list: {
      method: 'GET' as const,
      path: '/api/mylist',
      responses: {
        200: z.array(z.custom<typeof movies.$inferSelect>()), // Returns movies in the list
        401: errorSchemas.unauthorized,
      },
    },
    add: {
      method: 'POST' as const,
      path: '/api/mylist',
      input: z.object({ movieId: z.number() }),
      responses: {
        201: z.custom<typeof myList.$inferSelect>(),
        401: errorSchemas.unauthorized,
        400: errorSchemas.validation,
      },
    },
    remove: {
      method: 'DELETE' as const,
      path: '/api/mylist/:movieId',
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
