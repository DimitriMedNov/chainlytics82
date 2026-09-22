import { lazy, Suspense } from "react";
import MarketStats from "@/components/MarketStats";
import CryptoChart from "@/components/CryptoChart";
import CryptoList from "@/components/CryptoList";
import { Skeleton } from "@/components/ui/skeleton";

// recharts pesa mucho: se carga aparte, sin bloquear el primer pintado.
const PortfolioCard = lazy(() => import("@/components/PortfolioCard"));

const Index = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl">Panel</h1>
          <p className="text-muted-foreground">Precios y cifras del mercado, en vivo desde CoinGecko</p>
        </header>

        <MarketStats />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CryptoChart />
          </div>
          <div>
            <Suspense fallback={<Skeleton className="mb-8 h-[296px] w-full rounded-lg" />}>
              <PortfolioCard />
            </Suspense>
          </div>
        </div>

        <CryptoList />
      </div>
    </div>
  );
};

export default Index;
