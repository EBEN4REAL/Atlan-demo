
import { computed, ComputedRef, Ref, ref, watch } from 'vue';
import { SearchParameters } from '~/types/atlas/attributes';
import fetchSearchList from '../utils/search';

import { AssetTypeList } from "~/constant/assetType";
import { Components } from '~/api/atlas/client';
import { BaseAttributes, ColumnAttributes } from '~/constant/projection';
import { dataTypeList } from '~/constant/datatype';
import { customSamlProvider } from '~/constant/saml';


export default function fetchColumns(dependent: any, query?: string, filters?: Components.Schemas.FilterCriteria, limit?: number, offset?: number) {

    let localList: Ref<any[]> = ref([]);

    const body: Ref<Components.Schemas.SearchParameters> = ref({
        typeName: "Column",
        excludeDeletedEntities: true,
        includeClassificationAttributes: true,
        includeSubClassifications: true,
        includeSubTypes: false,
        limit: limit,
        offset: offset,
        attributes: [...BaseAttributes, ...ColumnAttributes],
        query: query,
        entityFilters: filters,
    });


    const { data,
        totalCount,
        listCount,
        aggregations,
        error,
        state,
        STATES,
        mutate } = fetchSearchList(dependent, body)

    watch(data, (newValue, oldValue) => {
        if (body?.value?.offset > 0) {
            localList.value.concat(data?.value?.entities);
        } else {
            localList.value = data.value?.entities;
        }
    });

    const list: ComputedRef<any> = computed(() => {
        return localList;
    });

    const assetDistributionSum: ComputedRef<any> = computed(() => {
        let sum = 0;
        assetTypeList.value.forEach((element: { count: number; }) => {
            sum += element.count;
        });
        return sum;
    });

    const getDataType = (item: any) => {
        return dataTypeList.find((i) => i.type.includes(item.attributes.dataType));
    }

    const assetTypeList: ComputedRef<any> = computed(() => {
        let temp: any[] = [];


        let map = aggregations?.value?.['__typeName.keyword'];
        // let keys = Object.keys(aggregations?.value?.['__typeName.keyword']);
        console.log(map);


        if (map) {
            Object.keys(map).forEach((key) => {

                if (map[key] > 0) {
                    const found = AssetTypeList.find((item) => {
                        return item.id == key && item.isDiscoverable
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




    return {
        data,
        list,
        offset,
        limit,
        getDataType,
        totalCount,
        listCount,
        error,
        state,
        STATES,
        mutate
    }
}