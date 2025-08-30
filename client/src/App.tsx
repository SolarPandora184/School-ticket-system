import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAdmin } from "@/hooks/use-admin";
import Home from "@/pages/home";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

function Router() {
  const { isPublicMode, enablePublicMode } = useAdmin();

  if (isPublicMode) {
    return (
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  return <Admin onSwitchToPublic={enablePublicMode} />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
