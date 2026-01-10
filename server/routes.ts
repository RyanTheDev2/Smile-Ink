import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { startBot } from "./bot";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Health check for Uptime Robot
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });
  
  // Posts API
  app.get(api.posts.list.path, async (req, res) => {
    const type = req.query.type as 'hiring' | 'for_hire' | undefined;
    const posts = await storage.getPosts(type);
    res.json(posts);
  });

  // Team API
  app.get(api.team.list.path, async (req, res) => {
    const team = await storage.getTeamMembers();
    res.json(team);
  });

  // Reviews API
  app.get(api.reviews.list.path, async (req, res) => {
    const postId = parseInt(req.params.postId);
    const reviews = await storage.getReviewsByPost(postId);
    res.json(reviews);
  });

  app.post(api.reviews.create.path, async (req, res) => {
    const postId = parseInt(req.params.postId);
    const review = await storage.createReview({
      ...req.body,
      postId
    });
    res.status(201).json(review);
  });

  // Start Discord Bot
  startBot().catch(err => {
    console.error("Failed to start Discord bot:", err);
  });

  // Seed Data
  await storage.seedTeamMembers();

  return httpServer;
}
