import { getAPIPath, PathParams } from '~/services/api/common'
import { BASE_PATH } from '..'

export const LIST_PERSONAS = 'LIST_PERSONAS'
export const CREATE_PERSONA = 'CREATE_PERSONA'
export const UPDATE_PERSONA = 'UPDATE_PERSONA'
export const ENABLE_DISABLE_PERSONA = 'ENABLE_DISABLE_PERSONA'

export const map = {
    LIST_PERSONAS: () => getAPIPath('/service', '/personas'),
    CREATE_PERSONA: () => getAPIPath('/service', '/personas'),
    UPDATE_PERSONA: ({ guid }: PathParams) =>
        getAPIPath('/service', `/personas/${guid}`),
    UPDATE_PERSONA_USERS: ({ guid }: PathParams) =>
        getAPIPath('/service', `/personas/${guid}/subjects`),
    DELETE_PERSONA: ({ guid }: PathParams) =>
        getAPIPath('/service', `/personas/${guid}`),
    LIST_SCOPES: () => getAPIPath('/service', '/scopes'),
    ENABLE_DISABLE_PERSONA: ({ id }: PathParams) =>
        getAPIPath('/service', `/personas/${id}/action`),
    CREATE_POLICY: ({ id }: PathParams) =>
        getAPIPath('/service', `/personas/${id}/policies`),
    UPDATE_POLICY: ({ idPolicy, idPersona }: PathParams) =>
        getAPIPath('/service', `/personas/${idPersona}/policies/${idPolicy}`),
    DELETE_POLICY: ({ idPolicy, idPersona }: PathParams) =>
        getAPIPath('/service', `/personas/${idPersona}/policies/${idPolicy}`),
}
