
import { computed, ref, WritableComputedRef, watch, Ref } from 'vue';
import updateAsset from '../utils/updateAsset';
import whoami from '../user/whoami';

export default function updateOwners(item: any, type: Ref<string>) {

    const { username } = whoami();

    const isCompleted = ref(false);
    const body: { [key: string]: any } = ref({});
    const localOwnerUsers: Ref<string[]> = ref([]);
    localOwnerUsers.value = item?.attributes?.ownerUsers?.split(",") || [];

    const localOwnerGroups: Ref<string[]> = ref([]);
    localOwnerGroups.value = item?.attributes?.ownerGroups?.split(",") || [];

    const getBody = () => {

        let val = { ownerUsers: "", ownerGroups: "" };

        if (localOwnerUsers.value.length > 0) {
            val.ownerUsers = localOwnerUsers.value.join(",");
        } else {
            val.ownerUsers = "";
        }

        if (localOwnerUsers.value.length > 0) {
            val.ownerGroups = localOwnerGroups.value.join(",");
        } else {
            val.ownerGroups = "";
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
            return localOwnerUsers.value;
        },
        set: (newValue: string[]) => {
            localOwnerUsers.value = newValue;
            body.value = getBody();
        },
    });

    const ownerGroups: WritableComputedRef<string[]> = computed({
        get: () => {
            return localOwnerGroups.value;
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
            if (localOwnerUsers?.value?.length > 0) {
                item.attributes.ownerUsers = localOwnerUsers.value?.join(",");
            } else {
                item.attributes.ownerUsers = null;
            }
            if (localOwnerGroups?.value?.length > 0) {
                item.attributes.ownerGroups = localOwnerGroups.value?.join(",");
            } else {
                item.attributes.ownerGroups = null;
            }
            item.attributes.__modifiedBy = username;
            item.attributes.__modificationTimestamp = Date.now();

            console.log(item);
        }


    });


    const handleCancel = () => {
        isCompleted.value = false;
    };

    return {
        handleCancel, ownerUsers, state, execute, isReady, error, isCompleted, ownerGroups
    }
}