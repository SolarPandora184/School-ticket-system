import { TicketForm } from "@/components/ticket-form";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <i className="fas fa-headset text-xl"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground" data-testid="text-app-title">SupportDesk</h1>
                <p className="text-sm text-muted-foreground">Ticket Management System</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4" data-testid="text-hero-title">Need Help?</h2>
          <p className="text-xl text-muted-foreground mb-8" data-testid="text-hero-subtitle">
            Submit a support ticket and our team will get back to you quickly.
          </p>
        </div>

        {/* Ticket Form */}
        <div className="mb-12">
          <TicketForm />
        </div>
      </div>
    </div>
  );
}
