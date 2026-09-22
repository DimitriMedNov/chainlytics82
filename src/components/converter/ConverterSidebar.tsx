import QuickRates from "./QuickRates";
import QuickConversions from "./QuickConversions";
import type { Convertible } from "@/hooks/useConvertibles";

export interface ConverterSidebarProps {
  options: Convertible[];
  isPending: boolean;
}

const ConverterSidebar = ({ options, isPending }: ConverterSidebarProps) => {
  return (
    <aside className="space-y-4 lg:space-y-6">
      <QuickRates options={options} isPending={isPending} />
      <QuickConversions options={options} isPending={isPending} />
    </aside>
  );
};

export default ConverterSidebar;
