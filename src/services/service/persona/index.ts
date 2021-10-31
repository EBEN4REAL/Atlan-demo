/* eslint-disable import/prefer-default-export */
import { Ref } from 'vue'
import { map } from './key'
import { useAPI } from '~/services/api/useAPI'

import { useOptions } from '~/services/api/common'

import { IPersona } from '~/types/accessPolicies/personas'

const List = (params?: any, options?: useOptions) =>
    useAPI(map.LIST_PERSONAS, 'GET', { params }, options || {})

const Create = (body: IPersona, options?: useOptions) =>
    useAPI<IPersona>(map.CREATE_PERSONA, 'POST', { body }, options || {})

const Update = (body: IPersona, options?: useOptions) =>
    useAPI<IPersona>(
        map.CREATE_PERSONA,
        'POST',
        {
            body,
            pathVariables: {
                guid: body.id!,
            },
        },
        options || {}
    )

export const Persona = {
    List,
    Create,
    Update,
}
