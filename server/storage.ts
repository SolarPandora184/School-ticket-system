import { type Ticket, type InsertTicket, type UpdateTicket, type User, type InsertUser, type Note, type InsertNote } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getTickets(): Promise<Ticket[]>;
  getTicket(id: string): Promise<Ticket | undefined>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicket(id: string, ticket: UpdateTicket): Promise<Ticket | undefined>;
  
  getNotes(ticketId: string): Promise<Note[]>;
  createNote(note: InsertNote): Promise<Note>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private tickets: Map<string, Ticket>;
  private notes: Map<string, Note>;

  constructor() {
    this.users = new Map();
    this.tickets = new Map();
    this.notes = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getTickets(): Promise<Ticket[]> {
    return Array.from(this.tickets.values());
  }

  async getTicket(id: string): Promise<Ticket | undefined> {
    return this.tickets.get(id);
  }

  async createTicket(insertTicket: InsertTicket): Promise<Ticket> {
    const id = randomUUID();
    const ticket: Ticket = {
      ...insertTicket,
      id,
      priority: insertTicket.priority || "medium",
      status: "open",
      createdAt: new Date(),
      resolvedAt: null,
    };
    this.tickets.set(id, ticket);
    return ticket;
  }

  async updateTicket(id: string, updateTicket: UpdateTicket): Promise<Ticket | undefined> {
    const existingTicket = this.tickets.get(id);
    if (!existingTicket) {
      return undefined;
    }

    const updatedTicket: Ticket = {
      ...existingTicket,
      ...updateTicket,
      resolvedAt: updateTicket.status === "resolved" ? new Date() : existingTicket.resolvedAt,
    };

    this.tickets.set(id, updatedTicket);
    return updatedTicket;
  }

  async getNotes(ticketId: string): Promise<Note[]> {
    return Array.from(this.notes.values()).filter(note => note.ticketId === ticketId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const id = randomUUID();
    const note: Note = {
      ...insertNote,
      id,
      createdAt: new Date(),
    };
    this.notes.set(id, note);
    return note;
  }
}

export const storage = new MemStorage();
