import faker from "faker";

import { reducer, initialTableState, SortDirection } from "../../grid-table";
import { Status, Role } from "../../../types";

describe("reducer", () => {
  it("should handle pagination state", async () => {
    const payload = {
      pageIndex: 2,
    };
    expect(
      reducer(initialTableState, { type: "SET_PAGE_INDEX", ...payload })
    ).toEqual({
      ...initialTableState,
      page: payload.pageIndex,
    });
  });

  it("should handle search state", async () => {
    const payload = {
      query: `${faker.random.number()} ${faker.lorem.word()}`,
    };
    expect(
      reducer(initialTableState, { type: "SET_QUERY", ...payload })
    ).toEqual({
      ...initialTableState,
      by_query: payload.query,
    });
  });

  it("should handle sort state", async () => {
    const payload = {
      column: "name",
      direction: "asc" as SortDirection,
    };
    expect(
      reducer(initialTableState, { type: "SET_SORT", ...payload })
    ).toEqual({
      ...initialTableState,
      by_sort: {
        column: payload.column,
        direction: payload.direction,
      },
    });
  });

  it("should handle client state", async () => {
    const payload = {
      createdBy: 1,
    };
    expect(
      reducer(initialTableState, { type: "SET_CREATED_BY", ...payload })
    ).toEqual({
      ...initialTableState,
      by_created_by: payload.createdBy,
    });
  });

  it("should handle assignee state", async () => {
    const payload = {
      assignedTo: 1,
    };
    expect(
      reducer(initialTableState, { type: "SET_ASSIGNED_TO", ...payload })
    ).toEqual({
      ...initialTableState,
      by_assigned_to: payload.assignedTo,
    });
  });

  it("should handle status state", async () => {
    const payload = {
      status: Status.completed,
    };
    expect(
      reducer(initialTableState, { type: "SET_STATUS", ...payload })
    ).toEqual({
      ...initialTableState,
      by_status: payload.status,
    });
  });

  it("should handle role state", async () => {
    const payload = {
      role: Role.admin,
    };
    expect(
      reducer(initialTableState, { type: "SET_ROLE", ...payload })
    ).toEqual({
      ...initialTableState,
      by_role: payload.role,
    });
  });
});
