/* eslint-disable import/prefer-default-export */
import { map } from './key'
import { useAPI } from '~/services/api/useAPI'
import { useOptions } from '~/services/api/common'
import { Ref } from 'vue'

const Test = (
    body: Ref<Record<string, any>> | Record<string, any>,
    options?: useOptions
) => useAPI(map.TEST_CREDENTIAL, 'POST', { body }, options || {})

const Query = (
    body: Ref<Record<string, any>> | Record<string, any>,
    options?: useOptions
) => useAPI(map.QUERY_CREDENTIAL, 'POST', { body }, options || {})

const QueryByID = (
    pathVariables,
    body: Ref<Record<string, any>> | Record<string, any>,
    options?: useOptions
) =>
    useAPI(
        map.QUERY_CREDENTIAL_BY_ID,
        'POST',
        { pathVariables, body },
        options || {}
    )

const GetByID = (pathVariables?, options?: useOptions) =>
    useAPI(
        map.GET_CREDENTIAL,
        'GET',
        {
            pathVariables,
        },
        options || {}
    )
const TestByID = (pathVariables?, options?: useOptions) =>
    useAPI(
        map.TEST_CREDENTIAL_BY_ID,
        'POST',
        {
            pathVariables,
        },
        options || {}
    )

const UpdateByID = (
    pathVariables,
    body: Ref<Record<string, any>> | Record<string, any>,
    options?: useOptions
) =>
    useAPI(
        map.UPDATE_CREDENTIAL_BY_ID,
        'POST',
        {
            pathVariables,
            body,
        },
        options || {}
    )

export const Credential = {
    Test,
    Query,
    TestByID,
    GetByID,
    UpdateByID,
    QueryByID,
}
