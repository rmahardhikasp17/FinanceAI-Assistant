import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleChat } from "./routes/chat";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API routes
  app.post("/api/chat", handleChat);

  return app;
}
