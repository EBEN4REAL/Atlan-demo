
import { computed, ref, WritableComputedRef, watch } from 'vue';
import mitt from "mitt";
import updateAsset from '../utils/updateAsset';
import whoami from '../user/whoami';

export default function updateDescription(item: any) {

    const { username } = whoami();


    const localDescription = ref("");
    const isCompleted = ref(false);
    const body = ref({});
    const isLoading = ref(false);


    const getBody = () => ({
            entities: [
                {
                    guid: item.guid,
                    typeName: item.typeName,
                    attributes: {
                        qualifiedName: item.attributes?.qualifiedName,
                        name: item.attributes?.name,
                        userDescription: localDescription.value,
                        tenantId: item.attributes?.tenantId,
                    },
                },
            ],
        });
    const description: WritableComputedRef<string> = computed({
        get: () => (
                item?.attributes?.userDescription ||
                item?.attributes?.description
            ),
        set: (newValue: string) => {
            localDescription.value = newValue;
            body.value = getBody();
        },
    });
    const { state, execute, isReady, error } = updateAsset(body, { immediate: false });

    const update = () => {
        isLoading.value = true;
        execute();
    };


    watch(state, () => {
        if (!error.value && state && isReady.value) {
            isLoading.value = false;
            isCompleted.value = false;
            item.attributes.userDescription = localDescription.value;
            item.attributes.__modifiedBy = username;
            item.attributes.__modificationTimestamp = Date.now();
        }
    });

    const handleCancel = () => {
        isCompleted.value = false;
        isLoading.value = false;
    };


    return {
        description, state, execute, isReady, error, isCompleted, handleCancel, update, isLoading
    }
}