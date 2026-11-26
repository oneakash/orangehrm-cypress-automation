import {
  normalizeWhitespace,
  OrangeHrmUser,
  SelectedEmployee,
  UserRole,
  UserStatus,
} from '../utils/userDataGenerator';

interface EmployeeApiRecord {
  firstName?: string;
  middleName?: string;
  lastName?: string;
}

export class UserFormPage {
  private readonly pageHeading = 'h6.orangehrm-main-title';
  private readonly selectDropdownTrigger = '.oxd-select-text';
  private readonly selectOption = '.oxd-select-dropdown [role="option"]';
  private readonly autocompleteDropdown = '.oxd-autocomplete-dropdown';
  private readonly autocompleteOption = '.oxd-autocomplete-dropdown .oxd-autocomplete-option';
  private readonly submitButton = 'button[type="submit"]';
  private readonly toastMessage = '.oxd-toast';
  private readonly loadingSpinner = '.oxd-loading-spinner';

  private getFieldGroup(exactLabel: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy
      .contains('.oxd-label', new RegExp(`^${exactLabel}$`))
      .closest('.oxd-input-group');
  }

  assertAddUserPageLoaded(): void {
    cy.url().should('include', '/admin/saveSystemUser');
    cy.get(this.pageHeading).should('be.visible').and('have.text', 'Add User');
  }

  assertEditUserPageLoaded(): void {
    cy.url().should('match', /\/admin\/saveSystemUser\/\d+$/);
    cy.get(this.pageHeading).should('be.visible').and('have.text', 'Edit User');
    cy.get(this.loadingSpinner).should('not.exist');
  }

  selectUserRole(role: UserRole): void {
    this.getFieldGroup('User Role').find(this.selectDropdownTrigger).click();
    cy.contains(this.selectOption, role).should('be.visible').click();
    this.getFieldGroup('User Role')
      .find('.oxd-select-text-input')
      .should('have.text', role);
  }

  selectStatus(status: UserStatus): void {
    this.getFieldGroup('Status').find(this.selectDropdownTrigger).click();
    cy.contains(this.selectOption, status).should('be.visible').click();
    this.getFieldGroup('Status')
      .find('.oxd-select-text-input')
      .should('have.text', status);
  }

  selectFirstAvailableEmployee(searchHint = 'a'): Cypress.Chainable<SelectedEmployee> {
    cy.intercept('GET', '**/api/v2/pim/employees*').as('searchEmployees');

    this.getFieldGroup('Employee Name').find('input').clear().type(searchHint);

    return cy.wait('@searchEmployees').then((interception) => {
      expect(interception.response?.statusCode).to.eq(200);

      const employees: EmployeeApiRecord[] = interception.response?.body?.data ?? [];
      expect(employees.length, 'At least one employee returned').to.be.greaterThan(0);

      // Wait on the stable container so Vue finishes replacing "Searching...."
      cy.get(this.autocompleteDropdown)
        .should('be.visible')
        .and('not.contain.text', 'Searching')
        .and('not.contain.text', 'No Records Found');

      return cy
        .get(this.autocompleteOption)
        .first()
        .should('be.visible')
        .invoke('text')
        .then((rawOptionText: string) => {
          const fullName = normalizeWhitespace(rawOptionText);

          // Re-query fresh instead of clicking a cached DOM reference
          cy.get(this.autocompleteOption).first().click();

          this.getFieldGroup('Employee Name')
            .find('input')
            .should(($input) => {
              expect(normalizeWhitespace(String($input.val()))).to.eq(fullName);
            });

          // Admin Users table shows "First Last" without middleName
          const matchedEmployee = employees.find((emp) => {
            const combined = normalizeWhitespace(
              [emp.firstName, emp.middleName, emp.lastName].filter(Boolean).join(' ')
            );
            return combined === fullName;
          });

          const tableName = matchedEmployee
            ? normalizeWhitespace(
                [matchedEmployee.firstName, matchedEmployee.lastName]
                  .filter(Boolean)
                  .join(' ')
              )
            : fullName;

          return cy.wrap<SelectedEmployee>({ fullName, tableName });
        });
    });
  }

  enterUsername(username: string): void {
    this.getFieldGroup('Username')
      .find('input')
      .clear()
      .type(username)
      .should('have.value', username);
  }

  enterPasswordAndConfirmation(password: string): void {
    this.getFieldGroup('Password').find('input').clear().type(password, { log: false });
    this.getFieldGroup('Confirm Password')
      .find('input')
      .clear()
      .type(password, { log: false });
  }

  saveUser(): void {
    cy.intercept('POST', '**/api/v2/admin/users').as('createUser');
    cy.intercept('GET', '**/api/v2/admin/users*').as('reloadUsers');

    cy.get('.oxd-input-field-error-message').should('not.exist');
    cy.get(this.submitButton).should('be.enabled').click();

    cy.wait('@createUser').its('response.statusCode').should('eq', 200);
    cy.get(this.toastMessage)
      .should('be.visible')
      .and('contain.text', 'Successfully Saved');

    cy.url().should('include', '/admin/viewSystemUsers');
    cy.wait('@reloadUsers').its('response.statusCode').should('eq', 200);
  }

  verifyUserDetails(expectedUser: Omit<OrangeHrmUser, 'password'>): void {
    this.assertEditUserPageLoaded();

    this.getFieldGroup('User Role')
      .find('.oxd-select-text-input')
      .should('have.text', expectedUser.role);

    this.getFieldGroup('Status')
      .find('.oxd-select-text-input')
      .should('have.text', expectedUser.status);

    this.getFieldGroup('Username')
      .find('input')
      .should('have.value', expectedUser.username);

    this.getFieldGroup('Employee Name')
      .find('input')
      .should(($input) => {
        const actualName = normalizeWhitespace(String($input.val()));
        expect(actualName).to.eq(normalizeWhitespace(expectedUser.employeeName));
      });
  }
}

export const userFormPage = new UserFormPage();