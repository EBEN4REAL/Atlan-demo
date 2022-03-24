<template>
    <div class="py-2 mb-3 component-height">
        <div class="mx-5 mb-1 text-base font-semibold text-gray-500">
            Owned Assets
        </div>
        <div class="flex flex-col h-full rounded-lg">
            <AssetList
                :asset-name-truncate-percentage="'93%'"
                :asset-list-class="'h-5/6'"
                :open-asset-profile-in-new-tab="true"
                :filters="ownerFilter"
                :empty-view-text="
                    selectedUser || selectedGroup
                        ? `Seems like ${
                              selectedUser
                                  ? selectedUser.name
                                  : selectedGroup.name
                          } doesn't own any assets.`
                        : ''
                "
                aggregation-tab-class="px-5 my-1"
                search-bar-class="px-5 mt-1"
                asset-item-class="px-2"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, toRefs } from 'vue'
    import AssetList from '~/components/common/assetList/assetList.vue'
    import map from '~/constant/accessControl/map'

    export default defineComponent({
        name: 'AssetsTabs',
        components: {
            AssetList,
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
                    ownerGroups: selectedGroup.value?.alias
                        ? [selectedGroup.value.alias]
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
    .component-height {
        height: calc(100% - 5rem) !important;
    }
</style>
