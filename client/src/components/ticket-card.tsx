import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { TicketWithTimeOpen } from "@/types/ticket";
import { ClockIcon, CheckIcon, EyeOpenIcon, ChatBubbleIcon, CalendarIcon } from "@radix-ui/react-icons";
import { useTickets } from "@/hooks/use-tickets";
import { TicketDetailsDialog } from "@/components/ticket-details-dialog";

interface TicketCardProps {
  ticket: TicketWithTimeOpen;
  showResolveButton?: boolean;
}

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
};

const timeColors = {
  low: "text-gray-600",
  medium: "text-blue-600",
  high: "text-orange-600",
  urgent: "text-red-600",
};

export function TicketCard({ ticket, showResolveButton = false }: TicketCardProps) {
  const { resolveTicket } = useTickets();

  const handleResolve = async () => {
    if (confirm('Are you sure you want to resolve this ticket?')) {
      await resolveTicket.mutateAsync(ticket.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card 
      className={`ticket-card transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${ticket.status === 'resolved' ? 'opacity-75' : ''}`}
      data-testid={`card-ticket-${ticket.id}`}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="font-mono text-sm bg-muted text-muted-foreground px-2 py-1 rounded" data-testid={`text-ticket-id-${ticket.id}`}>
                #{ticket.id.slice(0, 8)}
              </span>
              <Badge className={`${priorityColors[ticket.priority]} text-xs font-medium`} data-testid={`badge-priority-${ticket.id}`}>
                {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
              </Badge>
              {ticket.status === 'resolved' && (
                <Badge className="bg-green-100 text-green-800 text-xs font-medium" data-testid={`badge-status-${ticket.id}`}>
                  <CheckIcon className="mr-1 h-3 w-3" />
                  Resolved
                </Badge>
              )}
              <span className="text-xs text-muted-foreground" data-testid={`text-created-${ticket.id}`}>
                <ClockIcon className="mr-1 h-3 w-3 inline" />
                Created: {formatDate(ticket.createdAt)}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1" data-testid={`text-subject-${ticket.id}`}>
              {ticket.subject}
            </h3>
            <p className="text-muted-foreground text-sm" data-testid={`text-contact-${ticket.id}`}>
              {ticket.name} • {ticket.email}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground mb-2">
              {ticket.status === 'resolved' ? 'Resolution Time' : 'Time Open'}
            </div>
            <div className={`text-lg font-semibold ${timeColors[ticket.priority]}`} data-testid={`text-time-${ticket.id}`}>
              {ticket.status === 'resolved' ? ticket.resolutionTime : ticket.timeOpen}
            </div>
          </div>
        </div>

        <p className="text-foreground mb-4 line-clamp-2" data-testid={`text-description-${ticket.id}`}>
          {ticket.description}
        </p>

        <div className="flex justify-between items-center">
          <div className="flex space-x-3">
            <TicketDetailsDialog ticket={ticket}>
              <Button variant="outline" size="sm" data-testid={`button-view-${ticket.id}`}>
                <EyeOpenIcon className="mr-1 h-3 w-3" />
                View Details
              </Button>
            </TicketDetailsDialog>
            <TicketDetailsDialog ticket={ticket}>
              <Button variant="outline" size="sm" data-testid={`button-note-${ticket.id}`}>
                <ChatBubbleIcon className="mr-1 h-3 w-3" />
                {ticket.status === 'resolved' ? 'Timeline' : 'Add Note'}
              </Button>
            </TicketDetailsDialog>
          </div>
          {showResolveButton && ticket.status === 'open' ? (
            <Button 
              onClick={handleResolve}
              disabled={resolveTicket.isPending}
              className="bg-green-600 hover:bg-green-700 text-white"
              data-testid={`button-resolve-${ticket.id}`}
            >
              <CheckIcon className="mr-2 h-4 w-4" />
              {resolveTicket.isPending ? "Resolving..." : "Resolve Ticket"}
            </Button>
          ) : ticket.status === 'resolved' ? (
            <div className="text-sm text-muted-foreground" data-testid={`text-resolved-${ticket.id}`}>
              {ticket.resolvedAt && `Resolved on ${formatDate(ticket.resolvedAt)}`}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
