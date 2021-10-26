import { getAPIPath, PathParams } from '~/api'

const serviceAlias = 'service'

// eslint-disable-next-line import/prefer-default-export
export const heracles_keymap = {
    personas: {
        LIST_PERSONAS: () => getAPIPath('/service', '/personas'),
        CREATE_PERSONA: () => getAPIPath('/service', '/personas'),
        UPDATE_PERSONA: ({ guid }: PathParams) =>
            getAPIPath('/service', `/personas/${guid}`),
        LIST_SCOPES: () => getAPIPath('/service', '/scopes'),
    },
    requests: {
        LIST_REQUESTS: () => getAPIPath('auth', '/requests'),
        ACT_ON_REQUEST: ({ id }: PathParams) =>
            getAPIPath('auth', `/requests/${id}/action`),
    },
    users: {
        LIST_USERS_BULK: () => getAPIPath('/service', '/users/bulk'),
    },
    groups: {
        LIST_GROUPS: () => getAPIPath('/service', '/groups'),
    },
}
