export const PERMISSIONS = {
  USER: {
    CREATE: "user:create",
    READ: "user:read",
    UPDATE: "user:update",
    DELETE: "user:delete",
    RESET_PASSWORD: "user:reset_password",
  },
  COMPANY: {
    CREATE: "company:create",
    READ: "company:read",
    UPDATE: "company:update",
    DELETE: "company:delete",
  },
  ATTENDANCE: {
    CHECK_IN: "attendance:check_in",
    CHECK_OUT: "attendance:check_out",
    VIEW_OWN: "attendance:view_own",
    VIEW_ALL: "attendance:view_all",
    EDIT: "attendance:edit",
  },
  PROJECT: {
    CREATE: "project:create",
    READ: "project:read",
    UPDATE: "project:update",
    DELETE: "project:delete",
  },
} as const

export const PERMISSION_SCOPE = {
  ANY: "any",
  COMPANY: "company",
  OWN: "own",
} as const

export const ROLE_PERMISSIONS: Record<
  string,
  {
    permissions: {
      permission: string
      scope: (typeof PERMISSION_SCOPE)[keyof typeof PERMISSION_SCOPE]
    }[]
  }
> = {
  superAdmin: {
    permissions: [{ permission: "*", scope: PERMISSION_SCOPE.ANY }],
  },
  admin: {
    permissions: [
      { permission: PERMISSIONS.USER.CREATE, scope: PERMISSION_SCOPE.COMPANY },
      { permission: PERMISSIONS.USER.READ, scope: PERMISSION_SCOPE.COMPANY },
      { permission: PERMISSIONS.USER.UPDATE, scope: PERMISSION_SCOPE.COMPANY },
      { permission: PERMISSIONS.USER.DELETE, scope: PERMISSION_SCOPE.COMPANY },
      {
        permission: PERMISSIONS.USER.RESET_PASSWORD,
        scope: PERMISSION_SCOPE.COMPANY,
      },
      { permission: PERMISSIONS.COMPANY.READ, scope: PERMISSION_SCOPE.COMPANY },
      {
        permission: PERMISSIONS.COMPANY.UPDATE,
        scope: PERMISSION_SCOPE.COMPANY,
      },
      {
        permission: PERMISSIONS.ATTENDANCE.VIEW_ALL,
        scope: PERMISSION_SCOPE.COMPANY,
      },
      {
        permission: PERMISSIONS.ATTENDANCE.EDIT,
        scope: PERMISSION_SCOPE.COMPANY,
      },
    ],
  },
  employee: {
    permissions: [
      { permission: PERMISSIONS.USER.READ, scope: PERMISSION_SCOPE.COMPANY }, // ← company not own!
      { permission: PERMISSIONS.USER.UPDATE, scope: PERMISSION_SCOPE.OWN },
      {
        permission: PERMISSIONS.ATTENDANCE.CHECK_IN,
        scope: PERMISSION_SCOPE.OWN,
      },
      {
        permission: PERMISSIONS.ATTENDANCE.CHECK_OUT,
        scope: PERMISSION_SCOPE.OWN,
      },
      {
        permission: PERMISSIONS.ATTENDANCE.VIEW_OWN,
        scope: PERMISSION_SCOPE.OWN,
      },
    ],
  },
}
