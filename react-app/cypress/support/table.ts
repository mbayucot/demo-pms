Cypress.Commands.add("clickEditButtonByRowName", (name: string) => {
  cy.get("table")
    .contains("tr", name)
    .within(() => {
      cy.findByRole("button", { name: /edit/i }).click();
    });
});

Cypress.Commands.add("clickDeleteButtonByRowName", (name: string) => {
  cy.get("table")
    .contains("tr", name)
    .within(() => {
      cy.findByRole("button", { name: /delete/i }).click();
    });
});
