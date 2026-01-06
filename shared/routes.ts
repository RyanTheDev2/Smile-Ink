import { z } from 'zod';
import { posts, teamMembers, reviews, insertPostSchema, insertTeamMemberSchema } from './schema';

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
};

export const api = {
  posts: {
    list: {
      method: 'GET' as const,
      path: '/api/posts',
      input: z.object({
        type: z.enum(['hiring', 'for_hire']).optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof posts.$inferSelect>()),
      },
    },
  },
  reviews: {
    list: {
      method: 'GET' as const,
      path: '/api/posts/:postId/reviews',
      responses: {
        200: z.array(z.custom<typeof reviews.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/posts/:postId/reviews',
      responses: {
        201: z.custom<typeof reviews.$inferSelect>(),
      },
    },
  },
  team: {
    list: {
      method: 'GET' as const,
      path: '/api/team',
      responses: {
        200: z.array(z.custom<typeof teamMembers.$inferSelect>()),
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

export type PostResponse = typeof posts.$inferSelect;
export type TeamMemberResponse = typeof teamMembers.$inferSelect;
export type Review = typeof reviews.$inferSelect;
