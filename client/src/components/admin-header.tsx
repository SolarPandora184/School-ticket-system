import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UpdateIcon, DownloadIcon } from "@radix-ui/react-icons";

interface AdminHeaderProps {
  title: string;
  subtitle: string;
  showTimeFilter?: boolean;
  showExport?: boolean;
  showRefresh?: boolean;
  onRefresh?: () => void;
}

export function AdminHeader({ 
  title, 
  subtitle, 
  showTimeFilter = false, 
  showExport = false, 
  showRefresh = false,
  onRefresh 
}: AdminHeaderProps) {
  return (
    <div className="p-6 border-b border-border bg-card">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground" data-testid="text-panel-title">{title}</h2>
          <p className="text-muted-foreground" data-testid="text-panel-subtitle">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-4">
          {showRefresh && (
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200" data-testid="badge-realtime">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Real-time Updates
            </Badge>
          )}
          {showTimeFilter && (
            <Select defaultValue="7days">
              <SelectTrigger className="w-[140px]" data-testid="select-time-filter">
                <SelectValue placeholder="Time filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="3months">Last 3 months</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          )}
          {showExport && (
            <Button variant="outline" data-testid="button-export">
              <DownloadIcon className="mr-2 h-4 w-4" />
              Export
            </Button>
          )}
          {showRefresh && onRefresh && (
            <Button variant="outline" onClick={onRefresh} data-testid="button-refresh">
              <UpdateIcon className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
