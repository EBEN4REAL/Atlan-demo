import { ref, Ref } from 'vue';
import { CredentialAttributes } from '~/constant/projection';
import { BotsType } from '~/types/atlas/bots';
import { ConnectionType } from '~/types/atlas/connection';
import { CredentialType } from '~/types/atlas/credential';
import useSearchList from './useSearchList';

export default function useCredentialList(dependentKey?: Ref<any>, initialBody?: any, cacheSuffx?: string | "") {

    const list: Ref<CredentialType[]> = ref([]);
    const { data,
        state,
        STATES,
        isLoading,
        isValidating,
        query,
        replaceFilters,
        refresh,
        body
    } = useSearchList("Credential", list, CredentialAttributes, dependentKey, initialBody, cacheSuffx);

    return {
        data,
        list,
        state,
        STATES,
        isLoading,
        isValidating,
        query,
        replaceFilters,
        refresh,
        body
    }
}