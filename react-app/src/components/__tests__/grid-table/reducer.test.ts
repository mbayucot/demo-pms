import faker from "faker";

import { reducer, initialTableState, SortDirection } from "../../grid-table";

describe("reducer", () => {
  it("should update state when searched", async () => {
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

  it("should update state when paged", async () => {
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

  it("should update state when sorted", async () => {
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
});
