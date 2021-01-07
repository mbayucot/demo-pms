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

import {
  handlers as projectHandler,
  data as projectData,
} from "../../../__mocks__/client/project";
import { handlers as userHandler } from "../../../__mocks__/user";

const setup = () => {
  const utils = render(
    <BrowserRouter>
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <ProjectsPage />
      </SWRConfig>
    </BrowserRouter>
  );
  const searchInput = utils.getByPlaceholderText(
    /Search.../i
  ) as HTMLInputElement;
  const changeSearchInput = (value: string) =>
    userEvent.type(searchInput, value);
  const searchButton = utils.getByRole("button", {
    name: /Search/i,
  });
  const clickSearchButton = () => userEvent.click(searchButton);
  const newProjectButton = utils.getByRole("button", {
    name: /New/i,
  });
  const clickNewButton = () => userEvent.click(newProjectButton);
  const gridTable = screen.getByRole("table");
  const spinner = utils.getByRole(/status/i);
  return {
    gridTable,
    spinner,
    changeSearchInput,
    clickNewButton,
    clickSearchButton,
  };
};

describe("ProjectsPage", () => {
  const server = setupServer(...projectHandler, ...userHandler);

  beforeAll(() => server.listen());

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => server.close());

  it("should render page and grid headers", async () => {
    const { gridTable, spinner } = setup();
    expect(
      screen.getByRole("heading", { name: /projects/i })
    ).toBeInTheDocument();
    expect(spinner).toHaveTextContent(/loading/i);

    const gridUtils = within(gridTable);
    const columns = ["name"];
    columns.forEach((column) => {
      expect(
        gridUtils.getByRole("columnheader", {
          name: column,
        })
      ).toBeInTheDocument();
    });

    await waitForElementToBeRemoved(() => spinner);

    projectData.entries.forEach((project) => {
      expect(
        gridUtils.getByRole("cell", {
          name: project.name,
        })
      ).toBeInTheDocument();
    });
  });

  it("should sort", async () => {
    const {
      gridTable,
      spinner,
      changeSearchInput,
      clickSearchButton,
    } = setup();
    await waitForElementToBeRemoved(() => spinner);

    await changeSearchInput("__query__");
    act(() => {
      clickSearchButton();
    });
    await waitForElementToBeRemoved(() => spinner);
    const gridUtils = within(gridTable);
    expect(
      gridUtils.getByRole("cell", {
        name: projectData.entries[0].name,
      })
    ).toBeInTheDocument();
  });

  it("should search", async () => {
    const {
      gridTable,
      spinner,
      changeSearchInput,
      clickSearchButton,
    } = setup();
    await waitForElementToBeRemoved(() => spinner);

    await changeSearchInput("__query__");
    act(() => {
      clickSearchButton();
    });
    await waitForElementToBeRemoved(() => spinner);
    const gridUtils = within(gridTable);
    expect(
      gridUtils.getByRole("cell", {
        name: projectData.entries[0].name,
      })
    ).toBeInTheDocument();
  });

  it("should paginate", async () => {
    const { gridTable, spinner } = setup();
    await waitForElementToBeRemoved(() => spinner);

    const gridUtils = within(gridTable);
    act(() => {
      userEvent.click(screen.getByText(/next/i));
    });
    await waitForElementToBeRemoved(() => spinner);
    expect(
      gridUtils.getByRole("cell", {
        name: projectData.entries[0].name,
      })
    ).toBeInTheDocument();
  });

  it("should open new task modal", async () => {
    const { spinner, clickNewButton } = setup();
    await waitForElementToBeRemoved(() => spinner);

    clickNewButton();
    expect(
      screen.getByRole("heading", {
        name: /new project/i,
      })
    ).toBeInTheDocument();
    userEvent.click(screen.getByText(/×/i));
  });

  it("should open edit task modal", async () => {
    const { gridTable, spinner, clickNewButton } = setup();
    await waitForElementToBeRemoved(() => spinner);

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
    expect(screen.getByText(/edit project/i)).toBeInTheDocument();
    userEvent.click(screen.getByText(/×/i));
  });

  it("should open delete task modal", async () => {
    const { gridTable, spinner } = setup();
    await waitForElementToBeRemoved(() => spinner);

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
    const okButton = rowUtils.getByRole("button", {
      name: /ok/i,
    });
    userEvent.click(deleteButton);
    expect(
      screen.getByText(/Are you sure you want to delete this project?/i)
    ).toBeInTheDocument();
    userEvent.click(okButton);

    await waitForElementToBeRemoved(() => spinner);
  });
});
