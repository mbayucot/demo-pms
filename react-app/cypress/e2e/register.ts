// type definitions for Cypress object "cy"
/// <reference types="cypress" />
import faker from "faker";

describe("registration", () => {
  it("should register a new user", () => {
    cy.visit("/");
    cy.findByText(/sign up/i).click();
    cy.findByLabelText(/Email Address/i).type(faker.internet.email());
    cy.findByLabelText(/password/i).type(faker.internet.password());
    cy.findByRole("button", { name: /create account/i }).click();
    cy.url().should("eq", `${Cypress.config().baseUrl}projects`);
  });
});
