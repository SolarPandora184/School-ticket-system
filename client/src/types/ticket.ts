export interface TicketWithTimeOpen {
  id: string;
  name: string;
  email: string;
  subject: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "resolved";
  createdAt: string;
  resolvedAt: string | null;
  timeOpen?: string;
  resolutionTime?: string;
}
