<template>
    <div class="flex items-center overflow-hidden text-gray-500 flex-nowrap">
        <span class="mr-2" style="color: #c4c4c4"> • </span>
        <template v-for="(data, index) in hierarchyInfo" :key="data.id">
            <span
                class="overflow-hidden overflow-ellipsis whitespace-nowrap"
                :class="
                    index == hierarchyInfo.length - 1 ? 'text-gray-700' : ''
                "
                >{{ data.text }}</span
            >
            <span
                v-if="index !== hierarchyInfo.length - 1"
                class="px-1 text-gray-300"
                >/</span
            >
        </template>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, toRefs, inject } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    // import AssetChip from '~/components/common/icon/assetChip.vue'

    export default defineComponent({
        name: 'HierarchyBar',
        components: {
            // AssetChip
        },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)
            const { getHierarchy, getTableauHierarchy, assetType } =
                useAssetInfo()
            const hierarchyInfo = computed(() =>
                getHierarchy(selectedAsset.value)
                    .filter((data) => data.value)
                    .map((data) => ({ id: data.id, text: data.value }))
            )
            const tableauHierarchy = computed(() =>
                assetType(selectedAsset.value).startsWith('Tableau')
                    ? getTableauHierarchy(selectedAsset.value).map((data) => ({
                          id: data.id,
                          text: data.value,
                          icon: data.icon,
                      }))
                    : []
            )
            // INJECTIONS
            // TODO: remove after fixing hierarchy bug
            // const parentForBIAsset = inject('parentForBIAsset')
            return { hierarchyInfo, tableauHierarchy, assetType }
        },
    })
</script>

<style lang="less" scoped></style>
