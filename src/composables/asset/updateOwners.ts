
import { computed, ref, WritableComputedRef, watch, Ref } from 'vue';
import updateAsset from '../utils/updateAsset';
import whoami from '../user/whoami';

export default function updateOwners(item: any, type: Ref<string>) {

    const { username } = whoami();

    const isCompleted = ref(false);
    const body: { [key: string]: any } = ref({});
    const localOwnerUsers: Ref<string[]> = ref([]);
    const localOwnerGroups: Ref<string[]> = ref([]);

    const getBody = () => {

        let val = {};
        if (type.value == "user") {
            val = {
                ownerUsers: localOwnerUsers.value.join(",")
            }
        } else if (type.value == "group") {
            val = {
                ownerGroups: localOwnerGroups.value.join(",")
            }
        }
        return {
            entities: [
                {
                    guid: item.guid,
                    typeName: item.typeName,
                    attributes: {
                        qualifiedName: item.attributes?.qualifiedName,
                        name: item.attributes?.name,
                        tenantId: item.attributes?.tenantId,
                        ...val
                    },
                },
            ],
        };
    };

    const ownerUsers: WritableComputedRef<string[]> = computed({
        get: () => {

            if (localOwnerUsers.value.length > 0) {
                return localOwnerUsers.value;
            } else {
                return (
                    item?.attributes?.ownerUsers?.split(",") || []
                );
            }

        },
        set: (newValue: string[]) => {
            localOwnerUsers.value = newValue;
            body.value = getBody();
        },
    });

    const ownerGroups: WritableComputedRef<string[]> = computed({
        get: () => {

            if (localOwnerGroups.value.length > 0) {
                return localOwnerGroups.value;
            } else {
                return (
                    item?.attributes?.ownerGroups?.split(",") || []
                );
            }

        },
        set: (newValue: string[]) => {
            localOwnerGroups.value = newValue;
            body.value = getBody();
        },
    });

    const { state, execute, isReady, error } = updateAsset(body, { immediate: false });

    watch(state, () => {
        if (!error.value) {
            isCompleted.value = false;
            if (type.value == "user") {
                item.attributes.ownerUsers = localOwnerUsers.value?.join(",");
            }
            if (type.value == "group") {
                item.attributes.ownerGroups = localOwnerGroups.value?.join(",");
            }

            item.attributes.__modifiedBy = username;
            item.attributes.__modificationTimestamp = Date.now();
        }
    });


    const handleCancel = () => {
        isCompleted.value = false;
    };

    return {
        handleCancel, ownerUsers, state, execute, isReady, error, isCompleted, ownerGroups
    }
}