import { ACTION_AUTH_MAP, ROUTE_AUTH_MAP, ACTION_MAP } from "./authCheckMap";

export default {
  state: {},
  mutations: {},
  actions: {},
  getters: {
    checkActionAuth(state, _getters, rootState) {
      return (action) => {
        const reqIndex = ACTION_AUTH_MAP.findIndex(
          (actionObj) => actionObj.action === action
        );
        if (reqIndex > -1) {
          const currentUserRoles = rootState.user.currentUser
            ? rootState.user.currentUser.roles || []
            : [];
          return ACTION_AUTH_MAP[reqIndex].scope.some(
            (r) => currentUserRoles.indexOf(r) >= 0
          );
        }
        return true;
      };
    },
    checkRouteAuth(state, _getters, rootState) {
      return (route) => {
        let reqIndex = -1;
        reqIndex = ROUTE_AUTH_MAP.findIndex((routeObj) =>
          routeObj.startsWith
            ? route.startsWith(routeObj.route)
            : route === routeObj.route
        );
        if (reqIndex > -1) {
          const currentUserRoles = rootState.user.currentUser
            ? rootState.user.currentUser.roles || []
            : [];
          const isRouteAccessAllowed = ROUTE_AUTH_MAP[reqIndex].scope.some(
            (r) => currentUserRoles.indexOf(r) >= 0
          );
          if (
            isRouteAccessAllowed &&
            ROUTE_AUTH_MAP[reqIndex].subRoutes &&
            ROUTE_AUTH_MAP[reqIndex].subRoutes.length
          ) {
            const subRouteIndex = ROUTE_AUTH_MAP[
              reqIndex
            ].subRoutes.findIndex((routeObj) =>
              routeObj.startsWith
                ? route.startsWith(routeObj.route)
                : route === routeObj.route
            );
            if (subRouteIndex > -1) {
              return ROUTE_AUTH_MAP[reqIndex].subRoutes[
                subRouteIndex
              ].scope.some((r) => currentUserRoles.indexOf(r) >= 0);
            }
          }
          return isRouteAccessAllowed;
        }
        return true;
      };
    },

    /* Glossary Term Category Getters */
    isCreateGlossaryEnable(state, _getters) {
      return _getters.checkActionAuth(ACTION_MAP.CREATE_GLOSSARY);
    },
    isEditGlossaryEnable(state, _getters) {
      return _getters.checkActionAuth(ACTION_MAP.EDIT_GLOSSARY);
    },
    isArchiveGlossaryEnable(state, _getters) {
      return _getters.checkActionAuth(ACTION_MAP.ARCHIVE_GLOSSARY);
    },
    isCreateTermEnable(state, _getters) {
      return _getters.checkActionAuth(ACTION_MAP.CREATE_TERM);
    },
    isEditTermEnable(state, _getters) {
      return _getters.checkActionAuth(ACTION_MAP.EDIT_TERM);
    },
    isArchiveTermEnable(state, _getters) {
      return _getters.checkActionAuth(ACTION_MAP.ARCHIVE_TERM);
    },
    isCreateCategoryEnable(state, _getters) {
      return _getters.checkActionAuth(ACTION_MAP.CREATE_CATEGORY);
    },
    isEditCategoryEnable(state, _getters) {
      return _getters.checkActionAuth(ACTION_MAP.EDIT_CATEGORY);
    },
    isEditCategoryReadmeEnable(state, _getters) {
      return _getters.checkActionAuth(ACTION_MAP.EDIT_CATEGORY_README);
    },
    isArchiveCategoryEnable(state, _getters) {
      return _getters.checkActionAuth(ACTION_MAP.ARCHIVE_CATEGORY);
    },
    isLinkingGlossaryTermEnable(state, _getters) {
      return _getters.checkActionAuth(ACTION_MAP.LINKING_GLOSSARY_TERM);
    },

    /* Classification Getters */
    isCreateClassificationEnable(state, _getters) {
      return _getters.checkActionAuth(ACTION_MAP.CREATE_CLASSIFICATION);
    },
    isEditClassificationEnable(state, _getters) {
      return _getters.checkActionAuth(ACTION_MAP.EDIT_CLASSIFICATION);
    },
    isArchiveClassificationEnable(state, _getters) {
      return _getters.checkActionAuth(ACTION_MAP.ARCHIVE_CLASSIFICATION);
    },

    /* Integration Getters */
    isNewIntegrationEnable(state, _getters) {
      return _getters.checkActionAuth(ACTION_MAP.NEW_INTEGRATION);
    },

    /* Users Getters */
    isDisableUserEnable(state, _getters) {
      return _getters.checkActionAuth(ACTION_MAP.DISABLE_USER);
    },
    isForceUpdatePasswordEnable(state, _getters) {
      return _getters.checkActionAuth(ACTION_MAP.FORCE_UPDATE_PASSWORD_ENABLE);
    },
    isUpdateUserRoleEnable(state, _getters) {
      return _getters.checkActionAuth(ACTION_MAP.UPDATE_USER_ROLE);
    },
    isChangeUserRoleAllowed(state, _getters) {
      return _getters.checkActionAuth(ACTION_AUTH_MAP.CHANGE_USER_ROLE);
    },
  },
};
