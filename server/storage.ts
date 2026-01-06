import { posts, teamMembers, reviews, type Post, type InsertPost, type TeamMember, type InsertTeamMember, type Review, type InsertReview } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // Posts
  getPosts(type?: 'hiring' | 'for_hire'): Promise<Post[]>;
  getPostsByCreator(creatorId: string): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  updatePostStatus(id: number, status: 'approved' | 'rejected'): Promise<Post | undefined>;
  getPost(id: number): Promise<Post | undefined>;
  
  // Team
  getTeamMembers(): Promise<TeamMember[]>;
  seedTeamMembers(): Promise<void>;

  // Reviews
  getReviewsByPost(postId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
}

export class DatabaseStorage implements IStorage {
  async getPosts(type?: 'hiring' | 'for_hire'): Promise<Post[]> {
    const conditions = [eq(posts.status, 'approved')];
    if (type) {
      conditions.push(eq(posts.type, type));
    }
    return await db.select().from(posts).where(and(...conditions)).orderBy(desc(posts.createdAt));
  }

  async getPostsByCreator(creatorId: string): Promise<Post[]> {
    return await db.select().from(posts).where(eq(posts.creatorId, creatorId)).orderBy(desc(posts.createdAt));
  }

  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post).returning();
    return newPost;
  }

  async updatePostStatus(id: number, status: 'approved' | 'rejected'): Promise<Post | undefined> {
    const [updated] = await db.update(posts)
      .set({ status })
      .where(eq(posts.id, id))
      .returning();
    return updated;
  }

  async getPost(id: number): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.id, id));
    return post;
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    return await db.select().from(teamMembers);
  }

  async seedTeamMembers(): Promise<void> {
    const existing = await this.getTeamMembers();
    if (existing.length === 0) {
      const placeholders: InsertTeamMember[] = Array(8).fill(null).map((_, i) => ({
        name: `Team Member ${i + 1}`,
        role: "Smile Ink Staff",
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
      }));
      await db.insert(teamMembers).values(placeholders);
    }

    // Seed initial reviews for ALL approved posts to ensure visibility
    const approvedPosts = await this.getPosts();
    for (const post of approvedPosts) {
      const existingReviews = await this.getReviewsByPost(post.id);
      if (existingReviews.length === 0) {
        await this.createReview({
          postId: post.id,
          rating: 5,
          content: "Excellent work! Very professional animator.",
          authorName: "RobloxTester"
        });
      }
    }
  }

  async getReviewsByPost(postId: number): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.postId, postId)).orderBy(desc(reviews.createdAt));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }
}

export const storage = new DatabaseStorage();
