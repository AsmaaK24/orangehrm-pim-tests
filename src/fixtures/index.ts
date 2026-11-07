import { test as base } from '@playwright/test';
import { EmployeeApi } from '../api/employee.api';
import { AddEmployeePage } from '../pages/add-employee.page';
import { EmployeeListPage } from '../pages/employee-list.page';
import { LoginPage } from '../pages/login.page';
import { PersonalDetailsPage } from '../pages/personal-details.page';

interface Fixtures {
  loginPage: LoginPage;
  addEmployeePage: AddEmployeePage;
  employeeListPage: EmployeeListPage;
  personalDetailsPage: PersonalDetailsPage;
  employeeApi: EmployeeApi;
}

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  addEmployeePage: async ({ page }, use) => {
    await use(new AddEmployeePage(page));
  },
  employeeListPage: async ({ page }, use) => {
    await use(new EmployeeListPage(page));
  },
  personalDetailsPage: async ({ page }, use) => {
    await use(new PersonalDetailsPage(page));
  },
  // Uses page.request so it shares whatever session the test's browser context has,
  // including a login done by hand inside the test.
  employeeApi: async ({ page }, use) => {
    const api = new EmployeeApi(page.request);
    await use(api);
    await api.cleanup();
  },
});

export { expect } from '@playwright/test';
