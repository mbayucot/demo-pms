export type SortDirection = "asc" | "desc";

export type LocationType = {
  from: { pathname: string };
};

export type SelectOptionType = { label: string; value: string };

export type Nullable<T> = T | null;

export interface FormWithModalProps {
  id?: number;
  onHide: (refresh?: boolean) => void;
}

declare module "*.csv";
