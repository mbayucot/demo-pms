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

import UsersPage from "../../../admin/users/UsersPage";

import { handlers } from "../../../__mocks__/admin/user";
import {
  data as userData,
  searchData,
  sortData,
  paginationData,
} from "../../../../fixtures/user";

const setup = () => {
  const utils = render(
    <SWRConfig value={{ dedupingInterval: 0 }}>
      <UsersPage />
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
  const newUserButton = utils.getByRole("button", {
    name: /new user/i,
  });
  const clickNewButton = () => userEvent.click(newUserButton);
  const gridTable = screen.getByRole("table");
  return {
    gridTable,
    changeSearchInput,
    clickNewButton,
    clickSearchButton,
  };
};

describe("UsersPage", () => {
  const server = setupServer(...handlers);

  beforeAll(() => server.listen());

  beforeEach(() => {
    cache.clear();
  });

  afterAll(() => server.close());

  afterEach(() => {
    server.resetHandlers();
  });

  it("should render users container", async () => {
    const { gridTable } = setup();
    expect(screen.getByRole("heading", { name: /users/i })).toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));

    const gridUtils = within(gridTable);
    const columns = ["Email", "Name", "Role"];
    columns.forEach((column) => {
      expect(
        gridUtils.getByRole("columnheader", {
          name: column,
        })
      ).toBeInTheDocument();
    });

    const user = userData.entries[0];
    expect(
      gridUtils.getByRole("cell", {
        name: user.email,
      })
    ).toBeInTheDocument();
    expect(
      gridUtils.getByRole("cell", {
        name: user.full_name,
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
        name: searchData.entries[0].email,
      })
    ).toBeInTheDocument();
  });

  it("should sort data when grid table header is clicked", async () => {
    const { gridTable } = setup();
    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));

    const gridUtils = within(gridTable);
    const header = gridUtils.getByRole("columnheader", {
      name: "Email",
    });
    act(() => {
      userEvent.click(header);
    });
    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));
    expect(screen.getByText("🔼")).toBeInTheDocument();
    expect(
      gridUtils.getByRole("cell", {
        name: sortData.entries[0].email,
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
        name: paginationData.entries[0].email,
      })
    ).toBeInTheDocument();
  });

  it("should show new user modal when new user button is clicked", async () => {
    const { clickNewButton } = setup();

    clickNewButton();
    const dialogUtils = within(screen.getByRole("dialog"));
    expect(dialogUtils.getByText(/new user/i)).toBeInTheDocument();
  });

  it("should show edit user modal when edit button is clicked", async () => {
    const { gridTable } = setup();
    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));

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
    const dialogUtils = within(screen.getByRole("dialog"));
    expect(dialogUtils.getByText(/edit user/i)).toBeInTheDocument();
  });

  it("should show confirmation modal when delete button is clicked", async () => {
    const { gridTable } = setup();
    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));

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
