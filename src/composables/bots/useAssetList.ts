import { ref, Ref, watch } from 'vue';
import useSearchList from './useSearchList';
import axios from 'axios';

export default function useAssetList(dependentKey?: Ref<any>, typeName?: string, initialBody?: any, cacheSuffx?: string | "") {

    let cancelTokenSource = ref(axios.CancelToken.source());
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
    } = useSearchList(typeName || "Catalog", list, [], dependentKey, initialBody, cacheSuffx, false, cancelTokenSource, true);


    const aggregationList: Ref<any> = ref([]);
    const aggregationBody = {
        limit: 1,
        query: body.value.query,
        excludeDeletedEntities: true,
        aggregationAttributes: ["__typeName.keyword"],
        typeName: typeName,
    };
    const {
        assetTypeList,
        searchScoreList,
        assetTypeMap,
        assetTypeSum,
        replaceBody: refreshAggregation,
    } = useSearchList("Catalog", aggregationList, [], data, aggregationBody, cacheSuffx, false, cancelTokenSource, true);


    const isAggregate = ref(true);
    watch(data, () => {

        if (isAggregate.value) {
            let newCriterion = [...body.value.entityFilters.criterion];
            let index = newCriterion.findIndex((item) => item.attributeName === "__typeName");
            if (index > -1) {
                newCriterion.splice(index, 1);
            }
            refreshAggregation({
                limit: 1,
                query: body.value.query,
                excludeDeletedEntities: body.value.excludeDeletedEntities,
                aggregationAttributes: ["__typeName.keyword"],
                typeName: typeName,
                entityFilters: {
                    condition: body.value.entityFilters.condition,
                    criterion: newCriterion
                }
            });
        }

    });


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
        assetTypeSum,
        assetTypeMap,
        isAggregate
    }
}

