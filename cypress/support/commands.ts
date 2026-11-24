import { loginPage } from '../pages/LoginPage';

Cypress.Commands.add('loginAsAdmin', () => {
  cy.env(['adminUsername', 'adminPassword']).then(({ adminUsername, adminPassword }) => {
    if (!adminUsername || !adminPassword) {
      throw new Error(
        'Missing adminUsername or adminPassword in cypress.env.json'
      );
    }

    loginPage.visit();
    loginPage.login(String(adminUsername), String(adminPassword));
    loginPage.assertLoginSucceeded();
  });
});