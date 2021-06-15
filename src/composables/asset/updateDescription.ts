
import { computed, ref, WritableComputedRef, watch } from 'vue';
import updateAsset from '../utils/updateAsset';
import mitt from "mitt";
import whoami from '../user/whoami';

export default function updateDescription(item: any) {

    const { username } = whoami();


    const localDescription = ref("");
    const isCompleted = ref(false);
    const body = ref({});
    const getBody = () => {
        return {
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
        };
    };
    const description: WritableComputedRef<string> = computed({
        get: () => {
            return (
                item?.attributes?.userDescription ||
                item?.attributes?.description
            );
        },
        set: (newValue: string) => {
            localDescription.value = newValue;
            body.value = getBody();
        },
    });
    const { state, execute, isReady, error } = updateAsset(body, { immediate: false });

    watch(state, () => {
        if (!error.value) {
            isCompleted.value = false;
            item.attributes.userDescription = localDescription.value;
            item.attributes.__modifiedBy = username;
            item.attributes.__modificationTimestamp = Date.now();
        }
    });

    return {
        description, state, execute, isReady, error, isCompleted
    }
}