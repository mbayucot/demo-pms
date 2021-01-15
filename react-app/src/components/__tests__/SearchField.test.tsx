import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import faker from "faker";

import SearchField from "../SearchField";

const setup = (overrides = {}) => {
  const onSubmit = jest.fn();
  const props = {
    ...overrides,
    onSubmit,
  };
  const searchText = `${faker.random.number()} ${faker.lorem.word()}`;
  const utils = render(<SearchField {...props} />);
  const changeSearchInput = (value: string) =>
    userEvent.type(utils.getByPlaceholderText(/search.../i), value);
  const clickSearch = () => userEvent.click(utils.getByLabelText(/search/i));
  return { searchText, clickSearch, changeSearchInput, onSubmit };
};

describe("SearchField", () => {
  it("should render search field", async () => {
    const placeholder = "__placeholder__";
    setup({ placeholder });
    expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument();
  });

  it("should submit when search button is clicked", async () => {
    const { searchText, clickSearch, changeSearchInput, onSubmit } = setup();
    await changeSearchInput(searchText);
    clickSearch();
    expect(onSubmit).toHaveBeenCalledWith(searchText);
  });
});
