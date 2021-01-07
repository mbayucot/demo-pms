import { SortDirection, Status, Role } from "../../types";

export interface TableState {
  page: number;
  by_query?: string;
  by_sort?: {
    column: string;
    direction: SortDirection;
  };
  by_status?: Status | "";
  by_role?: Role | "";
  by_assigned_to?: number | "";
}

export const initialTableState: TableState = {
  page: 1,
};
