import { buildEmployee } from '../../src/data/employee.data';
import { expect, test } from '../../src/fixtures';

// These run with the session created in auth.setup.ts.
test.describe('PIM regression', { tag: '@regression' }, () => {
  test('add employee requires first and last name', async ({ addEmployeePage }) => {
    await addEmployeePage.goto();
    await addEmployeePage.submit();
    await addEmployeePage.expectRequiredErrorsOnNames();
  });

  test('add employee rejects an employee id that already exists', async ({ addEmployeePage, employeeApi }) => {
    const existing = buildEmployee();
    await employeeApi.create(existing);

    await addEmployeePage.goto();
    await addEmployeePage.fillForm(buildEmployee({ employeeId: existing.employeeId }));
    await addEmployeePage.submit();
    await addEmployeePage.expectDuplicateIdError();
  });

  test('deleted employee can no longer be found', async ({ employeeListPage, employeeApi }) => {
    const employee = buildEmployee();
    await employeeApi.create(employee);

    await employeeListPage.goto();
    await employeeListPage.searchByEmployeeId(employee.employeeId);
    await employeeListPage.expectSingleResult(employee.employeeId, employee);

    await employeeListPage.deleteEmployee(employee.employeeId);

    await employeeListPage.searchByEmployeeId(employee.employeeId);
    await employeeListPage.expectNoRecords();
  });

  test('searching for an unknown employee id shows no records', async ({ employeeListPage }) => {
    await employeeListPage.goto();
    await employeeListPage.searchByEmployeeId('0000000000');
    await employeeListPage.expectNoRecords();
  });
});
