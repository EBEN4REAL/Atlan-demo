import mitt from 'mitt';
import { computed, ComputedRef, Ref, ref, watch } from 'vue';
import { BaseAttributes, BasicSearchAttributes } from '~/constant/projection';
import { SearchParameters } from '~/types/atlas/attributes';
import fetchSearchList from '../utils/search';



export default function fetchAssetDiscover(dependent: any, body: Ref<SearchParameters>) {

    let localList: Ref<any[]> = ref([]);

    const { data,
        totalCount,
        listCount,
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
        console.log(localList);
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
        updateLocalList,
        totalCount,
        listCount,
        error,
        state,
        STATES,
        mutate
    }
}