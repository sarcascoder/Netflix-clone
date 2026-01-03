
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import SearchPage from "@/pages/Search";
import MyList from "@/pages/MyList";
import Watch from "@/pages/Watch";
import CategoryPage from "@/pages/CategoryPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/search" component={SearchPage} />
      <Route path="/my-list" component={MyList} />
      <Route path="/watch/:id" component={Watch} />
      
      <Route path="/series">
        {() => <CategoryPage type="tv" title="TV Shows" />}
      </Route>
      <Route path="/films">
        {() => <CategoryPage type="movie" title="Movies" />}
      </Route>
      <Route path="/new">
        {() => <CategoryPage title="New & Popular" />}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
