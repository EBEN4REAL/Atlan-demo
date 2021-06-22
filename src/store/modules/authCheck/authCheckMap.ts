export const ROLES_MAP = {
  ADMIN: "$admin",
  MEMBER: "$member",
  CLOUD: "$cloud",
  STEWARD: "$steward",
};

export const ACTION_MAP = {
  ARCHIVE_CATEGORY: "ARCHIVE_CATEGORY",
  ARCHIVE_CLASSIFICATION: "ARCHIVE_CLASSIFICATION",
  ARCHIVE_GLOSSARY: "ARCHIVE_GLOSSARY",
  ARCHIVE_TERM: "ARCHIVE_TERM",
  CHANGE_USER_ROLE: "CHANGE_USER_ROLE",
  CREATE_CATEGORY: "CREATE_CATEGORY",
  CREATE_CLASSIFICATION: "CREATE_CLASSIFICATION",
  CREATE_GLOSSARY: "CREATE_GLOSSARY",
  CREATE_TERM: "CREATE_TERM",
  DISABLE_USER: "DISABLE_USER",
  EDIT_CATEGORY: "EDIT_CATEGORY",
  EDIT_CLASSIFICATION: "EDIT_CLASSIFICATION",
  EDIT_GLOSSARY: "EDIT_GLOSSARY",
  EDIT_TERM: "EDIT_TERM",
  FORCE_UPDATE_PASSWORD_ENABLE: "FORCE_UPDATE_PASSWORD_ENABLE",
  LINKING_GLOSSARY_TERM: "LINKING_GLOSSARY_TERM",
  NEW_INTEGRATION: "NEW_INTEGRATION",
  UPDATE_USER_ROLE: "UPDATE_USER_ROLE",
};

export const ACTION_AUTH_MAP = [
  {
    action: ACTION_MAP.CREATE_CLASSIFICATION,
    scope: [ROLES_MAP.ADMIN, ROLES_MAP.STEWARD],
  },
  {
    action: ACTION_MAP.EDIT_CLASSIFICATION,
    scope: [ROLES_MAP.ADMIN, ROLES_MAP.STEWARD],
  },
  {
    action: ACTION_MAP.ARCHIVE_CLASSIFICATION,
    scope: [ROLES_MAP.ADMIN, ROLES_MAP.STEWARD],
  },
  {
    action: ACTION_MAP.CREATE_GLOSSARY,
    scope: [ROLES_MAP.ADMIN, ROLES_MAP.STEWARD],
  },
  {
    action: ACTION_MAP.EDIT_GLOSSARY,
    scope: [ROLES_MAP.ADMIN, ROLES_MAP.STEWARD],
  },
  {
    action: ACTION_MAP.ARCHIVE_GLOSSARY,
    scope: [ROLES_MAP.ADMIN, ROLES_MAP.STEWARD],
  },
  {
    action: ACTION_MAP.CREATE_CATEGORY,
    scope: [ROLES_MAP.ADMIN, ROLES_MAP.STEWARD],
  },
  {
    action: ACTION_MAP.EDIT_CATEGORY,
    scope: [ROLES_MAP.ADMIN, ROLES_MAP.STEWARD],
  },
  {
    action: ACTION_MAP.ARCHIVE_CATEGORY,
    scope: [ROLES_MAP.ADMIN, ROLES_MAP.STEWARD],
  },
  {
    action: ACTION_MAP.CREATE_TERM,
    scope: [ROLES_MAP.ADMIN, ROLES_MAP.STEWARD],
  },
  {
    action: ACTION_MAP.EDIT_TERM,
    scope: [ROLES_MAP.ADMIN, ROLES_MAP.STEWARD],
  },
  {
    action: ACTION_MAP.ARCHIVE_TERM,
    scope: [ROLES_MAP.ADMIN, ROLES_MAP.STEWARD],
  },
  {
    action: ACTION_MAP.LINKING_GLOSSARY_TERM,
    scope: [ROLES_MAP.STEWARD],
  },
  {
    action: ACTION_MAP.NEW_INTEGRATION,
    scope: [ROLES_MAP.ADMIN, ROLES_MAP.CLOUD],
  },
  {
    action: ACTION_MAP.DISABLE_USER,
    scope: [ROLES_MAP.ADMIN],
  },
  {
    action: ACTION_MAP.FORCE_UPDATE_PASSWORD_ENABLE,
    scope: [ROLES_MAP.ADMIN, ROLES_MAP.CLOUD],
  },
  {
    action: ACTION_MAP.UPDATE_USER_ROLE,
    scope: [ROLES_MAP.ADMIN, ROLES_MAP.CLOUD],
  },
  {
    action: ACTION_MAP.CHANGE_USER_ROLE,
    scope: [ROLES_MAP.ADMIN, ROLES_MAP.CLOUD],
  },
];

export const ROUTE_AUTH_MAP = [
  {
    route: "/admin",
    startsWith: true,
    scope: [ROLES_MAP.ADMIN, ROLES_MAP.CLOUD, ROLES_MAP.STEWARD],
    subRoutes: [
      {
        route: "/admin/users",
        startsWith: true,
        scope: [ROLES_MAP.ADMIN, ROLES_MAP.CLOUD],
      },
      {
        route: "/admin/groups",
        startsWith: true,
        scope: [ROLES_MAP.ADMIN, ROLES_MAP.CLOUD],
      },
      {
        route: "/admin/roles",
        startsWith: true,
        scope: [ROLES_MAP.ADMIN, ROLES_MAP.CLOUD],
      },
      {
        route: "/admin/organisation/profile",
        startsWith: true,
        scope: [ROLES_MAP.ADMIN],
      },
      {
        route: "/admin/policies",
        startsWith: true,
        scope: [ROLES_MAP.STEWARD, ROLES_MAP.CLOUD],
      },
      {
        route: "/admin/approvals",
        startsWith: true,
        scope: [ROLES_MAP.STEWARD, ROLES_MAP.ADMIN],
      },
    ],
  },
];
