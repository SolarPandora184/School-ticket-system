import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTicketSchema, updateTicketSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all tickets
  app.get("/api/tickets", async (req, res) => {
    try {
      const tickets = await storage.getTickets();
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tickets" });
    }
  });

  // Get live tickets only
  app.get("/api/tickets/live", async (req, res) => {
    try {
      const tickets = await storage.getTickets();
      const liveTickets = tickets.filter(ticket => ticket.status === "open");
      res.json(liveTickets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch live tickets" });
    }
  });

  // Get past tickets only
  app.get("/api/tickets/past", async (req, res) => {
    try {
      const tickets = await storage.getTickets();
      const pastTickets = tickets.filter(ticket => ticket.status === "resolved");
      res.json(pastTickets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch past tickets" });
    }
  });

  // Get ticket statistics
  app.get("/api/tickets/stats", async (req, res) => {
    try {
      const tickets = await storage.getTickets();
      const liveTickets = tickets.filter(ticket => ticket.status === "open");
      const resolvedTickets = tickets.filter(ticket => ticket.status === "resolved");
      
      // Calculate average response time (simplified)
      const avgResponseTime = resolvedTickets.length > 0 
        ? resolvedTickets.reduce((acc, ticket) => {
            if (ticket.resolvedAt && ticket.createdAt) {
              const diffMs = new Date(ticket.resolvedAt).getTime() - new Date(ticket.createdAt).getTime();
              return acc + diffMs;
            }
            return acc;
          }, 0) / resolvedTickets.length
        : 0;

      const stats = {
        totalTickets: tickets.length,
        liveTickets: liveTickets.length,
        resolvedTickets: resolvedTickets.length,
        avgResponseTimeMs: avgResponseTime,
        customerSatisfaction: 4.8, // Mock value
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ticket statistics" });
    }
  });

  // Create a new ticket
  app.post("/api/tickets", async (req, res) => {
    try {
      const validatedData = insertTicketSchema.parse(req.body);
      const ticket = await storage.createTicket(validatedData);
      res.status(201).json(ticket);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid ticket data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create ticket" });
      }
    }
  });

  // Resolve a ticket
  app.patch("/api/tickets/:id/resolve", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = { status: "resolved" as const, resolvedAt: new Date() };
      
      const updatedTicket = await storage.updateTicket(id, updateData);
      
      if (!updatedTicket) {
        res.status(404).json({ message: "Ticket not found" });
        return;
      }

      res.json(updatedTicket);
    } catch (error) {
      res.status(500).json({ message: "Failed to resolve ticket" });
    }
  });

  // Update a ticket
  app.patch("/api/tickets/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = updateTicketSchema.parse(req.body);
      
      const updatedTicket = await storage.updateTicket(id, validatedData);
      
      if (!updatedTicket) {
        res.status(404).json({ message: "Ticket not found" });
        return;
      }

      res.json(updatedTicket);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid update data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update ticket" });
      }
    }
  });

  // Get a specific ticket
  app.get("/api/tickets/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const ticket = await storage.getTicket(id);
      
      if (!ticket) {
        res.status(404).json({ message: "Ticket not found" });
        return;
      }

      res.json(ticket);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ticket" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
