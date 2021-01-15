// type definitions for Cypress object "cy"
/// <reference types="cypress" />
import faker from "faker";

describe("Task", () => {
  let projectName: string;
  let summary: string;
  let newSummary: string;
  let description: string;
  let status: string;

  before(() => {
    projectName = faker.random.word();
    summary = faker.random.word();
    newSummary = faker.random.word();
    description = faker.random.word();
    status = "pending";

    cy.clearLocalStorageCache();
    cy.login("client");

    cy.createProject(projectName);
    cy.navigateToTasks(projectName);
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

  it("should create a new task", () => {
    cy.findByRole("button", { name: /new/i }).click();
    cy.findByRole("dialog").within(() => {
      cy.findByText(/new task/i).should("be.visible");
      cy.findByLabelText(/summary/i).type(summary);
      cy.findByLabelText(/description/i).type(description);
      cy.findByLabelText(/status/i).select(status);
      cy.findByRole("button", { name: /save/i }).click();
    });
    cy.findByRole("dialog").should("not.exist");
  });

  it("should search a task", () => {
    cy.searchByText(summary);
    cy.get("table").contains("tr", summary).should("be.visible");
  });

  it("should update a task", () => {
    cy.clickEditButtonByRowName(summary);
    cy.findByRole("dialog").within(() => {
      cy.findByText(/edit task/i).should("be.visible");
      cy.findByLabelText(/summary/i).should("have.value", summary);
      cy.findByLabelText(/description/i).should("have.value", description);
      cy.findByLabelText(/status/i).should("have.value", status);
      cy.findByLabelText(/summary/i)
        .clear()
        .type(newSummary);
      cy.findByRole("button", { name: /save/i }).click();
    });
    cy.findByRole("dialog").should("not.exist");
  });

  it("should delete a task", () => {
    cy.searchByText(newSummary);
    cy.clickDeleteButtonByRowName(newSummary);
    cy.clickConfirmModalOkButton();
    cy.findByText(newSummary).should("not.exist");
  });
});
