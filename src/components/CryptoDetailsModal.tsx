import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useWatchlist } from "@/hooks/useWatchlist";
import { usePriceHistory } from "@/hooks/useMarketData";
import CryptoHeader from "./crypto/CryptoHeader";
import CryptoPriceSection from "./crypto/CryptoPriceSection";
import CryptoPriceChart from "./crypto/CryptoPriceChart";
import CryptoMarketStats from "./crypto/CryptoMarketStats";
import CryptoAdditionalInfo from "./crypto/CryptoAdditionalInfo";
import type { Coin } from "@/types/coin";

export interface CryptoDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coin: Coin | null;
}

const DIAS_GRAFICO = 30;

const CryptoDetailsModal = ({ open, onOpenChange, coin }: CryptoDetailsModalProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { has, add, remove } = useWatchlist();
  const history = usePriceHistory(coin?.id, DIAS_GRAFICO, open);

  const isInWatchlist = coin ? has(coin.symbol) : false;

  const toggleWatchlist = () => {
    if (!coin) return;
    if (isInWatchlist) {
      remove(coin.symbol);
      toast({
        title: "Eliminado del watchlist",
        description: `${coin.name} ya no está en tu lista`,
      });
      return;
    }
    add(coin);
    toast({
      title: "Añadido al watchlist",
      description: `${coin.name} ya está en tu lista`,
    });
  };

  const goToConverter = () => {
    onOpenChange(false);
    navigate("/converter");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95vh] max-w-[95vw] overflow-y-auto p-4 sm:max-h-[90vh] sm:max-w-4xl sm:p-6">
        {coin && (
          <>
            <DialogHeader>
              <DialogTitle asChild>
                <div>
                  <CryptoHeader
                    coin={coin}
                    isInWatchlist={isInWatchlist}
                    onToggleWatchlist={toggleWatchlist}
                    onExchange={goToConverter}
                  />
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 sm:space-y-8">
              <CryptoPriceSection coin={coin} />
              <CryptoPriceChart
                days={DIAS_GRAFICO}
                data={history.data}
                isPending={history.isPending}
                isError={history.isError}
                errorMessage={history.error?.message ?? ""}
                isRetrying={history.isFetching}
                onRetry={() => void history.refetch()}
              />
              <CryptoMarketStats coin={coin} />
              <CryptoAdditionalInfo coin={coin} />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CryptoDetailsModal;
