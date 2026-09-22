import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import AICryptoAnalyst from "@/components/AICryptoAnalyst";
import { useLocalDataSync } from "@/hooks/useLocalDataSync";
import { SearchProvider } from "@/contexts/SearchContext";
import { useSearch } from "@/contexts/SearchContext";
import Index from "./pages/Index";

// Las rutas secundarias se cargan al entrar, para no meterlas en el paquete inicial.
const Markets = lazy(() => import("./pages/Markets"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Compare = lazy(() => import("./pages/Compare"));
const Watchlist = lazy(() => import("./pages/Watchlist"));
const Converter = lazy(() => import("./pages/Converter"));
const Auth = lazy(() => import("./pages/Auth"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      // Sin esto, React Query PAUSA la consulta cuando cree que no hay red y
      // la pantalla se queda cargando para siempre, sin decir nada. Preferimos
      // que falle y que se vea el error con su botón de reintentar.
      networkMode: "always",
    },
    mutations: {
      networkMode: "always",
    },
  },
});

// Arrastra el modal de detalle (y recharts): se carga al abrir el buscador.
const GlobalSearch = lazy(() => import("@/components/search/GlobalSearch"));

/** Monta el buscador la primera vez que alguien lo abre, no antes. */
function LazyGlobalSearch() {
  const { wasOpened } = useSearch();
  if (!wasOpened) return null;
  return (
    <Suspense fallback={null}>
      <GlobalSearch />
    </Suspense>
  );
}

/** Sube a la cuenta lo que hubiera guardado solo en este navegador. */
function LocalDataSync() {
  useLocalDataSync();
  return null;
}

/** Esqueleto con la forma de una página mientras se descarga su código. */
function RouteFallback() {
  return (
    <div
      className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8"
      aria-busy="true"
    >
      <Skeleton className="h-10 w-56" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="chainlytics-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <SearchProvider>
              <LocalDataSync />
              <div className="flex min-h-screen w-full flex-col">
                <Navbar />
                <main className="flex-1 pb-24 sm:pb-0">
                  <Suspense fallback={<RouteFallback />}>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/markets" element={<Markets />} />
                      <Route path="/portfolio" element={<Portfolio />} />
                      <Route path="/comparar" element={<Compare />} />
                      <Route path="/watchlist" element={<Watchlist />} />
                      <Route path="/converter" element={<Converter />} />
                      <Route path="/auth" element={<Auth />} />
                    </Routes>
                  </Suspense>
                </main>
                <AICryptoAnalyst />
                <LazyGlobalSearch />
              </div>
            </SearchProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
