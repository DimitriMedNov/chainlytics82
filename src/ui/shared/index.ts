/** Piezas compartidas del front nuevo. Guía: `src/ui/shared/README.md`. */
export { notify, type NotifyAction, type NotifyOptions } from "@/ui/shared/notify";
export {
  PageContainer,
  PageGrid,
  PageHeader,
  pageContainerVariants,
  pageGridVariants,
  type PageContainerProps,
  type PageGridProps,
  type PageHeaderProps,
} from "@/ui/shared/page";
export {
  Panel,
  panelBodyVariants,
  panelVariants,
  type PanelActionsProps,
  type PanelBodyProps,
  type PanelDescriptionProps,
  type PanelFooterProps,
  type PanelHeaderProps,
  type PanelProps,
  type PanelTitleProps,
} from "@/ui/shared/panel";
export { Stat, StatGrid, statGridVariants, statVariants, type StatGridProps, type StatProps } from "@/ui/shared/stat";
export { PriceChange, priceChangeVariants, type PriceChangeProps } from "@/ui/shared/price-change";
export { CoinAvatar, coinAvatarVariants, type CoinAvatarProps } from "@/ui/shared/coin-avatar";
export { RangeSelector, type RangeSelectorProps } from "@/ui/shared/range-selector";
export { EmptyState, emptyStateVariants, type EmptyStateProps } from "@/ui/shared/empty-state";
export {
  DEFAULT_ERROR_TITLE,
  ErrorState,
  errorStateVariants,
  type ErrorStateProps,
} from "@/ui/shared/error-state";
export {
  ChartSkeleton,
  ListSkeleton,
  LoadingRegion,
  PageHeaderSkeleton,
  RowSkeleton,
  Skeleton,
  StatSkeleton,
  type ChartSkeletonProps,
  type ListSkeletonProps,
  type LoadingRegionProps,
  type RowSkeletonProps,
  type StatSkeletonProps,
} from "@/ui/shared/skeletons";
export { ServiceUnavailable, type ServiceUnavailableProps } from "@/ui/shared/service-unavailable";
export { StorageBadge, type StorageBadgeProps } from "@/ui/shared/storage-badge";
export { SaveStatus, type SaveStatusProps } from "@/ui/shared/save-status";
export { UnderConstruction, type UnderConstructionProps } from "@/ui/shared/under-construction";
