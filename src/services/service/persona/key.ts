import { getAPIPath } from '~/services/api/common'
import { BASE_PATH } from '..'

export const LIST_PERSONAS = 'LIST_PERSONAS'
export const CREATE_PERSONA = 'CREATE_PERSONA'
export const UPDATE_PERSONA = 'UPDATE_PERSONA'

export const map = {
    LIST_PERSONAS: () => getAPIPath('/service', '/personas'),
    CREATE_PERSONA: () => getAPIPath('/service', '/personas'),
    UPDATE_PERSONA: ({ guid }) => getAPIPath('/service', `/personas/${guid}`),
}
