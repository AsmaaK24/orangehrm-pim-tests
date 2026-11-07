export interface Employee {
  firstName: string;
  middleName: string;
  lastName: string;
  employeeId: string;
}

export interface EmployeeUpdate {
  firstName: string;
  lastName: string;
  nationality: string;
  maritalStatus: string;
  gender: 'Male' | 'Female';
}

// Short random suffix so parallel runs (and reruns against the shared demo) never collide.
function suffix(length = 5): string {
  return Math.random().toString(36).slice(2, 2 + length);
}

// Employee Id is limited to 10 characters, so keep it numeric and short.
function uniqueEmployeeId(): string {
  const time = String(Date.now()).slice(-6);
  const rand = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
  return `${time}${rand}`;
}

export function buildEmployee(overrides: Partial<Employee> = {}): Employee {
  return {
    firstName: 'Anna',
    middleName: 'Marie',
    lastName: `Qa${suffix()}`,
    employeeId: uniqueEmployeeId(),
    ...overrides,
  };
}

export function buildEmployeeUpdate(overrides: Partial<EmployeeUpdate> = {}): EmployeeUpdate {
  return {
    firstName: 'Berta',
    lastName: `Edited${suffix()}`,
    nationality: 'Austrian',
    maritalStatus: 'Married',
    gender: 'Female',
    ...overrides,
  };
}
