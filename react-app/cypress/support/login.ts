Cypress.Commands.add("login", (role: string) => {
  const users = Cypress.env("users");
  const user = users[role];

  if (role === "client") {
    cy.visit("/");
    cy.findByRole("link", { name: /log in/i }).click();
  } else {
    cy.visit("/admin/login");
  }

  cy.findByLabelText(/email address/i).type(user.email);
  cy.findByLabelText(/password/i).type(user.password);
  cy.findByRole("button", { name: /sign in/i }).click();
  cy.url().should("include", "/projects");
});

Cypress.Commands.add("logout", () => {
  cy.get("nav").get("button[id=account-dropdown]").click();
  cy.findByText(/sign out/i).should("be.visible");
  cy.findByText(/sign out/i).click();
});
