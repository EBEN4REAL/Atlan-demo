<template>
    <div class="px-4 py-2 mb-3">
        <div class="mb-4 text-lg font-bold">Assets Owned</div>
        <div v-auth="map.LIST_USERS" class="flex flex-col rounded-lg">
            <AssetsWrapper
                :initial-filters="ownerFilter"
                :show-filters="false"
                :static-use="true"
                :show-aggrs="false"
                class="asset-list"
                page="admin"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, toRefs } from 'vue'
    import AssetsWrapper from '@/assets/index.vue'
    import map from '~/constant/accessControl/map'

    export default defineComponent({
        name: 'AssetsTabs',
        components: {
            AssetsWrapper,
        },
        props: {
            selectedUser: {
                type: Object,
                default: () => {},
            },
            selectedGroup: {
                type: Object,
                default: () => {},
            },
        },
        setup(props) {
            const { selectedUser, selectedGroup } = toRefs(props)
            const ownerFilter = computed(() => ({
                owners: {
                    ownerUsers: selectedUser.value?.username
                        ? [selectedUser.value.username]
                        : [],
                    ownerGroups: selectedGroup.value?.name
                        ? [selectedGroup.value.name]
                        : [],
                },
            }))

            return {
                ownerFilter,
                map,
            }
        },
    })
</script>

<style lang="less" scoped>
    .asset-list {
        max-height: calc(100vh - 11rem);
    }
</style>
