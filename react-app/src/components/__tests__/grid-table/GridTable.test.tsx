import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import faker from "faker";

import GridTable, { DataProps } from "../../grid-table";
import { Project } from "../../../types/models";

const setup = (overrides = {}) => {
  const columns = [
    {
      Header: "Name",
      accessor: "name",
    },
  ];

  const setPageIndex = jest.fn();
  const setSort = jest.fn();
  const props = {
    columns,
    setPageIndex,
    setSort,
    ...overrides,
  };
  const { getByText } = render(<GridTable<Project> {...props} />);
  const clickNameHeader = () => userEvent.click(getByText(/Name/i));
  const clickNextPagination = () => userEvent.click(getByText(/Next/i));
  return {
    clickNameHeader,
    clickNextPagination,
    props,
  };
};

describe("Table", () => {
  it("should render table columns, data and pagination", async () => {
    const data: DataProps<Project> = {
      entries: Array.from(Array(11), (_, i) => ({
        id: i,
        name: faker.lorem.words(),
      })),
      meta: {
        current_page: 1,
        total_count: 11,
        total_pages: 2,
      },
    };
    const loading = false;

    const {
      props: { columns, setPageIndex },
      clickNextPagination,
    } = setup({ data, loading });

    columns.forEach((column) => {
      expect(screen.getByText(column.Header)).toBeInTheDocument();
    });

    data.entries.forEach((entry) => {
      expect(screen.getByText(entry.name)).toBeInTheDocument();
    });

    expect(screen.getByText("Next")).toBeInTheDocument();
    clickNextPagination();
    expect(setPageIndex).toHaveBeenCalled();
  });

  it("should render new row data on sort", async () => {
    const {
      clickNameHeader,
      props: { setSort },
    } = setup();
    clickNameHeader();

    expect(screen.getByText("🔼")).toBeInTheDocument();
    expect(setSort).toHaveBeenCalled();
  });

  it("should render loading", async () => {
    setup({ loading: true });

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });
});
