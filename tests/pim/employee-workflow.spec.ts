import { env } from '../../src/config/env';
import { buildEmployee, buildEmployeeUpdate } from '../../src/data/employee.data';
import { expect, test } from '../../src/fixtures';

// The brief asks for login to be part of the workflow, so this test starts from a
// clean browser and logs in through the UI instead of using the stored session.
test.use({ storageState: { cookies: [], origins: [] } });

test(
  'PIM workflow: create, search, open, edit and verify an employee',
  { tag: ['@smoke', '@regression'] },
  async ({ page, loginPage, addEmployeePage, employeeListPage, personalDetailsPage, employeeApi }) => {
    const employee = buildEmployee();
    const update = buildEmployeeUpdate();

    await test.step('Log in', async () => {
      await loginPage.goto();
      await loginPage.login(env.username, env.password);
      await loginPage.expectLoggedIn();
    });

    await test.step('Create a new employee', async () => {
      await addEmployeePage.goto();
      await addEmployeePage.fillForm(employee);
      const empNumber = await addEmployeePage.saveAndGetEmpNumber();
      employeeApi.track(empNumber); // removed again in the fixture teardown
      await addEmployeePage.expectToast('Successfully Saved');
    });

    await test.step('Search for the created employee', async () => {
      await employeeListPage.goto();
      await employeeListPage.searchByEmployeeId(employee.employeeId);
      await employeeListPage.expectSingleResult(employee.employeeId, employee);
    });

    await test.step('Open the employee details', async () => {
      await employeeListPage.openEmployee(employee.employeeId);
      await personalDetailsPage.waitUntilLoaded();
    });

    await test.step('Edit the employee information', async () => {
      await personalDetailsPage.edit(update);
      await personalDetailsPage.save();
    });

    await test.step('Verify the changes were saved', async () => {
      // reload so we are looking at what the server stored, not what the form still holds
      await page.reload();
      await personalDetailsPage.waitUntilLoaded();
      await personalDetailsPage.expectDetails(update);

      // and the list should reflect the new name as well
      await employeeListPage.goto();
      await employeeListPage.searchByEmployeeId(employee.employeeId);
      await employeeListPage.expectSingleResult(employee.employeeId, update);
    });
  },
);
