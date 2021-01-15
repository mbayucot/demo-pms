// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    login(role: string): Chainable<Element>;
    logout(): Chainable<Element>;
    createProject(name: string, domain?: string): Chainable<Element>;
    navigateToTasks(projectName: string): Chainable<Element>;
    clickEditButtonByRowName(name: string): Chainable<Element>;
    clickDeleteButtonByRowName(name: string): Chainable<Element>;
    clickConfirmModalOkButton(): Chainable<Element>;
    searchByText(text: string): Chainable<Element>;
    saveLocalStorageCache(): Chainable<Element>;
    restoreLocalStorageCache(): Chainable<Element>;
    clearLocalStorageCache(): Chainable<Element>;
  }
}
