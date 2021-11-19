/* eslint-disable import/prefer-default-export */
import { map } from './key'
import { useAPI } from '~/services/api/useAPI'
import { Ref } from 'vue'

const listQueryLogs = (body: Ref<any>) =>
    useAPI(
        map.LIST_QUERY_LOGS,
        'POST',
        { initialState: [], body: body },
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
}
