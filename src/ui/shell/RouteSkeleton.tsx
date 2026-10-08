import { ChartSkeleton, ListSkeleton, LoadingRegion, PageHeaderSkeleton, StatSkeleton } from "@/ui/shared/skeletons";
import { PageContainer } from "@/ui/shared/page";
import { Panel } from "@/ui/shared/panel";

const STATS = ["a", "b", "c", "d"] as const;

/** Esqueleto con forma de página mientras se descarga el código de una ruta. */
export function RouteSkeleton() {
  return (
    <LoadingRegion label="Cargando la pantalla">
      <PageContainer>
        <PageHeaderSkeleton />
        <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {STATS.map((stat) => (
            <StatSkeleton key={stat} />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
          <Panel className="lg:col-span-2">
            <Panel.Body>
              <ChartSkeleton />
            </Panel.Body>
          </Panel>
          <Panel>
            <Panel.Body padding="flush">
              <ListSkeleton rows={5} columns={1} />
            </Panel.Body>
          </Panel>
        </div>
      </PageContainer>
    </LoadingRegion>
  );
}
