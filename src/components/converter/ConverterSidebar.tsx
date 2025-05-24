
import { currencies } from "@/data/currencies";
import QuickRates from "./QuickRates";
import QuickConversions from "./QuickConversions";

const ConverterSidebar = () => {
  return (
    <div className="space-y-4 lg:space-y-6">
      <QuickRates currencies={currencies} />
      <QuickConversions />
    </div>
  );
};

export default ConverterSidebar;
