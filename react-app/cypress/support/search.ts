Cypress.Commands.add("searchByText", (text: string) => {
  cy.findByPlaceholderText(/search.../i)
    .clear()
    .type(text);
  cy.findByRole("button", { name: /search/i }).click();
});
