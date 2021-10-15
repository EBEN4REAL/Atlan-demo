import { getAPIPath, PathParams } from '~/api'

export const KeyMaps = {
    personas: {
        LIST_PERSONAS: () => getAPIPath('/service', '/personas'),
        CREATE_PERSONA: () => getAPIPath('/service', '/personas'),
        UPDATE_PERSONA: ({ guid }: PathParams) =>
            getAPIPath('/service', `/personas/${guid}`),
        LIST_SCOPES: () => getAPIPath('/service', '/scopes'),
    },
}
