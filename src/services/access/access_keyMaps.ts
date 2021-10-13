import { getAPIPath } from '~/api'

export const KeyMaps = {
    WHO_AM_I: () => getAPIPath('service', '/whoami'),
    EVALUATE: () => getAPIPath('service', '/evaluates'),
}
