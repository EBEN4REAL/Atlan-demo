
import { computed, ref, WritableComputedRef, watch } from 'vue';
import updateAsset from '../utils/updateAsset';
import mitt from "mitt";
import whoami from '../user/whoami';
import { SearchBasic } from '~/api/atlas/searchbasic';

export default function updateSavedSearch(item: any) {

    let body = ref({
    })
    const { data, mutate, isReady, error } = SearchBasic.CreateSavedSearch("", body, ref({ immediate: false }));
    const update = () => {
        mutate();
    };


    // watch(state, () => {
    //     if (!error.value && state && isReady.value) {
    //         isLoading.value = false;
    //         isCompleted.value = false;
    //         item.attributes.userDescription = localDescription.value;
    //         item.attributes.__modifiedBy = username;
    //         item.attributes.__modificationTimestamp = Date.now();
    //     }
    // });

    // const handleCancel = () => {
    //     isCompleted.value = false;
    //     isLoading.value = false;
    // };


    return {
        data, update, isReady, error
    }
}