import { ref, Ref } from 'vue';
import { BotsAttributes, CredentialAttributes } from '~/constant/projection';
import { BotsType } from '~/types/atlas/bots';
import { ConnectionType } from '~/types/atlas/connection';
import { CredentialType } from '~/types/atlas/credential';
import useSearchList from './useSearchList';

export default function useBotCredentialList(dependentKey?: Ref<any>, initialBody?: any, cacheSuffx?: string | "") {

    const list: Ref<any> = ref([]);
    const { data,
        state,
        STATES,
        isLoading,
        isValidating,
        query,
        replaceFilters,
        refresh,
        body,
        assetTypeList,
        assetTypeSum
    } = useSearchList("Catalog", list, [], dependentKey, initialBody, cacheSuffx);


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
        body,
        assetTypeList,
        assetTypeSum
    }
}