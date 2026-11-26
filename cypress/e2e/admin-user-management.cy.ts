import { adminUsersPage } from '../pages/AdminUsersPage';
import { sidebarPage } from '../pages/SidebarPage';
import { userFormPage } from '../pages/UserFormPage';
import { generateUniqueUserData, OrangeHrmUser } from '../utils/userDataGenerator';

describe('OrangeHRM Admin - User Management', () => {
  it('should create a new user, search by username, and verify all saved user details', () => {
    const generatedUser = generateUniqueUserData({
      role: 'ESS',
      status: 'Enabled',
    });

    // Navigate to OrangeHRM and log in using environment credentials
    cy.loginAsAdmin();

    // Navigate to the Admin module
    sidebarPage.navigateToAdminModule();

    // Add a new user with dynamically generated username and live employee selection
    adminUsersPage.clickAddUser();
    userFormPage.assertAddUserPageLoaded();

    userFormPage.selectUserRole(generatedUser.role);
    userFormPage.selectStatus(generatedUser.status);

    userFormPage.selectFirstAvailableEmployee('p').then((selectedEmployee) => {
      const createdUser: OrangeHrmUser = {
        ...generatedUser,
        employeeName: selectedEmployee.fullName,
        employeeTableName: selectedEmployee.tableName,
      };
      userFormPage.enterUsername(createdUser.username);
      userFormPage.enterPasswordAndConfirmation(createdUser.password);
      userFormPage.saveUser();

      // Search for the newly created user by Username
      adminUsersPage.searchByUsername(createdUser.username);
      adminUsersPage.assertSearchResultMatches(createdUser);

      // Open the matched user record and verify all details match creation input
      adminUsersPage.openUserDetailsFromTable(createdUser.username);
      userFormPage.verifyUserDetails(createdUser);
    });
  });
});