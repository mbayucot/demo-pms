Cypress.Commands.add("createProject", (name: string, domain?: string) => {
  cy.findByRole("button", { name: /new/i }).click();
  cy.findByRole("dialog").within(() => {
    cy.findByText(/new project/i).should("be.visible");
    cy.wait(300);
    cy.findByLabelText(/name/i).type(name).wait(300);
    if (domain === "admin") {
      cy.get("#client").type("a{enter}{enter}{enter}");
    }
    cy.findByRole("button", { name: /save/i }).click();
  });
  cy.findByRole("dialog").should("not.exist");
});
