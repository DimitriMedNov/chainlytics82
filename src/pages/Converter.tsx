import ConverterHeader from "@/components/converter/ConverterHeader";
import ConverterForm from "@/components/converter/ConverterForm";
import ConverterSidebar from "@/components/converter/ConverterSidebar";
import { useConvertibles } from "@/hooks/useConvertibles";

const Converter = () => {
  const { convertibles, isPending, isError, isFetching, errorMessage, refetch } = useConvertibles();

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
      <ConverterHeader />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2">
          <ConverterForm
            options={convertibles}
            isPending={isPending}
            isError={isError}
            errorMessage={errorMessage}
            isRetrying={isFetching}
            onRetry={refetch}
          />
        </div>

        <ConverterSidebar options={convertibles} isPending={isPending} />
      </div>
    </div>
  );
};

export default Converter;
