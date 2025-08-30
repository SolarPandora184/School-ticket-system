import { useState } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin-header";
import { TicketCard } from "@/components/ticket-card";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTickets } from "@/hooks/use-tickets";
import type { TicketWithTimeOpen } from "@/types/ticket";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminProps {
  onSwitchToPublic: () => void;
}

export default function Admin({ onSwitchToPublic }: AdminProps) {
  const [activeTab, setActiveTab] = useState("live");
  const { liveTickets, pastTickets, isLoading } = useTickets();
  
  const liveTicketsTyped = liveTickets as TicketWithTimeOpen[];
  const pastTicketsTyped = pastTickets as TicketWithTimeOpen[];

  const renderLiveTickets = () => (
    <div className="h-full flex flex-col" data-testid="panel-live-tickets">
      <AdminHeader
        title="Live Tickets"
        subtitle="Active support requests requiring attention"
        showRefresh={true}
        onRefresh={() => window.location.reload()}
      />
      <ScrollArea className="flex-1 p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : liveTicketsTyped.length === 0 ? (
          <div className="text-center py-12" data-testid="empty-live-tickets">
            <div className="text-muted-foreground mb-4">
              <i className="fas fa-inbox text-4xl"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">No Live Tickets</h3>
            <p className="text-muted-foreground">All tickets have been resolved. Great work!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {liveTicketsTyped.map((ticket: TicketWithTimeOpen) => (
              <TicketCard key={ticket.id} ticket={ticket} showResolveButton={true} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );

  const renderPastTickets = () => (
    <div className="h-full flex flex-col" data-testid="panel-past-tickets">
      <AdminHeader
        title="Past Tickets"
        subtitle="Resolved support requests archive"
        showTimeFilter={true}
        showExport={true}
      />
      <ScrollArea className="flex-1 p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : pastTicketsTyped.length === 0 ? (
          <div className="text-center py-12" data-testid="empty-past-tickets">
            <div className="text-muted-foreground mb-4">
              <i className="fas fa-archive text-4xl"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">No Past Tickets</h3>
            <p className="text-muted-foreground">No tickets have been resolved yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pastTicketsTyped.map((ticket: TicketWithTimeOpen) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );

  const renderAnalytics = () => (
    <div className="h-full flex flex-col" data-testid="panel-analytics">
      <AdminHeader
        title="Analytics Dashboard"
        subtitle="Support ticket metrics and insights"
        showTimeFilter={true}
      />
      <ScrollArea className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                  <i className="fas fa-ticket-alt"></i>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-200">+12%</Badge>
              </div>
              <div className="text-2xl font-bold text-foreground mb-1" data-testid="stat-total-tickets">{liveTicketsTyped.length + pastTicketsTyped.length}</div>
              <div className="text-sm text-muted-foreground">Total Tickets This Week</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 text-green-600 p-3 rounded-lg">
                  <i className="fas fa-check-circle"></i>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-200">+8%</Badge>
              </div>
              <div className="text-2xl font-bold text-foreground mb-1" data-testid="stat-resolved-tickets">{pastTicketsTyped.length}</div>
              <div className="text-sm text-muted-foreground">Resolved Tickets</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-orange-100 text-orange-600 p-3 rounded-lg">
                  <i className="fas fa-clock"></i>
                </div>
                <Badge variant="outline" className="text-red-600 border-red-200">+15m</Badge>
              </div>
              <div className="text-2xl font-bold text-foreground mb-1" data-testid="stat-avg-response">2h 45m</div>
              <div className="text-sm text-muted-foreground">Avg Response Time</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
                  <i className="fas fa-smile"></i>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-200">+2%</Badge>
              </div>
              <div className="text-2xl font-bold text-foreground mb-1" data-testid="stat-satisfaction">4.8</div>
              <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Ticket Volume Trends</h3>
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">
                <i className="fas fa-chart-line text-2xl mb-2 block"></i>
                Chart visualization would be implemented here
              </p>
            </div>
          </CardContent>
        </Card>
      </ScrollArea>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "live":
        return renderLiveTickets();
      case "past":
        return renderPastTickets();
      case "analytics":
        return renderAnalytics();
      default:
        return renderLiveTickets();
    }
  };

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
            <Badge className="bg-blue-100 text-blue-800 border-blue-200" data-testid="badge-admin-mode">
              <i className="fas fa-headset mr-2"></i>Dashboard
            </Badge>
          </div>
        </div>
      </header>

      {/* Support Panel */}
      <div className="flex h-[calc(100vh-4rem)]">
        <AdminSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={onSwitchToPublic}
          liveCount={liveTicketsTyped.length}
          pastCount={pastTicketsTyped.length}
        />
        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
