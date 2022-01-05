<template>
    <a-popover
        v-model:visible="showGroupsPopover"
        placement="bottom"
        :trigger="['click']"
        :destroy-tooltip-on-hide="true"
        :overlay-class-name="$style.ownerPopover"
    >
        <template #content>
            <div class="">
                <OwnerFacets
                    v-model:modelValue="selectedGroupIds"
                    :show-none="false"
                    :enable-tabs="['groups']"
                    :hide-disabled-tabs="true"
                    select-group-key="id"
                    :user-id="selectedUser.id"
                />
            </div>
            <div class="flex justify-end mr-3">
                <a-button
                    :is-loading="addToGroupLoading"
                    type="text"
                    size="sm"
                    padding="compact"
                    :disabled="addToGroupLoading"
                    @click="handleCancel"
                >
                    Cancel
                </a-button>
                <AtlanButton
                    :is-loading="addToGroupLoading"
                    type="primary"
                    size="sm"
                    padding="compact"
                    :disabled="addToGroupLoading"
                    @click="addUserToGroups"
                >
                    <div class="flex items-center">
                        <div v-if="!addToGroupLoading">Add</div>
                        <div v-else>Saving</div>
                    </div>
                </AtlanButton>
            </div>
        </template>
        <div
            class="flex items-center px-1.5 py-1 cursor-pointer justify-between"
        >
            <span>
                <AtlanIcon class="mr-2" icon="Group" />
                Add to group
            </span>
            <AtlanIcon class="ml-3" icon="ChevronRight" />
        </div>
    </a-popover>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs, watch } from 'vue'
    import { message } from 'ant-design-vue'
    import OwnerFacets from '@/common/facet/owners/index.vue'
    import { Users } from '~/services/service/users'
    import AtlanButton from '@/UI/button.vue'

    export default defineComponent({
        name: 'AddGroupsUser',
        components: {
            OwnerFacets,
            AtlanButton,
        },
        props: {
            user: {
                type: Object,
                required: true,
            },
        },
        emits: ['groupAdded'],
        setup(props, { emit }) {
            const showGroupsPopover = ref(false)
            const selectedGroupIds = ref({ ownerGroups: [] })
            const addToGroupLoading = ref(false)
            const { user } = toRefs(props)
            const addUserToGroups = async () => {
                const groupIds = [...selectedGroupIds.value.ownerGroups]
                if (groupIds && groupIds.length) {
                    const requestPayload = ref({
                        groups: groupIds,
                    })
                    const {
                        data,
                        isReady,
                        error: addError,
                        isLoading: addLoading,
                    } = Users.AddGroups(props.user.id, requestPayload)
                    watch(
                        [data, isReady, addError, addLoading],
                        () => {
                            addToGroupLoading.value = addLoading.value
                            if (
                                isReady &&
                                !addError.value &&
                                !addLoading.value
                            ) {
                                emit('groupAdded')
                                message.success('User added to groups')
                                showGroupsPopover.value = false
                                selectedGroupIds.value.ownerGroups = []
                            } else if (addError && addError.value) {
                                message.error(
                                    'Unable to add user to groups, please try again.'
                                )
                            }
                        },
                        { immediate: true }
                    )
                }
                showGroupsPopover.value = false
            }
            // eslint-disable-next-line no-return-assign
            const handleCancel = () => (showGroupsPopover.value = false)
            return {
                showGroupsPopover,
                selectedUser: user,
                selectedGroupIds,
                addToGroupLoading,
                addUserToGroups,
                handleCancel,
            }
        },
    })
</script>

<style lang="less" module>
    .ownerPopover {
        :global(.ant-popover-inner-content) {
            @apply px-0 py-3 !important;
            width: 250px !important;
        }
    }
</style>
