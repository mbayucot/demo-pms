import React from "react";
import {
  render,
  screen,
  waitForElementToBeRemoved,
  within,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { cache, SWRConfig } from "swr";
import { setupServer } from "msw/node";
import { MemoryRouter, Route } from "react-router-dom";
import selectEvent from "react-select-event";

import TasksPage from "../../../admin/tasks/TasksPage";

import { handlers as taskHandlers } from "../../../__mocks__/admin/task";
import { handlers as userHandlers } from "../../../../api/__mocks__/user";
import {
  data as taskData,
  searchData,
  sortData,
  paginationData,
} from "../../../../fixtures/task";

const setup = () => {
  const utils = render(
    <SWRConfig value={{ dedupingInterval: 0 }}>
      <MemoryRouter initialEntries={[`/admin/tasks/1`]}>
        <Route path="/admin/tasks/:projectId">
          <TasksPage />
        </Route>
      </MemoryRouter>
    </SWRConfig>
  );
  const searchInput = utils.getByPlaceholderText(
    /search.../i
  ) as HTMLInputElement;
  const changeSearchInput = (value: string) =>
    userEvent.type(searchInput, value);
  const searchButton = utils.getByRole("button", {
    name: /search/i,
  });
  const clickSearchButton = () => userEvent.click(searchButton);
  const newTaskButton = utils.getByRole("button", {
    name: /new task/i,
  });
  const clickNewButton = () => userEvent.click(newTaskButton);
  const gridTable = screen.getByRole("table");
  return {
    gridTable,
    changeSearchInput,
    clickNewButton,
    clickSearchButton,
    utils,
  };
};

describe("TasksPage", () => {
  const server = setupServer(...taskHandlers, ...userHandlers);

  beforeAll(() => server.listen());

  beforeEach(() => {
    cache.clear();
  });

  afterAll(() => server.close());

  afterEach(() => {
    server.resetHandlers();
  });

  it("should render tasks container", async () => {
    const { gridTable } = setup();
    expect(screen.getByRole("heading", { name: /tasks/i })).toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));

    const gridUtils = within(gridTable);
    const columns = ["Id", "Summary", "Status", "Assignee"];
    columns.forEach((column) => {
      expect(
        gridUtils.getByRole("columnheader", {
          name: column,
        })
      ).toBeInTheDocument();
    });

    const task = taskData.entries[0];
    const row = gridUtils
      .getByRole("cell", {
        name: task.id.toString(),
      })
      .closest("tr") as HTMLElement;
    const rowUtils = within(row);
    expect(
      rowUtils.getByRole("cell", {
        name: task.summary,
      })
    ).toBeInTheDocument();
    expect(
      rowUtils.getByRole("cell", {
        name: task.status_fmt,
      })
    ).toBeInTheDocument();
    expect(
      rowUtils.getByRole("cell", {
        name: task.assignee?.full_name,
      })
    ).toBeInTheDocument();
  });

  it("should filter data when search button is clicked", async () => {
    const { gridTable, changeSearchInput, clickSearchButton } = setup();
    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));

    await changeSearchInput("__query__");
    act(() => {
      clickSearchButton();
    });
    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));
    const gridUtils = within(gridTable);
    expect(
      gridUtils.getByRole("cell", {
        name: searchData.entries[0].summary,
      })
    ).toBeInTheDocument();
  });

  it("should filter data when status is changed", async () => {
    const { gridTable, utils } = setup();
    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));

    await selectEvent.select(
      utils.container.querySelector("#status") as HTMLElement,
      ["Done"]
    );
    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));
    const gridUtils = within(gridTable);
    expect(
      gridUtils.getByRole("cell", {
        name: searchData.entries[0].summary,
      })
    ).toBeInTheDocument();
  });

  it("should sort data when grid table header is clicked", async () => {
    const { gridTable } = setup();
    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));

    const gridUtils = within(gridTable);
    const header = gridUtils.getByRole("columnheader", {
      name: "Summary",
    });
    act(() => {
      userEvent.click(header);
    });
    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));
    expect(screen.getByText("🔼")).toBeInTheDocument();
    expect(
      gridUtils.getByRole("cell", {
        name: sortData.entries[0].summary,
      })
    ).toBeInTheDocument();
  });

  it("should paginate when next button is clicked", async () => {
    const { gridTable } = setup();
    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));

    const gridUtils = within(gridTable);
    act(() => {
      userEvent.click(screen.getByText(/next/i));
    });
    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));
    expect(
      gridUtils.getByRole("cell", {
        name: paginationData.entries[0].summary,
      })
    ).toBeInTheDocument();
  });

  it("should show new task modal when new task button is clicked", async () => {
    const { clickNewButton } = setup();

    clickNewButton();
    const dialogUtils = within(screen.getByRole("dialog"));
    expect(dialogUtils.getByText(/new task/i)).toBeInTheDocument();
  });

  it("should show edit task modal when edit button is clicked", async () => {
    const { gridTable } = setup();
    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));

    const gridUtils = within(gridTable);
    const row = gridUtils
      .getByRole("cell", {
        name: taskData.entries[0].summary,
      })
      .closest("tr") as HTMLElement;
    const rowUtils = within(row);
    const editButton = rowUtils.getByRole("button", {
      name: /edit/i,
    });
    userEvent.click(editButton);
    const dialogUtils = within(screen.getByRole("dialog"));
    expect(dialogUtils.getByText(/edit task/i)).toBeInTheDocument();
  });

  it("should show confirmation modal when delete button is clicked", async () => {
    const { gridTable } = setup();
    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));

    const gridUtils = within(gridTable);
    const row = gridUtils
      .getByRole("cell", {
        name: taskData.entries[0].summary,
      })
      .closest("tr") as HTMLElement;
    const rowUtils = within(row);
    const deleteButton = rowUtils.getByRole("button", {
      name: /delete/i,
    });
    userEvent.click(deleteButton);
    const dialogUtils = within(screen.getByRole("dialog"));
    expect(dialogUtils.getByText(/confirmation/i)).toBeInTheDocument();

    const okButton = dialogUtils.getByRole("button", {
      name: /ok/i,
    });
    userEvent.click(okButton);
    await waitForElementToBeRemoved(() => screen.getByRole(/dialog/i));
  });
});
