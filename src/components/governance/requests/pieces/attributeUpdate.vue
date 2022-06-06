<template>
    <template v-if="name === 'certificateStatus'">
        <div class="flex flex-col">
            <span class="pb-1 mr-2 text-sm text-gray-500">
                Update Certificate
            </span>
            <StatusBadge :status-id="value" show-no-status show-label />
        </div>
    </template>
    <template v-else>
        <div class="flex flex-col w-full">
            <span class="pb-1 pr-2 text-gray-500">{{ attrLabel }}</span>
            <span class="text-ellipsis text-gray">
                <div
                    v-if="
                        (name === 'ownerUsers' || name === 'ownerGroups') &&
                        valueArray?.length
                    "
                    class="flex items-center"
                >
                    <template v-for="el in valueArray.slice(0, 1)" :key="el">
                        <UserPill v-if="name === 'ownerUsers'" :username="el" />
                        <GroupPill v-else :name="el" />
                    </template>
                    <a-popover>
                        <template #content>
                            <div class="flex flex-col">
                                <template
                                    v-for="i in valueArray.slice(1)"
                                    :key="i"
                                >
                                    <span
                                        class="flex items-center px-2 py-1 border-gray-200"
                                        ><atlan-icon
                                            icon="User"
                                            class="h-3 mr-1"
                                        />{{ i }}</span
                                    >
                                </template>
                            </div>
                        </template>

                        <span
                            v-if="valueArray?.length > 1"
                            class="flex items-center ml-1 cursor-pointer text-primary"
                            >+ {{ valueArray?.length - 1 }}
                        </span>
                    </a-popover>
                </div>

                <div v-else class="relative">
                    <Truncate
                        v-if="name !== 'userDescription'"
                        :tooltip-text="value"
                    />

                    <description-popover
                        v-else
                        :request="request"
                        :loading="loading"
                        :is-approval-loading="isApprovalLoading"
                        :show-actions="request.status === 'active'"
                        @switch-update-popover="
                            (val) => {
                                $emit('switchPopover', val)
                            }
                        "
                        @accept="$emit('accept')"
                        @reject="$emit('reject')"
                    />
                </div>
            </span>
        </div>
    </template>
</template>

<script lang="ts">
    import { computed, defineComponent, toRefs, PropType } from 'vue'
    import StatusBadge from '@common/badge/status/index.vue'
    import UserPill from '@common/pills/user.vue'
    import Truncate from '@/common/ellipsis/index.vue'
    import GroupPill from '@/common/pills/group.vue'
    import DescriptionPopover from './descriptionPopover.vue'
    import { RequestAttributes } from '~/types/atlas/requests'

    export default defineComponent({
        components: {
            StatusBadge,
            Truncate,
            UserPill,
            GroupPill,
            DescriptionPopover,
        },

        props: {
            name: { type: String, required: true },
            value: { type: String, required: true },
            valueArray: { type: Array, required: true },
            loading: { type: Boolean, required: true },
            isApprovalLoading: { type: Boolean, required: true },
            request: {
                type: Object as PropType<RequestAttributes>,
                required: true,
            },
        },

        emits: ['accept', 'reject', 'switchPopover'],

        setup(props) {
            const { name } = toRefs(props)
            const labelMap = {
                userDescription: 'Update description',
                certificateStatus: 'Update certificate',
                ownerUsers: 'Update Owners',
                ownerGroups: 'Update Owners',
                name: 'Update Name',
            }

            const attrLabel = computed(() => labelMap[name.value] || 'ATTR')

            return { attrLabel }
        },
    })
</script>

<style scoped>
    .desc-wrapper {
        max-height: 6.5rem;
    }
    .w-fit {
        width: fit-content;
    }
</style>
