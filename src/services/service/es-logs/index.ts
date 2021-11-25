/* eslint-disable import/prefer-default-export */
import { Ref } from 'vue'
import { map } from './key'
import { useAPI } from '~/services/api/useAPI'

const listQueryLogs = (body: Ref<any>) =>
    useAPI(
        map.LIST_QUERY_LOGS,
        'POST',
        { initialState: [], body },
        {
            asyncOptions: {
                onError: (e) => {
                    throw e
                },
            },
        }
    )
const listAccessLogs = (body: Ref<any>) =>
    useAPI(
        map.LIST_ACCESS_LOGS,
        'POST',
        { initialState: [], body },
        {
            asyncOptions: {
                onError: (e) => {
                    throw e
                },
            },
        }
    )

export const Logs = {
    listQueryLogs,
    listAccessLogs,
}
