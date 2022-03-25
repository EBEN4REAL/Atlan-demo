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
                <AtlanButton2
                    :loading="addMemberLoading"
                    :disabled="addMemberLoading"
                    :label="addMemberLoading ? 'Saving' : 'Save'"
                    @click="addMembersToGroup"
                />
            </div>
        </template>
        <slot name="label">
            <AtlanButton2
                color="secondary"
                label="Add Member"
                prefixIcon="Add"
            />
        </slot>
    </a-popover>
</template>

<script setup>
    import { computed, ref, watch, toRefs } from 'vue'
    import { message } from 'ant-design-vue'
    import OwnerFacets from '~/components/common/facet/owners/index.vue'
    import { Groups } from '~/services/service/groups'
    import { pluralizeString } from '~/utils/string'
    import useGroupMembers from '~/composables/group/useGroupMembers'
    import AtlanButton from '@/UI/button.vue'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    // Define props here.
    const props = defineProps({
        selectedGroup: {
            type: String,
            default: '',
        },
    })

    const { selectedGroup } = toRefs(props)

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
                    useAddEvent('admin', 'group', 'updated', {
                        action: 'members_updated',
                        users_count:
                            selectedGroup.value.memberCount + userIds.length,
                        slack_channel_added:
                            selectedGroup.value.attributes?.channels.some((c) =>
                                c?.includes('slack')
                            ),
                    })
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
