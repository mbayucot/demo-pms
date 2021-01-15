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
    cy.login("admin");

    cy.createProject(projectName, "admin");
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

  it("should navigate to tasks page from projects page", () => {
    cy.get("table")
      .contains("tr", projectName)
      .within(() => {
        cy.findByText(/tasks/i).click();
      });
    cy.findByRole("heading", { name: /tasks/i }).should("be.visible");
    cy.get("table").should("be.visible");
  });

  it("should create a new task", () => {
    cy.findByRole("button", { name: /new/i }).click();
    cy.findByRole("dialog").within(() => {
      cy.findByText(/new task/i).should("be.visible");
      cy.findByLabelText(/summary/i).type(summary);
      cy.findByLabelText(/description/i).type(description);
      cy.findByLabelText(/status/i).select(status);
      cy.get("#assignee").type("a{enter}{enter}{enter}");
      cy.findByRole("button", { name: /save/i }).click();
    });
    cy.findByText(/new task/i).should("not.be.visible");
    cy.get("table").contains("tr", summary).should("be.visible");
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
    cy.findByText(/edit task/i).should("not.be.visible");
    cy.get("table").contains("tr", newSummary).should("be.visible");
  });

  it("should delete a task", () => {
    cy.clickDeleteButtonByRowName(newSummary);
    cy.clickConfirmModalOkButton();
    cy.get("table").contains("tr", newSummary).should("not.be.visible");
  });
});
