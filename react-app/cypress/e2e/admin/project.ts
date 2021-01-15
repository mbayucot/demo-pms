// type definitions for Cypress object "cy"
/// <reference types="cypress" />
import faker from "faker";

describe("Project", () => {
  let name: string;
  let newName: string;

  before(() => {
    name = faker.lorem.word();
    newName = faker.lorem.word();

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

  it("should navigate to projects page", () => {
    cy.get("nav")
      .findByRole("link", { name: /projects/i })
      .click();
    cy.findByRole("heading", { name: /projects/i }).should("be.visible");
    cy.get("table").should("be.visible");
  });

  it("should create a new project", () => {
    cy.createProject(name, "admin");
  });

  it("should search a project", () => {
    cy.searchByText(name);
    cy.get("table").contains("tr", name).should("be.visible");
  });

  it("should update a project", () => {
    cy.clickEditButtonByRowName(name);
    cy.findByRole("dialog").within(() => {
      cy.findByText(/edit project/i).should("be.visible");
      cy.findByLabelText(/name/i).should("have.value", name);
      cy.findByLabelText(/name/i).clear().type(newName);
      cy.findByRole("button", { name: /save/i }).click();
    });
    cy.findByRole("dialog").should("not.exist");
  });

  it("should delete a project", () => {
    cy.searchByText(newName);
    cy.clickDeleteButtonByRowName(newName);
    cy.clickConfirmModalOkButton();
    cy.findByText(newName).should("not.exist");
  });
});
