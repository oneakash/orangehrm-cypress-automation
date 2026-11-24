export class LoginPage {
  private readonly usernameInput = 'input[name="username"]';
  private readonly passwordInput = 'input[name="password"]';
  private readonly submitButton = 'button[type="submit"]';
  private readonly dashboardHeader = 'h6.oxd-topbar-header-breadcrumb-module';

  visit(): void {
    cy.visit('/web/index.php/auth/login');
    cy.get(this.usernameInput).should('be.visible');
  }

  login(username: string, password: string): void {
    cy.get(this.usernameInput).clear().type(username);
    cy.get(this.passwordInput).clear().type(password, { log: false });
    cy.get(this.submitButton).click();
  }

  assertLoginSucceeded(): void {
    cy.url().should('include', '/dashboard/index');
    cy.get(this.dashboardHeader)
      .should('be.visible')
      .and('have.text', 'Dashboard');
  }
}

export const loginPage = new LoginPage();