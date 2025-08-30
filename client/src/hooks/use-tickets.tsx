import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Ticket, InsertTicket, Note, InsertNote } from "@shared/schema";
import type { TicketWithTimeOpen } from "@/types/ticket";

function formatTimeOpen(createdAt: string): string {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

function formatResolutionTime(createdAt: string, resolvedAt: string): string {
  const created = new Date(createdAt);
  const resolved = new Date(resolvedAt);
  const diffMs = resolved.getTime() - created.getTime();
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

export function useTickets() {
  const queryClient = useQueryClient();

  const liveTicketsQuery = useQuery<Ticket[]>({
    queryKey: ["/api/tickets", "live"],
  });

  const pastTicketsQuery = useQuery<Ticket[]>({
    queryKey: ["/api/tickets", "past"],
  });

  const createTicketMutation = useMutation({
    mutationFn: async (ticket: InsertTicket) => {
      const response = await apiRequest("POST", "/api/tickets", ticket);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
    },
  });

  const resolveTicketMutation = useMutation({
    mutationFn: async (ticketId: string) => {
      const response = await apiRequest("PATCH", `/api/tickets/${ticketId}/resolve`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets"] });
    },
  });

  const liveTicketsProcessed = (liveTicketsQuery.data || [])
    .filter(ticket => ticket.status === "open")
    .map(ticket => {
      const createdAtStr = typeof ticket.createdAt === 'string' ? ticket.createdAt : new Date(ticket.createdAt).toISOString();
      const resolvedAtStr = ticket.resolvedAt ? (typeof ticket.resolvedAt === 'string' ? ticket.resolvedAt : new Date(ticket.resolvedAt).toISOString()) : null;
      
      return {
        ...ticket,
        createdAt: createdAtStr,
        resolvedAt: resolvedAtStr,
        timeOpen: formatTimeOpen(createdAtStr),
      };
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
  const pastTicketsProcessed = (pastTicketsQuery.data || [])
    .filter(ticket => ticket.status === "resolved")
    .map(ticket => {
      const createdAtStr = typeof ticket.createdAt === 'string' ? ticket.createdAt : new Date(ticket.createdAt).toISOString();
      const resolvedAtStr = ticket.resolvedAt ? (typeof ticket.resolvedAt === 'string' ? ticket.resolvedAt : new Date(ticket.resolvedAt).toISOString()) : null;
      
      return {
        ...ticket,
        createdAt: createdAtStr,
        resolvedAt: resolvedAtStr,
        resolutionTime: ticket.resolvedAt ? formatResolutionTime(
          createdAtStr, 
          resolvedAtStr!
        ) : undefined,
      };
    })
    .sort((a, b) => new Date(b.resolvedAt || 0).getTime() - new Date(a.resolvedAt || 0).getTime());
  
  const deleteTicketMutation = useMutation({
    mutationFn: async (ticketId: string) => {
      const response = await apiRequest("DELETE", `/api/tickets/${ticketId}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets/live"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tickets/past"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tickets/stats"] });
    },
  });

  return {
    liveTickets: liveTicketsProcessed,
    pastTickets: pastTicketsProcessed,
    isLoading: liveTicketsQuery.isLoading || pastTicketsQuery.isLoading,
    createTicket: createTicketMutation,
    resolveTicket: resolveTicketMutation,
    deleteTicket: deleteTicketMutation,
  };
}

export function useTicketStats() {
  return useQuery({
    queryKey: ["/api/tickets/stats"],
  });
}

export function useTicketNotes(ticketId: string) {
  const queryClient = useQueryClient();

  const notesQuery = useQuery<Note[]>({
    queryKey: ["/api/tickets", ticketId, "notes"],
    enabled: !!ticketId,
  });

  const addNoteMutation = useMutation({
    mutationFn: async (note: InsertNote) => {
      const response = await apiRequest("POST", `/api/tickets/${ticketId}/notes`, note);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets", ticketId, "notes"] });
    },
  });

  return {
    notes: notesQuery.data || [],
    isLoading: notesQuery.isLoading,
    addNote: addNoteMutation,
  };
}
