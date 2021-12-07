<template>
    <a-popover>
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
