import { ref, Ref, watch } from 'vue';
import { ConnectionAttributes } from '~/constant/projection';
import { useConnectionsStore } from '~/store/connections';
import { ConnectionType } from '~/types/atlas/connection';
import useSearchList from './useSearchList';

export default function useConnectionsList(
    dependentKey?: Ref<any>,
    initialBody?: any,
    cacheSuffx?: string | ''
) {
    const store = useConnectionsStore();
    const list: Ref<ConnectionType[]> = ref([]);
    const {
        data,
        state,
        STATES,
        isLoading,
        isValidating,
        query,
        refresh,
        error,
        body,
    } = useSearchList(
        'Connection',
        list,
        ConnectionAttributes,
        dependentKey,
        initialBody,
        cacheSuffx,
        true
    );

    watch(state, () => {
        store.setStatus({
            isLoading: [STATES.PENDING].includes(state.value),
            isValidating: [STATES.VALIDATING].includes(state.value),
            isError: [STATES.ERROR].includes(state.value),
            isStaleError: [STATES.STALE_IF_ERROR].includes(state.value),
            isSuccess: [STATES.SUCCESS].includes(state.value),
            error,
        });
    });

    watch(data, () => {
        store.setData(data.value);
    });

    return {
        data,
        list,
        state,
        STATES,
        isLoading,
        isValidating,
        query,
        refresh,
        body,
        error,
    };
}
