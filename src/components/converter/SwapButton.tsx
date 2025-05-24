
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

interface SwapButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const SwapButton = ({ onClick, disabled = false }: SwapButtonProps) => {
  return (
    <div className="flex justify-center py-2">
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onClick}
        className="h-12 w-12 rounded-full border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
        disabled={disabled}
      >
        <ArrowUpDown className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default SwapButton;
