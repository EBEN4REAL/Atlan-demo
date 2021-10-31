<template>
    <div>
        <div class="mb-2 text-base font-bold text-gray-500">Assets Owned</div>
        <div class="flex flex-col h-full border rounded-lg">
            <AssetsWrapper :dataMap="ownerFilter" />
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue'
import AssetsWrapper from '@common/assets/index.vue'

export default defineComponent({
    name: 'Assets',
    components: {
        AssetsWrapper,
    },
    props: {
        selectedUser: {
            type: Object,
            default: {},
        },
        selectedGroup: {
            type: Object,
            default: {},
        },
    },
    setup(props) {
        const { selectedUser, selectedGroup } = toRefs(props)
        const ownerFilter = computed(() => ({
            owners: {
                userValue: selectedUser.value.username
                    ? [selectedUser.value.username]
                    : [],
                groupValue: selectedGroup.value.name
                    ? [selectedGroup.value.name]
                    : [],
            },
        }))

        return {
            ownerFilter,
        }
    },
})
</script>

<style lang="less" scoped>
.asset-list-height {
    max-height: calc(100vh - 23.5rem);
}
</style>
