<template>
    <a-popover>
        <template #content>
            <div class="groups-popover">
                <div class="flex items-center">
                    <!-- <img :src="logoTitle" class="h-3 mr-1" /> -->
                    <AtlanIcon icon="Group" class="mr-1 mb-0.5" />
                    <span class="uppercase">GROUP</span>
                </div>
                <div class="mt-2 mb-2">
                    <div class="text-xl font-semibold capitalize">
                        {{ groupData.name }}
                    </div>
                </div>
                <div class="flex items-center">
                    <AtlanIcon icon="User" class="mr-1 icon-blue-color" />
                    <span class="text-xs text-gray-500"
                        >{{ groupData.memberCount }} members</span
                    >
                    <div class="dot" />
                    <span class="text-xs text-gray-500">{{
                        groupData.alias
                    }}</span>
                </div>
                <div class="mt-3">
                    <div class="text-xs text-gray-500">Description</div>
                    <div>
                        {{
                            groupData?.description ||
                            `This group has no description added`
                        }}
                    </div>
                </div>
                <div class="mt-3">
                    <div class="text-xs text-gray-500">Ownership</div>
                    <div class="flex gap-5 mt-1">
                        <div>
                            <strong>{{ assetCount }}</strong> Assets
                        </div>
                        <div>
                            <strong>{{ bussinesCount }}</strong> Business Terms
                        </div>
                    </div>
                </div>
                <div class="mt-3">
                    <div class="text-xs text-gray-500">Created by</div>
                    <div class="flex gap-5 mt-1">
                        <UserPill :username="groupData.createdBy" />
                    </div>
                </div>
                <a-button class="mt-3" block @click="handleClickGroup">
                    <strong> View group profile </strong>
                    <AtlanIcon icon="Enter" class="mr-1 mb-0.5" />
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
                filter: [{ name: item.value }],
            }
            const { groupList } = useGroup(params, item.value)
            const groupData = computed(() => groupList.value[0] || {})
            const bussinesCountRef = ref(0)
            const assetCountRef = ref(0)
            const memberListParams = {
                groupId: groupList.value[0].id,
                params: {
                    limit: 10,
                    offset: 0,
                    sort: 'firstName',
                    filter: {},
                },
            }
            const { memberList } = useGroupMembers(memberListParams)
            watch(memberList, () => {
                const arrUserName = memberList.value.map((el) => el.username)
                const { bussinesCount, assetCount } = useUserPopover(
                    'group',
                    arrUserName
                )
                watch(
                    [assetCount, bussinesCount],
                    ([newAssetCount, newBussinesCount]) => {
                        assetCountRef.value = newAssetCount
                        bussinesCountRef.value = newBussinesCount
                    }
                )
            })
            const { showGroupPreview, setGroupUniqueAttribute } =
                useGroupPreview()
            const handleClickGroup = () => {
                setGroupUniqueAttribute(item.value, 'groupAlias')
                showGroupPreview({ allowed: ['about', 'assets', 'members'] })
            }

            return {
                groupData,
                bussinesCount: bussinesCountRef,
                assetCount: assetCountRef,
                handleClickGroup,
            }
        },
    }
</script>
<style lang="less" scoped>
    .groups-popover {
        width: 370px;
        padding: 16px;
    }
    .icon-blue-color {
        path {
            stroke: #5277d7;
        }
    }

    .dot {
        background: #c4c4c4;
        height: 4px;
        width: 4px;
        border-radius: 50%;
        margin: 0 5px;
    }
</style>
