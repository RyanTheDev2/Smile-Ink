import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'hiring' | 'for_hire'
  status: text("status").notNull().default("pending"), // 'pending' | 'approved' | 'rejected'
  title: text("title").notNull(),
  description: text("description").notNull(),
  payment: text("payment").notNull(),
  paymentType: text("payment_type").notNull(), // 'USD' | 'Robux'
  pastWork: text("past_work"), // URL or text
  reference: text("reference"), // Reference for hiring posts
  creatorUsername: text("creator_username").notNull(),
  creatorAvatar: text("creator_avatar"), // Discord avatar hash
  creatorId: text("creator_id").notNull(), // Discord ID
  createdAt: timestamp("created_at").defaultNow(),
});

export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  avatarUrl: text("avatar_url").notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  postId: serial("post_id").references(() => posts.id).notNull(),
  rating: serial("rating").notNull(), // 1-5
  content: text("content").notNull(),
  authorName: text("author_name").notNull(),
  authorAvatar: text("author_avatar"),
  createdAt: timestamp("created_at").defaultNow(),
});

// === SCHEMAS ===
export const insertPostSchema = createInsertSchema(posts).omit({ 
  id: true, 
  createdAt: true,
  status: true 
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({ 
  id: true 
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true
});

// === TYPES ===
export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
