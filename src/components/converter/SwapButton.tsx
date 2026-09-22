import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface SwapButtonProps {
  onClick: () => void;
}

const SwapButton = ({ onClick }: SwapButtonProps) => {
  return (
    <div className="flex justify-center py-2">
      <Button
        variant="outline"
        size="icon"
        onClick={onClick}
        aria-label="Intercambiar las dos monedas"
        className="h-12 w-12 rounded-full"
      >
        <ArrowUpDown className="h-5 w-5" aria-hidden="true" />
      </Button>
    </div>
  );
};

export default SwapButton;
