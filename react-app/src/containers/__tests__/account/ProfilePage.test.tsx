import React from "react";
import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { cache, SWRConfig } from "swr";
import { setupServer } from "msw/node";

import ProfilePage from "../../account/ProfilePage";
import { AuthProvider } from "../../../contexts/auth";

import { handlers } from "../../__mocks__/account/user";
import { data as userData } from "../../../fixtures/user";

const renderForm = () => {
  const utils = render(
    <AuthProvider>
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <ProfilePage />
      </SWRConfig>
    </AuthProvider>
  );
  const user = userData.entries[0];
  return {
    utils,
    user,
  };
};

const setup = () => {
  const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
  const firstNameInput = screen.getByLabelText(
    /first name/i
  ) as HTMLInputElement;
  const lastNameInput = screen.getByLabelText(/last name/i) as HTMLInputElement;
  const changeEmailInput = (value: string) =>
    fireEvent.change(emailInput, { target: { value: value } });
  const changeFirstNameInput = (value: string) =>
    fireEvent.change(firstNameInput, { target: { value: value } });
  const changeLastNameInput = (value: string) =>
    fireEvent.change(lastNameInput, { target: { value: value } });
  const submitButton = screen.getByRole("button", {
    name: /update profile/i,
  });
  const clickSubmit = () => userEvent.click(submitButton);
  return {
    emailInput,
    firstNameInput,
    lastNameInput,
    submitButton,
    changeEmailInput,
    changeFirstNameInput,
    changeLastNameInput,
    clickSubmit,
  };
};

describe("ProfilePage", () => {
  const server = setupServer(...handlers);

  beforeAll(() => server.listen());

  beforeEach(() => {
    cache.clear();
  });

  afterAll(() => server.close());

  afterEach(() => {
    server.resetHandlers();
  });

  it("should render page and user info", async () => {
    const { user } = renderForm();
    expect(
      screen.getByRole("heading", { name: "Profile" })
    ).toBeInTheDocument();
    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));

    const { emailInput, firstNameInput, lastNameInput } = setup();
    expect(emailInput.value).toBe(user.email);
    expect(firstNameInput.value).toBe(user.first_name);
    expect(lastNameInput.value).toBe(user.last_name);
  });

  it("should submit the form if valid", async () => {
    const { user } = renderForm();
    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));

    const {
      changeEmailInput,
      changeFirstNameInput,
      changeLastNameInput,
      clickSubmit,
    } = setup();
    changeEmailInput(user.email);
    changeFirstNameInput(user.first_name);
    changeLastNameInput(user.last_name);
    act(() => {
      clickSubmit();
    });
    expect(
      await screen.findByText(/your profile has been successfully updated./i)
    ).toBeInTheDocument();
  });

  it("should show error messages if form is invalid", async () => {
    renderForm();
    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));

    const { changeFirstNameInput, clickSubmit } = setup();
    changeFirstNameInput("");
    act(() => {
      clickSubmit();
    });
    expect(
      await screen.findByText(/first name is required/i)
    ).toBeInTheDocument();

    changeFirstNameInput("__test_error_input__");
    act(() => {
      clickSubmit();
    });
    expect(
      await screen.findByText(/__test_error_description__/i)
    ).toBeInTheDocument();
  });
});
