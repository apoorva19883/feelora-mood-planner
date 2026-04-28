import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppStoreProvider } from "@/store/AppStore";
import { AppLayout } from "@/components/layout/AppLayout";
import Home from "./pages/Home";
import Mood from "./pages/Mood";
import Tropes from "./pages/Tropes";
import DramaDetail from "./pages/DramaDetail";
import Search from "./pages/Search";
import Planner from "./pages/Planner";
import Watchlist from "./pages/Watchlist";
import Community from "./pages/Community";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppStoreProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/mood" element={<Mood />} />
              <Route path="/tropes" element={<Tropes />} />
              <Route path="/drama/:id" element={<DramaDetail />} />
              <Route path="/search" element={<Search />} />
              <Route path="/planner" element={<Planner />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/community" element={<Community />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppStoreProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
