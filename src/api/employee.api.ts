import { APIRequestContext, expect } from '@playwright/test';
import { Employee } from '../data/employee.data';

const EMPLOYEES_ENDPOINT = '/web/index.php/api/v2/pim/employees';

/**
 * Thin wrapper around the app's own REST endpoints. Used only for test setup and
 * cleanup, so the UI tests don't spend time clicking through forms that
 * aren't what they are verifying.
 */
export class EmployeeApi {
  private readonly created = new Set<number>();

  constructor(private readonly request: APIRequestContext) {}

  async create(employee: Employee): Promise<number> {
    const response = await this.request.post(EMPLOYEES_ENDPOINT, {
      data: {
        firstName: employee.firstName,
        middleName: employee.middleName,
        lastName: employee.lastName,
        empPicture: null,
        employeeId: employee.employeeId,
      },
    });
    expect(response.ok(), `Could not seed employee via API (status ${response.status()})`).toBeTruthy();
    const body = await response.json();
    const empNumber: number = body.data.empNumber;
    this.created.add(empNumber);
    return empNumber;
  }

  /** Register an employee that was created through the UI so it gets cleaned up too. */
  track(empNumber: number): void {
    this.created.add(empNumber);
  }

  /** Best effort: an employee the test already deleted is not an error. */
  async cleanup(): Promise<void> {
    for (const empNumber of this.created) {
      await this.request.delete(EMPLOYEES_ENDPOINT, { data: { ids: [empNumber] } }).catch(() => undefined);
    }
    this.created.clear();
  }
}
