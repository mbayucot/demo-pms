// type definitions for Cypress object "cy"
/// <reference types="cypress" />

describe("login", function () {
  const users = Cypress.env("users");
  const { email, password } = users.client;

  after(() => {
    cy.logout();
  });

  it("should login an existing user", () => {
    cy.visit("/");
    cy.findByRole("link", { name: /log in/i }).click();
    cy.findByLabelText(/email address/i).type(email);
    cy.findByLabelText(/password/i).type(password);
    cy.findByRole("button", { name: /sign in/i }).click();
    cy.url().should("include", "/projects");
  });
});
