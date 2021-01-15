import React from "react";
import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import { MemoryRouter, Route } from "react-router-dom";
import { cache, SWRConfig } from "swr";
import { setupServer } from "msw/node";

import ConfirmAccountPage from "../ConfirmAccountPage";

import { handlers } from "../__mocks__/user";

const setup = () => {
  const utils = render(
    <SWRConfig value={{ dedupingInterval: 0 }}>
      <MemoryRouter initialEntries={[`/confirmation/:token`]}>
        <Route path="/confirmation/:token">
          <ConfirmAccountPage />
        </Route>
      </MemoryRouter>
    </SWRConfig>
  );
  return {
    utils,
  };
};

describe("ConfirmAccountPage", () => {
  const server = setupServer(...handlers);

  beforeAll(() => server.listen());

  beforeEach(() => {
    cache.clear();
  });

  afterAll(() => server.close());

  afterEach(() => {
    server.resetHandlers();
  });

  it("should render page", async () => {
    setup();
    await waitForElementToBeRemoved(() => screen.getByRole(/status/i));
    expect(
      screen.getByText(/your email address has been successfully confirmed./i)
    ).toBeInTheDocument();
    expect(
      (screen.getByText(/return to sign in/i) as HTMLAnchorElement).href
    ).toMatch("/");
  });
});
