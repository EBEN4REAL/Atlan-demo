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

export const Credential = {
    Test,
    Query,
}
