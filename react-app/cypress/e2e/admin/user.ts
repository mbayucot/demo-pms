// type definitions for Cypress object "cy"
/// <reference types="cypress" />
import faker from "faker";

describe("User", () => {
  let email: string;
  let firstName: string;
  let lastName: string;
  let password: string;
  let role: string;
  let newFirstName: string;

  before(() => {
    email = faker.internet.email().toLowerCase();
    firstName = faker.name.firstName();
    lastName = faker.name.lastName();
    password = `${faker.internet.password()}!2`;
    role = "staff";
    newFirstName = faker.lorem.word();

    cy.clearLocalStorageCache();
    cy.login("admin");
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

  it("should navigate to users page from projects page", () => {
    cy.get("nav").findByRole("link", { name: /users/i }).click();
    cy.findByRole("heading", { name: /users/i }).should("be.visible");
    cy.get("table").should("be.visible");
  });

  it("should create a new user", () => {
    cy.findByRole("button", { name: /new/i }).click();
    cy.findByRole("dialog").within(() => {
      cy.findByText(/new user/i).should("be.visible");
      cy.findByLabelText(/email/i).type(email);
      cy.findByLabelText(/first name/i).type(firstName);
      cy.findByLabelText(/last name/i).type(lastName);
      cy.findByLabelText(/password/i).type(password);
      cy.findByLabelText(/role/i).select(role);
      cy.findByRole("button", { name: /save/i }).click();
    });
    cy.findByRole("dialog").should("not.exist");
  });

  it("should search a user", () => {
    cy.searchByText(email);
    cy.get("table").contains("tr", email).should("be.visible");
  });

  it("should update a user", () => {
    cy.clickEditButtonByRowName(email);
    cy.findByRole("dialog").within(() => {
      cy.findByText(/edit user/i).should("be.visible");
      cy.findByLabelText(/email/i).should("have.value", email);
      cy.findByLabelText(/first name/i).should("have.value", firstName);
      cy.findByLabelText(/last name/i).should("have.value", lastName);
      cy.findByLabelText(/role/i).should("have.value", role);
      cy.findByLabelText(/first name/i)
        .clear()
        .type(newFirstName);
      cy.findByRole("button", { name: /save/i }).click();
    });
    cy.findByRole("dialog").should("not.exist");
  });

  it("should delete a user", () => {
    cy.searchByText(email);
    cy.clickDeleteButtonByRowName(email);
    cy.clickConfirmModalOkButton();
    cy.findByText(email).should("not.exist");
  });
});
