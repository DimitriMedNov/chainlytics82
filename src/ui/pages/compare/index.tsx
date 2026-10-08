import { COMPARE_TEXTS } from "@/application/compare/presentation/texts";
import { useCompareScreen } from "@/hooks/compare/useCompareScreen";
import { PageContainer, PageGrid, PageHeader } from "@/ui/shared";
import { CoinPickerPanel } from "@/ui/pages/compare/coin-picker-panel";
import { ComparisonPanel } from "@/ui/pages/compare/comparison-panel";
import { ADD_COIN_ID } from "@/ui/pages/compare/constants";
import { RankingPanel } from "@/ui/pages/compare/ranking-panel";

/** Lleva el foco (y la vista) al selector «Añadir moneda». */
function focusAddCoin() {
  document.getElementById(ADD_COIN_ID)?.focus();
}

/**
 * Pantalla Comparar (`/comparar`). Solo pinta lo que devuelve `useCompareScreen()`:
 * selección (vive en la URL), gráfica y clasificación, cada bloque con sus 4 estados.
 */
export default function ComparePage() {
  const { days, setDays, picker, chart, ranking } = useCompareScreen();
  const emptyAction = {
    days,
    onPickRange: setDays,
    canAddCoin: picker.status !== "error" && picker.status !== "loading" && !picker.isFull,
    onAddCoin: focusAddCoin,
  };

  return (
    <PageContainer data-slot="compare-page">
      <PageHeader title={COMPARE_TEXTS.title} description={COMPARE_TEXTS.subtitle} />
      <CoinPickerPanel picker={picker} />
      <PageGrid layout="main" className="items-start">
        <ComparisonPanel chart={chart} days={days} onDaysChange={setDays} emptyAction={emptyAction} />
        <RankingPanel
          ranking={ranking}
          skeletonRows={Math.max(picker.selected.length, 2)}
          emptyAction={emptyAction}
        />
      </PageGrid>
    </PageContainer>
  );
}
