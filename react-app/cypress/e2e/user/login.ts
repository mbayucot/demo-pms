// type definitions for Cypress object "cy"
/// <reference types="cypress" />

describe("login", function () {
  const username = Cypress.env("username");
  const password = Cypress.env("password");

  it("should login an existing user", () => {
    cy.visit("/");
    cy.findByText("Log in").click();
    cy.findByLabelText(/Email Address/i).type(username);
    cy.findByLabelText(/password/i).type(password);
    cy.findByRole("button", { name: /sign in/i }).click();
    cy.url().should("eq", `${Cypress.config().baseUrl}projects`);
  });
});
