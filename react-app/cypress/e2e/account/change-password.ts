// type definitions for Cypress object "cy"
/// <reference types="cypress" />
import faker from "faker";

describe("Change Password", () => {
  const users = Cypress.env("users");
  const role = "client";
  const user = users[role];

  let oldPassword: string;
  let newPassword: string;
  let confirmPassword: string;

  before(() => {
    oldPassword = user.password;
    newPassword = `${faker.internet.password()}!2`;
    confirmPassword = newPassword;

    cy.clearLocalStorageCache();
    cy.login(role);
  });

  after(() => {
    cy.logout();
  });

  beforeEach(() => {
    Cypress.Cookies.preserveOnce("token");
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  it("should navigate to account page", () => {
    cy.get("nav")
      .findByRole("link", { name: /account/i })
      .click();
    cy.findByRole("heading", { name: /change password/i }).should("be.visible");
  });

  it("should update password", () => {
    cy.findByLabelText(/old password/i)
      .clear()
      .type(oldPassword);
    cy.findByLabelText(/new password/i)
      .clear()
      .type(newPassword);
    cy.findByLabelText(/confirm new password/i)
      .clear()
      .type(confirmPassword);
    cy.findByRole("button", { name: /save/i }).click();
    cy.findByText(/uour password has been successfully changed./i).should(
      "be.visible"
    );
  });
});
