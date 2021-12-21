<template>
    <a-popover
        :mouseEnterDelay="0.2"
        :mouseLeaveDelay="0.2"
        @visibleChange="handleVisibleChange"
        placement="left"
    >
        <template #content>
            <div class="groups-popover">
                <div
                    class="flex flex-col"
                    v-if="!isLoading && selectedGroup.alias === item"
                >
                    <div class="flex items-center justify-between w-full">
                        <div class="flex items-center justify-between w-full">
                            <div class="flex items-center gap-3 mt-2">
                                <div>
                                    <div
                                        class="flex items-center text-sm font-semibold capitalize"
                                    >
                                        <span>{{ selectedGroup?.name }}</span>
                                    </div>
                                    <div class="text-xs text-gray-500">
                                        @{{ item }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            class="flex px-2 py-1 tracking-wide text-gray-500 bg-gray-100 border rounded"
                        >
                            <div class="mr-1">
                                {{ selectedGroup?.memberCount }}
                            </div>
                            Users
                        </div>
                    </div>
                </div>

                <div
                    class="flex items-center justify-center w-full px-4"
                    style="height: 110px"
                    v-else
                >
                    <a-spin></a-spin>
                </div>
                <a-button class="mt-3" block @click="handleClickGroup">
                    View Profile
                    <AtlanIcon icon="Enter" class="ml-1 mb-0.5" />
                </a-button>
            </div>
        </template>
        <slot></slot>
    </a-popover>
</template>

<script lang="ts">
    import { toRefs, computed, watch, ref } from 'vue'
    import UserPill from '@/common/pills/user.vue'
    import { useGroup } from '~/composables/group/useGroups'
    import useGroupMembers from '~/composables/group/useGroupMembers'
    import { useGroupPreview } from '~/composables/group/showGroupPreview'
    import useUserPopover from './composables/useUserPopover'

    export default {
        name: 'PopoverGroup',
        components: {
            UserPill,
        },
        props: {
            item: {
                type: String,
                required: false,
                default: '',
            },
        },
        emits: [],
        setup(props) {
            const { item } = toRefs(props)

            const params = {
                limit: 1,
                offset: 0,
                filter: {
                    $and: [{ name: item.value }],
                },
            }

            const { groupList, isLoading, getGroupList } = useGroup(
                params,
                false
            )

            const selectedGroup = computed(() =>
                groupList && groupList.value && groupList.value.length
                    ? groupList.value[0]
                    : {}
            )

            const { showGroupPreview, setGroupUniqueAttribute } =
                useGroupPreview()

            const handleClickGroup = () => {
                setGroupUniqueAttribute(item.value, 'groupAlias')
                showGroupPreview({ allowed: ['about', 'assets', 'members'] })
            }

            const handleVisibleChange = (state) => {
                if (state) {
                    getGroupList()
                }
            }

            return {
                selectedGroup,

                handleClickGroup,
                isLoading,
                handleVisibleChange,
                getGroupList,
            }
        },
    }
</script>
<style lang="less" scoped>
    .groups-popover {
        width: 370px;
        padding: 16px;
    }
</style>
