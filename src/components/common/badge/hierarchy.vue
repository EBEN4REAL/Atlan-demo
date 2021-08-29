<template>
    <div class="flex overflow-hidden text-xs tracking-wider flex-nowrap">
        <template v-for="data in hierarchyInfo" :key="data.id">
            <atlan-icon
                v-if="data.id === 'Connection'"
                icon="Connection"
                class="w-auto h-4 mr-2"
            />
            <component v-else :is="data.id" class="w-auto h-4 mr-2" />
            <span
                class="mr-3 overflow-hidden overflow-ellipsis whitespace-nowrap"
                >{{ data.text }}</span
            >
        </template>
        <template v-for="data in tableauHierarchy" :key="data.id">
            <atlan-icon
                v-if="data.icon === 'connectionName'"
                icon="Connection"
                class="w-auto h-4 mr-2"
            />
            <AssetChip
                v-else
                :type-name="data.id"
                integration-name="tableau"
                class="mr-2"
            />
            <span
                class="mr-3 overflow-hidden overflow-ellipsis whitespace-nowrap"
                >{{ data.text }}</span
            >
        </template>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, toRefs } from 'vue'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    // import AssetChip from '~/components/common/icon/assetChip.vue'
    export default defineComponent({
        name: 'HierarchyBar',
        components: { AssetChip },
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
            return { hierarchyInfo, tableauHierarchy }
        },
    })
</script>

<style lang="less" scoped></style>
