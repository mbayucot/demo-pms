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

import UsersPage from "../../../admin/users/UsersPage";

import { handlers, data as userData } from "../../../__mocks__/user";

const setup = () => {
  const utils = render(
    <SWRConfig value={{ dedupingInterval: 0 }}>
      <UsersPage />
    </SWRConfig>
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
  const newUserButton = utils.getByRole("button", {
    name: /New/i,
  });
  const clickNewButton = () => userEvent.click(newUserButton);
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

describe("UsersPage", () => {
  const server = setupServer(...handlers);

  beforeAll(() => server.listen());

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => server.close());

  it("should render page and grid headers", async () => {
    const { gridTable, spinner } = setup();
    expect(screen.getByRole("heading", { name: /users/i })).toBeInTheDocument();
    expect(spinner).toHaveTextContent(/loading/i);

    const gridUtils = within(gridTable);
    const columns = ["email", "name", "role"];
    columns.forEach((column) => {
      expect(
        gridUtils.getByRole("columnheader", {
          name: column,
        })
      ).toBeInTheDocument();
    });

    await waitForElementToBeRemoved(() => spinner);

    userData.entries.forEach((user) => {
      const row = gridUtils
        .getByRole("cell", {
          name: user.email,
        })
        .closest("tr") as HTMLElement;
      const rowUtils = within(row);
      expect(
        rowUtils.getByRole("cell", {
          name: user.full_name,
        })
      ).toBeInTheDocument();
      expect(
        rowUtils.getByRole("cell", {
          name: user.role,
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
        name: userData.entries[0].email,
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
        name: userData.entries[0].email,
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
        name: userData.entries[0].email,
      })
    ).toBeInTheDocument();
  });

  it("should open new task modal", async () => {
    const { spinner, clickNewButton } = setup();
    await waitForElementToBeRemoved(() => spinner);

    clickNewButton();
    expect(
      screen.getByRole("heading", {
        name: /new user/i,
      })
    ).toBeInTheDocument();
    userEvent.click(screen.getByText(/×/i));
  });

  it("should open edit task modal", async () => {
    const { spinner, gridTable } = setup();
    await waitForElementToBeRemoved(() => spinner);

    const gridUtils = within(gridTable);
    const row = gridUtils
      .getByRole("cell", {
        name: userData.entries[0].email,
      })
      .closest("tr") as HTMLElement;
    const rowUtils = within(row);
    const editButton = rowUtils.getByRole("button", {
      name: /edit/i,
    });
    userEvent.click(editButton);
    expect(screen.getByText(/edit user/i)).toBeInTheDocument();
    userEvent.click(screen.getByText(/×/i));
  });

  it("should open delete task modal", async () => {
    const { gridTable, spinner } = setup();
    await waitForElementToBeRemoved(() => spinner);

    const gridUtils = within(gridTable);
    const row = gridUtils
      .getByRole("cell", {
        name: userData.entries[0].email,
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
      screen.getByText(/Are you sure you want to delete this user?/i)
    ).toBeInTheDocument();
    userEvent.click(okButton);

    await waitForElementToBeRemoved(() => spinner);
  });
});
