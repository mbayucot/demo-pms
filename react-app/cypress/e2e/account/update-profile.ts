// type definitions for Cypress object "cy"
/// <reference types="cypress" />
import faker from "faker";

describe("Update Profile", () => {
  let firstName: string;
  let lastName: string;

  before(() => {
    firstName = faker.name.firstName();
    lastName = faker.name.lastName();

    cy.clearLocalStorageCache();
    cy.login("client");
  });

  /**
   *
   after(() => {
    cy.logout();
  });
   */

  beforeEach(() => {
    Cypress.Cookies.preserveOnce("token");
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  it("should navigate to account page", () => {
    cy.get("nav")
      .get("[data-cy=account-dropdown]")
      .click()
      .findByText(/profile/i)
      .click();
    cy.findByRole("heading", { name: /account/i }).should("be.visible");
  });

  it("should update profile info", () => {
    cy.findByLabelText(/first name/i)
      .clear()
      .type(firstName);
    cy.findByLabelText(/last name/i)
      .clear()
      .type(lastName);
    cy.findByRole("button", { name: /update profile/i }).click();
    cy.findByText(/your profile has been successfully updated./i).should(
      "be.visible"
    );
  });

  it("should update profile picture", () => {
    cy.get('[data-cy="fileInput"]').attachFile("avatar.jpg");

    cy.findByText(/crop your new profile picture/i).should("be.visible");
    cy.findByRole("button", { name: /set new profile picture/i }).click();
    cy.findByRole("dialog").should("not.exist");
  });
});
