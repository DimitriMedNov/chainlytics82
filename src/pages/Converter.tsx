
import ConverterHeader from "@/components/converter/ConverterHeader";
import ConverterForm from "@/components/converter/ConverterForm";
import ConverterSidebar from "@/components/converter/ConverterSidebar";

const Converter = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      <ConverterHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
        <div className="lg:col-span-2">
          <ConverterForm />
        </div>

        <ConverterSidebar />
      </div>
    </div>
  );
};

export default Converter;
