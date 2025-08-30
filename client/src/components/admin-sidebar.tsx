import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClockIcon, ArchiveIcon, BarChartIcon, ExitIcon } from "@radix-ui/react-icons";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  liveCount: number;
  pastCount: number;
}

export function AdminSidebar({ activeTab, onTabChange, onLogout, liveCount, pastCount }: AdminSidebarProps) {
  const tabs = [
    { id: 'live', label: 'Live Tickets', icon: ClockIcon, count: liveCount },
    { id: 'past', label: 'Past Tickets', icon: ArchiveIcon, count: pastCount },
    { id: 'analytics', label: 'Analytics', icon: BarChartIcon },
  ];

  return (
    <div className="w-64 bg-card border-r border-border shadow-lg flex flex-col h-full">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="bg-primary text-primary-foreground p-2 rounded-lg">
            <i className="fas fa-headset"></i>
          </div>
          <div>
            <h3 className="font-semibold text-foreground" data-testid="text-admin-title">Support Dashboard</h3>
            <p className="text-sm text-muted-foreground">Ticket Management</p>
          </div>
        </div>

        <nav className="space-y-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              variant={activeTab === tab.id ? "default" : "ghost"}
              className="w-full justify-start"
              data-testid={`button-tab-${tab.id}`}
            >
              <tab.icon className="mr-3 h-4 w-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <Badge 
                  variant={activeTab === tab.id ? "secondary" : "outline"} 
                  className="ml-auto"
                  data-testid={`badge-count-${tab.id}`}
                >
                  {tab.count}
                </Badge>
              )}
            </Button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <Button 
          onClick={onLogout} 
          variant="outline" 
          className="w-full justify-start text-destructive hover:bg-destructive hover:text-destructive-foreground"
          data-testid="button-logout"
        >
          <ExitIcon className="mr-3 h-4 w-4" />
Public Form
        </Button>
      </div>
    </div>
  );
}
