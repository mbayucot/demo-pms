Cypress.Commands.add("navigateToTasks", (projectName: string) => {
  cy.searchByText(projectName);
  cy.get("table")
    .contains("tr", projectName)
    .within(() => {
      cy.findByRole("link", { name: projectName }).click();
    });
  cy.findByRole("heading", { name: /tasks/i }).should("be.visible");
  cy.get("table").should("be.visible");
});
