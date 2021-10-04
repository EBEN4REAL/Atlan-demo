import { getAPIPath, PathParams } from '~/api'

export const KeyMaps = {
    personas: {
        LIST_PERSONAS: () => getAPIPath('/auth', '/personas'),
    },
}
