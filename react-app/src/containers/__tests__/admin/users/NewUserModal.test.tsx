import React from "react";
import {
  render,
  screen,
  act,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import faker from "faker";
import userEvent from "@testing-library/user-event";
import { SWRConfig, cache } from "swr";
import { rest } from "msw";
import { setupServer } from "msw/node";

import NewUserModal from "../../../admin/users/NewUserModal";

import { handlers, data } from "../../../__mocks__/user";

const renderNewUserModal = () => {
  const onHide = jest.fn();

  const props = {
    id: 1,
    onHide,
  };
  const url = `/admin/users`;
  const user = {
    email: faker.internet.email(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    role: "admin",
  };

  render(
    <SWRConfig value={{ dedupingInterval: 0 }}>
      <NewUserModal {...props} />
    </SWRConfig>
  );
  const error = { name: "__error__" };
  return {
    onHide,
    url,
    user,
    error,
  };
};

const setupModalForm = async () => {
  const emailInput = (await screen.findByLabelText(
    /email/i
  )) as HTMLInputElement;
  const firstNameInput = (await screen.findByLabelText(
    /first name/i
  )) as HTMLInputElement;
  const lastNameInput = (await screen.findByLabelText(
    /last name/i
  )) as HTMLInputElement;
  const roleInput = (await screen.findByLabelText(/role/i)) as HTMLInputElement;
  const changeEmailInput = (value: string) =>
    fireEvent.change(emailInput, { target: { value: value } });
  const changeFirstNameInput = (value: string) =>
    fireEvent.change(firstNameInput, { target: { value: value } });
  const changeLastNameInput = (value: string) =>
    fireEvent.change(lastNameInput, { target: { value: value } });
  const changeRoleInput = (value: string) =>
    fireEvent.change(roleInput, { target: { value: value } });
  const submitButton = screen.getByRole("button", {
    name: /Save/i,
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
    changeRoleInput,
    clickSubmit,
  };
};

describe("NewUserModal", () => {
  const server = setupServer(...handlers);

  beforeAll(() => server.listen());

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => server.close());

  it("should show new user modal and user info", async () => {
    const { url, user, onHide } = renderNewUserModal();
    expect(screen.getByText(/New User/i)).toBeInTheDocument();

    const {
      changeEmailInput,
      changeFirstNameInput,
      changeLastNameInput,
      changeRoleInput,
      clickSubmit,
    } = await setupModalForm();

    changeEmailInput(" ");
    expect(await screen.findByText(/Email is invalid/)).toBeInTheDocument();
    expect(
      await screen.findByText(/First name is required/)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Last name is required/)
    ).toBeInTheDocument();
    expect(await screen.findByText(/Role is required/)).toBeInTheDocument();

    await changeEmailInput(user.email);
    await changeFirstNameInput(user.first_name);
    await changeLastNameInput(user.last_name);
    await changeRoleInput(user.role);
    act(() => {
      clickSubmit();
    });

    await waitFor(() => {
      expect(onHide).toHaveBeenCalledWith(true);
    });
  });

  it("should show new user modal and error message", async () => {
    const { url, user, onHide } = renderNewUserModal();

    const {
      changeEmailInput,
      changeFirstNameInput,
      changeLastNameInput,
      changeRoleInput,
      clickSubmit,
    } = await setupModalForm();

    server.use(
      rest.post(url, (req, res, ctx) => {
        return res.once(
          ctx.status(422),
          ctx.json({ email: "Email already exists" })
        );
      })
    );

    await changeEmailInput(user.email);
    await changeFirstNameInput(user.first_name);
    await changeLastNameInput(user.last_name);
    await changeRoleInput(user.role);
    act(() => {
      clickSubmit();
    });

    expect(await screen.findByText(/Email already exists/)).toBeInTheDocument();
    await waitFor(() => {
      expect(onHide).not.toHaveBeenCalledWith();
    });
  });
});
