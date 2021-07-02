import { ref, Ref } from 'vue';
import useSearchList from './useSearchList';

export default function useAssetList(dependentKey?: Ref<any>, typeName?: string, initialBody?: any, cacheSuffx?: string | "") {

    const list: Ref<any> = ref([]);
    const { data,
        state,
        STATES,
        isLoading,
        isValidating,
        query,
        replaceFilters,
        replaceBody,
        refresh,
        body,
        assetTypeList,
        searchScoreList,
        assetTypeSum
    } = useSearchList(typeName || "Catalog", list, [], dependentKey, initialBody, cacheSuffx, true);

    return {
        data,
        list,
        state,
        STATES,
        isLoading,
        isValidating,
        query,
        searchScoreList,
        replaceFilters,
        replaceBody,
        refresh,
        body,
        assetTypeList,
        assetTypeSum
    }
}