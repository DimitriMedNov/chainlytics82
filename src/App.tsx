
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import AICryptoAnalyst from "@/components/AICryptoAnalyst";
import Index from "./pages/Index";
import Watchlist from "./pages/Watchlist";
import Converter from "./pages/Converter";
import Markets from "./pages/Markets";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="crypto-dashboard-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col w-full">
            <Navbar />
            <main className="flex-1 overflow-auto">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/watchlist" element={<Watchlist />} />
                <Route path="/converter" element={<Converter />} />
                <Route path="/markets" element={<Markets />} />
              </Routes>
            </main>
            <AICryptoAnalyst />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
