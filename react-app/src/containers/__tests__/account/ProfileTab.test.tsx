import React from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SWRConfig } from "swr";
import { setupServer } from "msw/node";

import ProfilePage from "../../account/ProfilePage";
import { handlers, data as userData } from "../../__mocks__/user";

const renderForm = () => {
  const url = `/users`;
  const utils = render(
    <SWRConfig value={{ dedupingInterval: 0 }}>
      <ProfilePage />
    </SWRConfig>
  );
  const user = userData.entries[0];
  return {
    utils,
    url,
    user,
  };
};

const setup = () => {
  const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
  const firstnameInput = screen.getByLabelText(
    /first name/i
  ) as HTMLInputElement;
  const lastnameInput = screen.getByLabelText(/last name/i) as HTMLInputElement;
  const changeEmailInput = (value: string) =>
    fireEvent.change(emailInput, { target: { value: value } });
  const changeFirstnameInput = (value: string) =>
    fireEvent.change(firstnameInput, { target: { value: value } });
  const changeLastnameInput = (value: string) =>
    fireEvent.change(lastnameInput, { target: { value: value } });
  const submitButton = screen.getByRole("button", {
    name: /Save/i,
  });
  const clickSubmit = () => userEvent.click(submitButton);
  return {
    emailInput,
    firstnameInput,
    lastnameInput,
    submitButton,
    changeEmailInput,
    changeFirstnameInput,
    changeLastnameInput,
    clickSubmit,
  };
};

describe("ProfilePage", () => {
  const server = setupServer(...handlers);

  beforeAll(() => server.listen());

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => server.close());

  it("should render page and user profile", async () => {
    const { user } = renderForm();
    expect(
      screen.getByRole("heading", { name: /Profile/i })
    ).toBeInTheDocument();
    expect(screen.getByRole(/status/i)).toHaveTextContent(/loading/i);

    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));

    const {
      emailInput,
      firstnameInput,
      lastnameInput,
      changeEmailInput,
      changeFirstnameInput,
      changeLastnameInput,
      submitButton,
      clickSubmit,
    } = setup();

    expect(emailInput.value).toBe(user.email);
    expect(firstnameInput.value).toBe(user.first_name);
    expect(lastnameInput.value).toBe(user.last_name);

    changeEmailInput("");
    changeFirstnameInput("");
    changeLastnameInput("");
    act(() => {
      clickSubmit();
    });
    expect(await screen.findByText(/Email is required/)).toBeDefined();
    expect(await screen.findByText(/First name is required/)).toBeDefined();
    expect(await screen.findByText(/Last name is required/)).toBeDefined();

    changeEmailInput(user.email);
    changeFirstnameInput(user.first_name);
    changeLastnameInput(user.last_name);

    act(() => {
      clickSubmit();
    });
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });

    expect(screen.getByText("profile change successful")).toBeInTheDocument();
  });
});
