import { ref, Ref, watch, computed } from "vue";
import useSearchList from "./useSearchList";
import axios from "axios";
import { dataTypeList } from "~/constant/datatype";

export default function useColumnList(dependentKey?: Ref<any>, initialBody?: any, cacheSuffx?: string | "", isAggregation?: boolean) {

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
        assetTypeMap: selfAssetTypeMap,
    } = useSearchList("Column", list, [], dependentKey, initialBody, cacheSuffx, false, cancelTokenSource, true);


    const aggregationList: Ref<any> = ref([]);
    const aggregationBody = {
        limit: 1,
        query: body.value.query,
        excludeDeletedEntities: true,
        aggregationAttributes: ["typeName"],
        typeName: "Column",
    };
    const {
        assetTypeList,
        searchScoreList,
        assetTypeMap,
        assetTypeSum,
        replaceBody: refreshAggregation,
    } = useSearchList(
        "Catalog",
        aggregationList,
        [],
        data,
        aggregationBody,
        cacheSuffx,
        false,
        cancelTokenSource,
        true
    );

    const getDataTypeImage = (dataType: any) => {
        const found = dataTypeList.find((item) => {
            return item.type.includes(dataType);
        });
        return found?.image;
    };


    const totalCount = computed(() => {

        return data.value.approximateCount;
    });


    const isAggregate = ref(false);

    if (isAggregation) {
        isAggregate.value = isAggregation;
    }




    watch(data, () => {
        if (isAggregate.value) {
            refreshAggregation({
                limit: 1,
                query: body.value.query,
                excludeDeletedEntities: body.value.excludeDeletedEntities,
                aggregationAttributes: ["typeName"],
                typeName: "Column",
                entityFilters: body.value.entityFilters,
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
        selfAssetTypeMap,
        isAggregate,
        getDataTypeImage,
        totalCount,
    };
}
