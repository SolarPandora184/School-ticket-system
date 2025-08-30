import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { TicketWithTimeOpen } from "@/types/ticket";
import { EyeOpenIcon, ClockIcon, CheckIcon, CalendarIcon, ChatBubbleIcon, TrashIcon } from "@radix-ui/react-icons";
import { useTickets, useTicketNotes } from "@/hooks/use-tickets";

interface TicketDetailsDialogProps {
  ticket: TicketWithTimeOpen;
  children: React.ReactNode;
}

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
};

export function TicketDetailsDialog({ ticket, children }: TicketDetailsDialogProps) {
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const { resolveTicket, deleteTicket } = useTickets();
  const { notes, addNote, isLoading: notesLoading } = useTicketNotes(ticket.id);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleResolve = async () => {
    if (confirm('Are you sure you want to resolve this ticket?')) {
      await resolveTicket.mutateAsync(ticket.id);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
      await deleteTicket.mutateAsync(ticket.id);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    try {
      await addNote.mutateAsync({
        ticketId: ticket.id,
        content: newNote.trim()
      });
      setNewNote("");
      setIsAddingNote(false);
    } catch (error) {
      console.error("Failed to add note:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]" aria-describedby="ticket-details-description">
        <DialogHeader>
          <DialogDescription id="ticket-details-description" className="sr-only">
            View detailed information about this support ticket including contact details, description, timeline, and notes.
          </DialogDescription>
          <DialogTitle className="flex items-center space-x-3">
            <span className="font-mono text-sm bg-muted text-muted-foreground px-2 py-1 rounded">
              #{ticket.id.slice(0, 8)}
            </span>
            <span>{ticket.subject}</span>
            <Badge className={`${priorityColors[ticket.priority]} text-xs font-medium`}>
              {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
            </Badge>
            {ticket.status === 'resolved' && (
              <Badge className="bg-green-100 text-green-800 text-xs font-medium">
                <CheckIcon className="mr-1 h-3 w-3" />
                Resolved
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ticket Information */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">CONTACT INFORMATION</h3>
              <div className="space-y-1">
                <p className="font-medium">{ticket.name}</p>
                <p className="text-muted-foreground">{ticket.email}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">DESCRIPTION</h3>
              <p className="text-sm leading-relaxed">{ticket.description}</p>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-muted-foreground mb-1">Created</h4>
                <p className="flex items-center">
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  {formatDate(ticket.createdAt)}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-muted-foreground mb-1">
                  {ticket.status === 'resolved' ? 'Resolution Time' : 'Time Open'}
                </h4>
                <p className="flex items-center font-medium">
                  <ClockIcon className="mr-1 h-3 w-3" />
                  {ticket.status === 'resolved' ? ticket.resolutionTime : ticket.timeOpen}
                </p>
              </div>
              {ticket.status === 'resolved' && ticket.resolvedAt && (
                <div className="col-span-2">
                  <h4 className="font-medium text-muted-foreground mb-1">Resolved</h4>
                  <p className="flex items-center text-green-600">
                    <CheckIcon className="mr-1 h-3 w-3" />
                    {formatDate(ticket.resolvedAt)}
                  </p>
                </div>
              )}
            </div>

            {ticket.status === 'open' && (
              <>
                <Separator />
                <div className="space-y-2">
                  <Button 
                    onClick={handleResolve}
                    disabled={resolveTicket.isPending}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckIcon className="mr-2 h-4 w-4" />
                    {resolveTicket.isPending ? "Resolving..." : "Resolve Ticket"}
                  </Button>
                  <Button 
                    onClick={handleDelete}
                    disabled={deleteTicket.isPending}
                    variant="destructive"
                    className="w-full"
                  >
                    <TrashIcon className="mr-2 h-4 w-4" />
                    {deleteTicket.isPending ? "Deleting..." : "Delete Ticket"}
                  </Button>
                </div>
              </>
            )}
            {ticket.status === 'resolved' && (
              <>
                <Separator />
                <Button 
                  onClick={handleDelete}
                  disabled={deleteTicket.isPending}
                  variant="destructive"
                  className="w-full"
                >
                  <TrashIcon className="mr-2 h-4 w-4" />
                  {deleteTicket.isPending ? "Deleting..." : "Delete Ticket"}
                </Button>
              </>
            )}
          </div>

          {/* Notes Timeline */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-muted-foreground">
                {ticket.status === 'resolved' ? 'TIMELINE' : 'NOTES & TIMELINE'}
              </h3>
              {ticket.status === 'open' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingNote(true)}
                  disabled={isAddingNote}
                >
                  <ChatBubbleIcon className="mr-1 h-3 w-3" />
                  Add Note
                </Button>
              )}
            </div>

            <ScrollArea className="h-96 pr-4">
              <div className="space-y-4">
                {/* Add Note Form */}
                {isAddingNote && (
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <Textarea
                      placeholder="Add a note about this ticket..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="mb-3 min-h-[80px]"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleAddNote}
                        disabled={!newNote.trim() || addNote.isPending}
                      >
                        {addNote.isPending ? "Adding..." : "Add Note"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setIsAddingNote(false);
                          setNewNote("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {notesLoading ? (
                  <div className="text-center text-muted-foreground py-8">
                    Loading notes...
                  </div>
                ) : notes && notes.length > 0 ? (
                  notes.map((note) => (
                    <div key={note.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <ChatBubbleIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-sm">Note</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(note.createdAt.toString())}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">{note.content}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <ChatBubbleIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No notes yet</p>
                    {ticket.status === 'open' && (
                      <p className="text-xs mt-1">Add a note to track progress or important updates</p>
                    )}
                  </div>
                )}

                {/* Initial ticket creation entry */}
                <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-sm text-blue-600">Ticket Created</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(ticket.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Ticket submitted by {ticket.name}
                  </p>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}