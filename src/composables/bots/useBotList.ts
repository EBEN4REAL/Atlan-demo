import { ref, Ref } from 'vue';
import { BotsAttributes } from '~/constant/projection';
import { BotsType } from '~/types/atlas/bots';
import { ConnectionType } from '~/types/atlas/connection';
import useSearchList from './useSearchList';

export default function useBotList(dependentKey?: Ref<any>, initialBody?: any, cacheSuffx?: string | "") {

    const list: Ref<BotsType[]> = ref([]);
    const { data,
        state,
        STATES,
        isLoading,
        isValidating,
        query,
        replaceFilters,
        refresh,
        body
    } = useSearchList("Bot", list, BotsAttributes, dependentKey, initialBody, cacheSuffx);


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