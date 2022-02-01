<template>
    <a-popover
        v-model:visible="showPopover"
        placement="bottomLeft"
        :trigger="['click']"
        :destroy-tooltip-on-hide="true"
        :overlay-class-name="$style.ownerPopover"
        :align="{ offset: [0, -6] }"
        @click.stop=""
    >
        <template #content>
            <div class="">
                <OwnerFacets
                    v-model:modelValue="selectedUserIds"
                    :show-none="false"
                    :enable-tabs="['users']"
                    :hide-disabled-tabs="true"
                    select-user-key="id"
                    :group-id="selectedGroup.id"
                    :hide-tabs="true"
                />
            </div>
            <div class="flex justify-end mr-3">
                <AtlanButton
                    :is-loading="addMemberLoading"
                    type="primary"
                    size="sm"
                    padding="compact"
                    :disabled="addMemberLoading"
                    @click="addMembersToGroup"
                >
                    <div class="flex items-center">
                        <div v-if="!addMemberLoading">Save</div>
                        <div v-else>Saving</div>
                    </div>
                </AtlanButton>
            </div>
        </template>
        <slot name="label">
            <AtlanButton
                size="sm"
                padding="compact"
                class="text-gray-500 bg-transparent border-gray-300 hover:bg-transparent hover:text-primary hover:border-primary"
            >
                <div class="flex items-center">
                    <AtlanIcon icon="Add" class="h-3 mr-2"></AtlanIcon>
                    <div>Add Member</div>
                </div>
            </AtlanButton>
        </slot>
    </a-popover>
</template>

<script setup>
    import { computed, ref, watch } from 'vue'
    import { message } from 'ant-design-vue'
    import OwnerFacets from '~/components/common/facet/owners/index.vue'
    import { Groups } from '~/services/service/groups'
    import { pluralizeString } from '~/utils/string'
    import useGroupMembers from '~/composables/group/useGroupMembers'
    import AtlanButton from '@/UI/button.vue'

    // Define props here.
    const props = defineProps({
        selectedGroup: {
            type: String,
            default: '',
        },
    })

    // Define emits here.
    const emit = defineEmits(['membersAdded'])

    // Show Popover or Not
    const showPopover = ref(false)
    // The list of members to be added.
    const selectedUserIds = ref([])
    // Whether members are being added or not.
    const addMemberLoading = ref(false)

    /**
     * Driver function to add members to the group. Under the hood, it relies
     * on a `ref` of selected user IDs, that need to be added to that particular
     * group.
     */
    const addMembersToGroup = () => {
        const userIds = [...selectedUserIds.value.ownerUsers]
        const requestPayload = ref()
        requestPayload.value = {
            users: userIds,
        }
        const { data, isReady, error, isLoading } = Groups.AddMembers(
            props.selectedGroup.id,
            requestPayload
        )
        watch(
            [data, isReady, error, isLoading],
            () => {
                addMemberLoading.value = isLoading.value
                if (isReady && !error.value && !isLoading.value) {
                    message.success(
                        `${pluralizeString(
                            'Member',
                            userIds.length,
                            false
                        )} added`
                    )
                    showPopover.value = false
                    selectedUserIds.value.ownerUsers = []
                    emit('membersAdded')
                } else if (error && error.value) {
                    message.error('Unable to add members, please try again.')
                    showPopover.value = false
                }
            },
            { immediate: true }
        )
    }
</script>

<style lang="less" module>
    .ownerPopover {
        :global(.ant-popover-inner-content) {
            @apply px-0 py-3 !important;
            width: 250px !important;
        }
    }
</style>
