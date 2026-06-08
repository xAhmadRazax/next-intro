// export const PERMISSIONS = {
//   USER: {
//     CREATE: "user:create",
//     READ_ANY: "user:read:any",
//     READ_OWN: "user:read:own",
//     UPDATE_ANY: "user:update:any",
//     UPDATE_COMPANY: "user:update:company",
//     UPDATE_OWN: "user:update:own",
//     DELETE_ANY: "user:delete:any",
//   },
//   COMPANY: {
//     CREATE: "company:create",
//     READ_ANY: "company:read:any",
//     READ_OWN: "company:read:own",
//     UPDATE_ANY: "company:update:any",
//     UPDATE_OWN: "company:update:own",
//     DELETE_ANY: "company:delete:any",
//     DELETE_OWN: "company:delete:own",
//   },
//   ATTENDANCE: {
//     CHECK_IN: "attendance:check_in",
//     CHECK_OUT: "attendance:check_out",
//     VIEW_OWN: "attendance:view_own",
//     VIEW_ALL: "attendance:view_all",
//     EDIT: "attendance:edit",
//   },
// } as const

// export const ROLE_PERMISSIONS = {
//   superAdmin: [
//     // PERMISSIONS.USER.CREATE,
//     // PERMISSIONS.USER.READ,
//     // PERMISSIONS.USER.UPDATE,
//     // PERMISSIONS.USER.DELETE,
//     // PERMISSIONS.COMPANY.CREATE,
//     // PERMISSIONS.COMPANY.READ,
//     // PERMISSIONS.COMPANY.UPDATE,
//     // PERMISSIONS.COMPANY.DELETE,
//     // PERMISSIONS.ATTENDANCE.VIEW_ALL,
//     // PERMISSIONS.ATTENDANCE.EDIT,
//     "*",
//   ],

//   admin: [
//     PERMISSIONS.USER.CREATE,
//     PERMISSIONS.USER.READ:,
//     PERMISSIONS.USER.UPDATE,
//     PERMISSIONS.USER.DELETE,
//     PERMISSIONS.COMPANY.READ,
//     PERMISSIONS.ATTENDANCE.VIEW_ALL,
//     PERMISSIONS.ATTENDANCE.EDIT,
//   ],

//   employee: [
//     PERMISSIONS.ATTENDANCE.CHECK_IN,
//     PERMISSIONS.ATTENDANCE.CHECK_OUT,
//     PERMISSIONS.ATTENDANCE.VIEW_OWN,
//     PERMISSIONS.USER.READ,
//   ],
// }

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
} as const

export const PERMISSION_SCOPE = {
  ANY: "any",
  COMPANY: "company",
  OWN: "own",
} as const
//
// export const ROLE_PERMISSIONS_OLD: Record<
//   string,
//   {
//     permissions: string[]
//     scope: "any" | "company" | "own"
//   }
// > = {
//   superAdmin: {
//     permissions: ["*"],
//     scope: PERMISSION_SCOPE.ANY, // can access anything
//   },
//   admin: {
//     permissions: [
//       PERMISSIONS.USER.CREATE,
//       PERMISSIONS.USER.READ,
//       PERMISSIONS.USER.UPDATE,
//       PERMISSIONS.USER.DELETE,
//       PERMISSIONS.COMPANY.READ,
//       PERMISSIONS.COMPANY.UPDATE,
//       PERMISSIONS.ATTENDANCE.VIEW_ALL,
//       PERMISSIONS.ATTENDANCE.EDIT,
//     ],
//     scope: PERMISSION_SCOPE.COMPANY, // scoped to their company
//   },
//   employee: {
//     permissions: [
//       PERMISSIONS.USER.READ,
//       PERMISSIONS.ATTENDANCE.CHECK_IN,
//       PERMISSIONS.ATTENDANCE.CHECK_OUT,
//       PERMISSIONS.ATTENDANCE.VIEW_OWN,
//     ],
//     scope: PERMISSION_SCOPE.OWN, // only their own data
//   },
// }

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
