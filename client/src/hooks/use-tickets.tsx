import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Ticket, InsertTicket } from "@shared/schema";
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

  const liveTicketsQuery = useQuery<TicketWithTimeOpen[]>({
    queryKey: ["/api/tickets", "live"],
    select: (data: Ticket[]) => 
      data
        .filter(ticket => ticket.status === "open")
        .map(ticket => ({
          ...ticket,
          timeOpen: formatTimeOpen(ticket.createdAt),
        }))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  });

  const pastTicketsQuery = useQuery<TicketWithTimeOpen[]>({
    queryKey: ["/api/tickets", "past"],
    select: (data: Ticket[]) => 
      data
        .filter(ticket => ticket.status === "resolved")
        .map(ticket => ({
          ...ticket,
          resolutionTime: ticket.resolvedAt ? formatResolutionTime(ticket.createdAt, ticket.resolvedAt) : undefined,
        }))
        .sort((a, b) => new Date(b.resolvedAt || 0).getTime() - new Date(a.resolvedAt || 0).getTime()),
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

  return {
    liveTickets: liveTicketsQuery.data || [],
    pastTickets: pastTicketsQuery.data || [],
    isLoading: liveTicketsQuery.isLoading || pastTicketsQuery.isLoading,
    createTicket: createTicketMutation,
    resolveTicket: resolveTicketMutation,
  };
}

export function useTicketStats() {
  return useQuery({
    queryKey: ["/api/tickets/stats"],
  });
}
