Cypress.Commands.add("clickConfirmModalOkButton", () => {
  cy.findByText(/confirmation/i).should("be.visible");
  cy.findByRole("dialog").within(() => {
    cy.findByText(/confirmation/i).should("be.visible");
    cy.findByRole("button", { name: /ok/i }).click();
  });
  cy.findByRole("dialog").should("not.exist");
});
