import { normalizeWhitespace, OrangeHrmUser } from '../utils/userDataGenerator';

export class AdminUsersPage {
  private readonly filterPanel = '.oxd-table-filter';
  private readonly tableRowSelector = '.oxd-table-body .oxd-table-card .oxd-table-row';
  private readonly tableCell = '.oxd-table-cell';
  private readonly editIcon = 'i.bi-pencil-fill';
  private readonly loadingSpinner = '.oxd-loading-spinner';

  clickAddUser(): void {
    cy.contains('button', 'Add').should('be.visible').click();
  }

  searchByUsername(username: string): void {
    cy.intercept('GET', '**/api/v2/admin/users*').as('searchUsers');

    cy.get(this.filterPanel)
      .contains('.oxd-label', /^Username$/)
      .closest('.oxd-input-group')
      .find('input')
      .clear()
      .type(username)
      .should('have.value', username);

    cy.get(this.filterPanel).find('button[type="submit"]').click();

    cy.wait('@searchUsers').its('response.statusCode').should('eq', 200);
    cy.get(this.loadingSpinner).should('not.exist');
  }

  assertSearchResultMatches(expectedUser: Omit<OrangeHrmUser, 'password'>): void {
    cy.get(this.tableRowSelector).should('have.length', 1);

    cy.get(this.tableRowSelector)
      .first()
      .within(() => {
        cy.get(this.tableCell).eq(1).should('have.text', expectedUser.username);
        cy.get(this.tableCell).eq(2).should('have.text', expectedUser.role);
        cy.get(this.tableCell)
          .eq(3)
          .should(($cell) => {
            expect(normalizeWhitespace($cell.text())).to.eq(
              normalizeWhitespace(expectedUser.employeeTableName)
            );
          });
        cy.get(this.tableCell).eq(4).should('have.text', expectedUser.status);
      });
  }

  openUserDetailsFromTable(username: string): void {
    cy.intercept('GET', '**/api/v2/admin/users/*').as('loadUserDetails');

    cy.contains(this.tableRowSelector, username)
      .find(this.editIcon)
      .closest('button')
      .should('be.visible')
      .click();

    cy.wait('@loadUserDetails').its('response.statusCode').should('eq', 200);
  }
}

export const adminUsersPage = new AdminUsersPage();