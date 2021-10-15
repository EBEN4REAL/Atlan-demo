import { getAPIPath, PathParams } from '~/api'

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
}
