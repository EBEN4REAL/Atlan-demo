
import { computed, ref, WritableComputedRef, watch } from 'vue';
import updateAsset from '../utils/updateAsset';
import whoami from '../user/whoami';

export default function updateAssetStatus(item: any) {

    const { username } = whoami();
    const assetStatus: { [key: string]: any } = ref({});
    const isCompleted = ref(false);
    const body: { [key: string]: any } = ref({});

    const statusId: WritableComputedRef<string> = computed({
        get: () => {
            return (
                assetStatus.value.id || item?.attributes?.assetStatus || "is_null"
            );
        },
        set: (newValue: string) => {
            assetStatus.value.id = newValue;
            body.value = getBody();
        },
    });
    const statusMessage: WritableComputedRef<string> = computed({
        get: () => {
            return (
                item?.attributes?.assetStatusMessage
            );
        },
        set: (newValue: string) => {
            assetStatus.value.message = newValue;
            body.value = getBody();
        },
    });


    const getBody = () => {
        return {
            entities: [
                {
                    guid: item.guid,
                    typeName: item.typeName,
                    attributes: {
                        qualifiedName: item.attributes?.qualifiedName,
                        name: item.attributes?.name,
                        assetStatus: assetStatus.value.id,
                        assetStatusMessage: assetStatus.value.message,
                        assetStatusUpdatedAt: Date.now(),
                        assetStatusUpdateBy: username,
                        tenantId: item.attributes?.tenantId,
                    },
                },
            ],
        };
    };
    const { state, execute, isReady, error } = updateAsset(body, { immediate: false });

    watch(state, () => {
        if (!error.value) {
            isCompleted.value = false;
            item.attributes.assetStatus = assetStatus.value.id;
            item.attributes.assetStatusMessage = assetStatus.value.message;
            item.attributes.assetStatusUpdatedAt = Date.now();
            item.attributes.assetStatusUpdateBy = username;
            item.attributes.__modifiedBy = username;
            item.attributes.__modificationTimestamp = Date.now();
        }
    });


    const handleCancel = () => {
        isCompleted.value = false;
    };

    return {
        handleCancel, statusId, statusMessage, state, execute, isReady, error, isCompleted
    }
}