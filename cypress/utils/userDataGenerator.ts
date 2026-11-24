export type UserRole = 'Admin' | 'ESS';
export type UserStatus = 'Enabled' | 'Disabled';

export interface SelectedEmployee {
  fullName: string;
  tableName: string;
}

export interface OrangeHrmUser {
  role: UserRole;
  employeeName: string;
  employeeTableName: string;
  status: UserStatus;
  username: string;
  password: string;
}

export function generateUniqueUserData(
  overrides: Partial<OrangeHrmUser> = {}
): Omit<OrangeHrmUser, 'employeeName' | 'employeeTableName'> {
  const timestamp = Date.now().toString(36);
  const randomSuffix = Math.random().toString(36).slice(2, 6);

  return {
    role: overrides.role ?? 'ESS',
    status: overrides.status ?? 'Enabled',
    username: overrides.username ?? `qa_user_${timestamp}_${randomSuffix}`,
    password: overrides.password ?? `StrongP@ss!${randomSuffix}9`,
  };
}

export function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}