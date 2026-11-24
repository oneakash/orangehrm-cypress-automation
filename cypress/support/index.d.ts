/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Authenticates as Admin using credentials stored in cypress.env.json.
     */
    loginAsAdmin(): Chainable<void>;
  }
}