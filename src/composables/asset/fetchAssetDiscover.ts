
import { computed, ComputedRef, Ref, ref, watch } from 'vue';
import { SearchParameters } from '~/types/atlas/attributes';
import fetchSearchList from '../utils/search';

import { AssetTypeList } from "~/constant/assetType";


export default function fetchAssetDiscover(dependent: any, body: Ref<SearchParameters>) {

    let localList: Ref<any[]> = ref([]);

    const { data,
        totalCount,

        aggregations,
        error,
        state,
        STATES,
        handleLoadMore,
        mutate } = fetchSearchList(dependent, body)

    watch(data, (newValue, oldValue) => {

        console.log(data);
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


    const listCount: ComputedRef<any> = computed(() => {
        return localList.value.length;
    });

    const list: ComputedRef<any> = computed(() => {
        return localList;
    });

    const offset: ComputedRef<any> = computed(() => {
        return body.value.offset;
    });
    const limit: ComputedRef<any> = computed(() => {
        return body.value.limit;
    });

    const assetDistributionSum: ComputedRef<any> = computed(() => {
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
        list,
        offset,
        limit,
        aggregations,
        assetDistributionSum,
        assetTypeList,
        updateLocalList,
        totalCount,
        listCount,
        error,
        state,
        STATES,
        mutate, handleLoadMore
    }
}