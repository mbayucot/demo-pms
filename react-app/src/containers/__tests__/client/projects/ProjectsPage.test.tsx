import React from "react";
import {
  render,
  screen,
  waitForElementToBeRemoved,
  within,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SWRConfig, cache } from "swr";
import { setupServer } from "msw/node";
import { BrowserRouter } from "react-router-dom";

import ProjectsPage from "../../../client/projects/ProjectsPage";

import { handlers as projectHandlers } from "../../../__mocks__/client/project";
import {
  data as projectData,
  searchData,
  sortData,
  paginationData,
} from "../../../../fixtures/project";

const setup = () => {
  const utils = render(
    <BrowserRouter>
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <ProjectsPage />
      </SWRConfig>
    </BrowserRouter>
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
  const newProjectButton = utils.getByRole("button", {
    name: /new project/i,
  });
  const clickNewButton = () => userEvent.click(newProjectButton);
  const gridTable = screen.getByRole("table");
  return {
    gridTable,
    changeSearchInput,
    clickNewButton,
    clickSearchButton,
  };
};

describe("ProjectsPage", () => {
  const server = setupServer(...projectHandlers);

  beforeAll(() => server.listen());

  beforeEach(() => {
    cache.clear();
  });

  afterAll(() => server.close());

  afterEach(() => {
    server.resetHandlers();
  });

  it("should render projects container", async () => {
    const { gridTable } = setup();
    expect(
      screen.getByRole("heading", { name: /projects/i })
    ).toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));

    const gridUtils = within(gridTable);
    const columns = ["Name"];
    columns.forEach((column) => {
      expect(
        gridUtils.getByRole("columnheader", {
          name: column,
        })
      ).toBeInTheDocument();
    });

    expect(
      gridUtils.getByRole("cell", {
        name: projectData.entries[0].name,
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
        name: searchData.entries[0].name,
      })
    ).toBeInTheDocument();
  });

  it("should sort data when grid table header is clicked", async () => {
    const { gridTable } = setup();
    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));

    const gridUtils = within(gridTable);
    const header = gridUtils.getByRole("columnheader", {
      name: "Name",
    });
    act(() => {
      userEvent.click(header);
    });
    expect(screen.getByText("🔼")).toBeInTheDocument();
    expect(
      gridUtils.getByRole("cell", {
        name: sortData.entries[0].name,
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
        name: paginationData.entries[0].name,
      })
    ).toBeInTheDocument();
  });

  it("should show new project modal when new project button is clicked", async () => {
    const { clickNewButton } = setup();

    clickNewButton();
    const dialogUtils = within(screen.getByRole("dialog"));
    expect(dialogUtils.getByText(/new project/i)).toBeInTheDocument();
  });

  it("should show edit project modal when edit button is clicked", async () => {
    const { gridTable } = setup();
    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));

    const gridUtils = within(gridTable);
    const row = gridUtils
      .getByRole("cell", {
        name: projectData.entries[0].name,
      })
      .closest("tr") as HTMLElement;
    const rowUtils = within(row);
    const editButton = rowUtils.getByRole("button", {
      name: /edit/i,
    });
    userEvent.click(editButton);
    const dialogUtils = within(screen.getByRole("dialog"));
    expect(dialogUtils.getByText(/edit project/i)).toBeInTheDocument();
  });

  it("should show confirmation modal when delete button is clicked", async () => {
    const { gridTable } = setup();
    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));

    const gridUtils = within(gridTable);
    const row = gridUtils
      .getByRole("cell", {
        name: projectData.entries[0].name,
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
