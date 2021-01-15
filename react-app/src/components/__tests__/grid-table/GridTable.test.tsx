import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import GridTable from "../../grid-table";
import { data } from "../../../fixtures/project";
import { Project } from "../../../types";

const setup = (overrides = {}) => {
  const columns = [
    {
      Header: "Name",
      accessor: "name",
    },
  ];
  const onPageChange = jest.fn();
  const onSort = jest.fn();
  const props = {
    columns,
    onPageChange,
    onSort,
    ...overrides,
  };
  const { getByText } = render(<GridTable<Project> {...props} />);
  const clickNameHeader = () => userEvent.click(getByText(/name/i));
  const clickNextButton = () => userEvent.click(getByText(/next/i));
  return {
    clickNameHeader,
    clickNextButton,
    props,
  };
};

describe("GridTable", () => {
  it("should render table headers, rows and pagination", async () => {
    const loading = false;
    const {
      props: { columns, onPageChange },
      clickNextButton,
    } = setup({ data, loading });

    columns.forEach((column) => {
      expect(screen.getByText(column.Header)).toBeInTheDocument();
    });

    data.entries.forEach((entry) => {
      expect(screen.getByText(entry.name)).toBeInTheDocument();
    });

    expect(screen.getByText(/next/i)).toBeInTheDocument();
    clickNextButton();
    expect(onPageChange).toHaveBeenCalled();
  });

  it("should render sort icon when header is clicked", async () => {
    const {
      clickNameHeader,
      props: { onSort },
    } = setup();
    clickNameHeader();
    expect(screen.getByText("🔼")).toBeInTheDocument();
    expect(onSort).toHaveBeenCalled();
  });

  it("should render spinner", async () => {
    setup({ loading: true });
    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });
});
