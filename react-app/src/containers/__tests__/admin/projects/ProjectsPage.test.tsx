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
import { BrowserRouter } from "react-router-dom";

import ProjectsPage from "../../../admin/projects/ProjectsPage";
import { AbilityContext, defineAbilityFor } from "../../../../config/can";

import { handlers as projectHandlers } from "../../../__mocks__/admin/project";
import { handlers as userHandlers } from "../../../../api/__mocks__/user";
import {
  data as projectData,
  searchData,
  sortData,
  paginationData,
} from "../../../../fixtures/project";
import { admin, staff } from "../../../../fixtures/user";

const setup = (role = "admin") => {
  const user = role === "admin" ? admin : staff;
  const ability = defineAbilityFor(user);
  const utils = render(
    <BrowserRouter>
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <AbilityContext.Provider value={ability}>
          <ProjectsPage />
        </AbilityContext.Provider>
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
  const gridTable = utils.getByRole("table");
  const spinner = utils.getByRole(/status/i);
  return {
    utils,
    gridTable,
    spinner,
    changeSearchInput,
    clickSearchButton,
  };
};

describe("ProjectsPage", () => {
  const server = setupServer(...projectHandlers, ...userHandlers);

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
    const columns = ["Name", "Client"];
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
    expect(
      gridUtils.getByRole("cell", {
        name: projectData.entries[0].client.full_name,
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
    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));
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
    const { utils } = setup();

    const newProjectButton = utils.getByRole("button", {
      name: /new project/i,
    });
    const clickNewButton = () => userEvent.click(newProjectButton);
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

  it("should hide new, edit and delete buttons for staff", async () => {
    setup("staff");
    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));

    const buttons = ["New Project", "Edit", "Delete"];
    buttons.forEach((button) => {
      expect(
        screen.queryByRole("button", {
          name: button,
        })
      ).not.toBeInTheDocument();
    });
  });
});
