import React from "react";
import {
  render,
  screen,
  act,
  waitFor,
  fireEvent,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import faker from "faker";
import { SWRConfig, cache } from "swr";
import { rest } from "msw";
import { setupServer } from "msw/node";
import userEvent from "@testing-library/user-event";

import EditUserModal from "../../../admin/users/EditUserModal";

import { handlers, data } from "../../../__mocks__/user";

const renderEditUserModal = () => {
  const onHide = jest.fn();

  const props = {
    id: 1,
    onHide,
  };
  const url = `/admin/users/${props.id}`;
  const user = {
    email: faker.internet.email(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    role: "staff",
  };

  render(
    <SWRConfig value={{ dedupingInterval: 0 }}>
      <EditUserModal {...props} />
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
    roleInput,
    submitButton,
    changeEmailInput,
    changeFirstNameInput,
    changeLastNameInput,
    changeRoleInput,
    clickSubmit,
  };
};

describe("EditUserModal", () => {
  const server = setupServer(...handlers);

  beforeAll(() => server.listen());

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => server.close());

  it("should show edit user modal and user info", async () => {
    const { url, user, onHide } = renderEditUserModal();
    expect(screen.getByText(/Edit User/i)).toBeInTheDocument();
    expect(screen.getByRole(/status/i)).toHaveTextContent(/loading/i);

    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));

    const {
      emailInput,
      firstNameInput,
      lastNameInput,
      roleInput,
      changeEmailInput,
      clickSubmit,
    } = await setupModalForm();

    expect(emailInput.value).toBe(user.email);
    expect(firstNameInput.value).toBe(user.first_name);
    expect(lastNameInput.value).toBe(user.last_name);
    expect(roleInput.value).toBe(user.role);

    changeEmailInput("");
    act(() => {
      clickSubmit();
    });
    expect(await screen.findByText(/Email is required/)).toBeDefined();

    changeEmailInput(faker.internet.email());
    server.use(
      rest.patch(url, (req, res, ctx) => {
        return res.once(
          ctx.status(422),
          ctx.json({ email: "Email already exists" })
        );
      })
    );
    await act(async () => {
      clickSubmit();
    });
    expect(await screen.findByText(/Email already exists/)).toBeDefined();

    changeEmailInput(user.email);
    act(() => {
      clickSubmit();
    });
    await waitFor(() => {
      expect(onHide).toHaveBeenCalledWith(true);
    });
  });
});
