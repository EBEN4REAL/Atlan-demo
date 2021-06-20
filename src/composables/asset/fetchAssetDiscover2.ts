
import { computed, ComputedRef, Ref, ref, watch } from 'vue';
import { SearchParameters } from '~/types/atlas/attributes';
import fetchSearchList from '../utils/search';

import { AssetTypeList } from "~/constant/assetType";
import axios, { CancelTokenSource } from 'axios';
import { Components } from '~/api/atlas/client';
import fetchAssetAggregation from './fetchAssetAggregation';
import { BaseAttributes, BasicSearchAttributes } from '~/constant/projection';



export default function fetchAssetDiscover(immediate: any) {

    let cancelToken: Ref<CancelTokenSource> = ref(axios.CancelToken.source());


    let localList: Ref<any[]> = ref([]);
    const body: Ref<SearchParameters> = ref({
        typeName: "Table,View",
        excludeDeletedEntities: true,
        includeClassificationAttributes: true,
        includeSubClassifications: true,
        includeSubTypes: true,
        limit: 20,
        offset: 0,
        attributes: [...BaseAttributes, ...BasicSearchAttributes],
        entityFilters: null,
    });

    const { data,
        totalCount,
        aggregations,
        error,
        state,
        STATES,
        mutate } = fetchSearchList(immediate, body, cancelToken);

    watch(data, (newValue, oldValue) => {
        if (body?.value?.offset > 0) {
            localList.value = localList.value.concat(data?.value?.entities);
        } else {
            if (data.value?.entities) {
                localList.value = data.value?.entities;
            } else {
                localList.value = [];
            }
        }
    });



    const refreshAssets = (limit?: number, offset?: number, filters?: SearchParameters, assetType?: string, sort?: string) => {
        // if ([STATES.PENDING].includes(state.value) || [STATES.VALIDATING].includes(state.value)) {
        //     if (cancelToken.value) {
        //         cancelToken.value.cancel("cancelled");
        //     }
        //     cancelToken.value = axios.CancelToken.source();
        // }
        // console.log("refresh");
        // immediate.value = true;
        // console.log(immediate.value);
        // if (assetType?.value) {
        //     aggregationBody.value = {
        //         ...body.value
        //     }
        //     aggregationBody.value.aggregationAttributes = ["__typeName.keyword"];
        //     execute();
        // }
        mutate();
    };



    // let aggregationBody: Ref<SearchParameters> = ref({});
    // const {
    //     execute
    // } = fetchAssetAggregation(aggregationBody, cancelToken);



    const listCount: ComputedRef<any> = computed(() => {
        return localList.value.length;
    });

    const listCountSum: ComputedRef<any> = computed(() => {
        let sum = 0;
        assetTypeList.value.forEach((element: { count: number; }) => {
            sum += element.count;
        });
        return sum;
    });

    const assetTypeList: ComputedRef<any> = computed(() => {
        let temp: any[] = [];
        let map = aggregations?.value?.['__typeName.keyword'];
        if (map) {
            Object.keys(map).forEach((key) => {
                if (map[key] > 0) {
                    const found = AssetTypeList.find((item) => {
                        return item.id == key
                    });
                    if (found) {
                        temp.push({
                            ...found,
                            count: map[key]
                        });
                    }
                }
            });
        }
        return temp;
    });

    const updateLocalList = (updatedItem: any) => {
        const found = localList.value.findIndex((item) => item.guid === updatedItem.guid)
        if (found >= 0) {
            localList.value.splice(found, 1, updatedItem);
        }
    };

    return {
        data,
        list: localList,
        aggregations,
        assetTypeList,
        updateLocalList,
        totalCount,
        listCount,
        listCountSum,
        error,
        state,
        STATES,
        cancelToken,
        mutate,
        refreshAssets,
    }
}