
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

const QuickConversions = () => {
  const conversions = [
    { from: "1 BTC", to: "$43,500", desc: "Bitcoin a USD" },
    { from: "1 ETH", to: "$2,650", desc: "Ethereum a USD" },
    { from: "1000 ADA", to: "$380", desc: "Cardano a USD" },
    { from: "10 SOL", to: "$980", desc: "Solana a USD" },
  ];

  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Star className="h-5 w-5 text-yellow-500" />
          Conversiones Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {conversions.map((conversion, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <div>
                <div className="font-medium">{conversion.from}</div>
                <div className="text-xs text-muted-foreground">{conversion.desc}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-green-600">{conversion.to}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickConversions;
