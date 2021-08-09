import useSWRV from 'swrv';
import { computed, Ref, watch } from 'vue';
import { CONNECTION_FETCH_LIST } from '~/constant/cache';


export default function useConnectionListCache() {
    const { data } = useSWRV(
        CONNECTION_FETCH_LIST,
        null
    );

    watch(data, () => {
        console.log("changed", data)
    });

    const list = computed(() => data?.value?.entities);
    return {
        list
    }
}