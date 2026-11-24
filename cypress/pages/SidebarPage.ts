export class SidebarPage {
  private readonly menuItem = 'a.oxd-main-menu-item';
  private readonly topbarModuleHeader = 'h6.oxd-topbar-header-breadcrumb-module';

  navigateToAdminModule(): void {
    cy.intercept('GET', '**/api/v2/admin/users*').as('loadAdminUsers');

    cy.contains(this.menuItem, 'Admin').should('be.visible').click();

    cy.wait('@loadAdminUsers').its('response.statusCode').should('eq', 200);
    cy.url().should('include', '/admin/viewSystemUsers');
    cy.get(this.topbarModuleHeader)
      .should('be.visible')
      .and('have.text', 'Admin');
  }
}

export const sidebarPage = new SidebarPage();