import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTicketSchema, type InsertTicket } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTickets } from "@/hooks/use-tickets";
import { PaperPlaneIcon, CheckCircledIcon } from "@radix-ui/react-icons";

export function TicketForm() {
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);
  const { createTicket } = useTickets();

  const form = useForm<InsertTicket>({
    resolver: zodResolver(insertTicketSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      description: "",
      priority: "medium",
    },
  });

  const onSubmit = async (data: InsertTicket) => {
    try {
      const result = await createTicket.mutateAsync(data);
      setSubmittedTicketId(result.id);
      form.reset();
    } catch (error) {
      console.error("Failed to create ticket:", error);
    }
  };

  if (submittedTicketId) {
    return (
      <Alert className="bg-green-50 border-green-200" data-testid="success-message">
        <CheckCircledIcon className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-2">Ticket Submitted Successfully!</h4>
            <p>Your ticket has been created and assigned ID: <span className="font-mono bg-green-100 px-2 py-1 rounded" data-testid="ticket-id">#{submittedTicketId}</span></p>
            <p className="text-sm mt-2">You will receive email updates on the status of your ticket.</p>
            <Button 
              onClick={() => setSubmittedTicketId(null)} 
              className="mt-4"
              data-testid="button-new-ticket"
            >
              Submit Another Ticket
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="shadow-lg" data-testid="card-ticket-form">
      <CardHeader>
        <CardTitle className="text-2xl" data-testid="text-form-title">Create Support Ticket</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="form-ticket">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel data-testid="label-name">Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel data-testid="label-email">Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} data-testid="input-email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel data-testid="label-priority">Priority Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel data-testid="label-subject">Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Brief description of your issue" {...field} data-testid="input-subject" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel data-testid="label-description">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={6}
                      placeholder="Please provide detailed information about your issue..."
                      className="resize-none"
                      {...field}
                      data-testid="textarea-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full" 
              disabled={createTicket.isPending}
              data-testid="button-submit"
            >
              <PaperPlaneIcon className="mr-2 h-4 w-4" />
              {createTicket.isPending ? "Submitting..." : "Submit Ticket"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
