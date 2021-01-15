import { TableState, SortDirection } from "./state";
import { Role, Status } from "../../types";

type Action =
  | { type: "SET_PAGE_INDEX"; pageIndex: number }
  | { type: "SET_QUERY"; query: string }
  | { type: "SET_SORT"; column: string; direction: SortDirection }
  | { type: "SET_CREATED_BY"; createdBy: number | "" }
  | { type: "SET_ASSIGNED_TO"; assignedTo: number | "" }
  | { type: "SET_STATUS"; status: Status | "" }
  | { type: "SET_ROLE"; role: Role | "" };

const reducer = (state: TableState, action: Action): TableState => {
  switch (action.type) {
    case "SET_QUERY":
      return {
        ...state,
        by_query: action.query,
      };
    case "SET_PAGE_INDEX":
      return {
        ...state,
        page: action.pageIndex,
      };
    case "SET_SORT":
      return {
        ...state,
        by_sort: {
          column: action.column,
          direction: action.direction,
        },
      };
    case "SET_CREATED_BY":
      return {
        ...state,
        by_created_by: action.createdBy,
      };
    case "SET_ASSIGNED_TO":
      return {
        ...state,
        by_assigned_to: action.assignedTo,
      };
    case "SET_STATUS":
      return {
        ...state,
        by_status: action.status,
      };
    case "SET_ROLE":
      return {
        ...state,
        by_role: action.role,
      };
    default:
      throw new Error();
  }
};

export default reducer;
