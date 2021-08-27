<template>
    <div class="overflow-hidden text-xs tracking-wider">
        <div
            v-if="assetType(selectedAsset).includes('Tableau')"
            class="flex items-center"
        >
            <div class="flex items-center">
                <div class="mr-4">
                    Tableau {{ assetType(selectedAsset).slice(7) }}
                </div>
                <div>
                    <span class="">{{ hierarchyInfo[0].label }} :</span>
                    <span class="ml-1 font-bold">{{
                        hierarchyInfo[0].text
                    }}</span>
                </div>
            </div>
        </div>
        <div v-else class="flex items-center">
            <div
                v-for="(data, index) in hierarchyInfo"
                :key="index"
                class="flex items-center"
            >
                <atlan-icon
                    v-if="data.id === 'Connection'"
                    icon="Connection"
                    class="w-auto h-4 mr-2"
                />
                <component v-else :is="data.id" class="w-auto h-4 mr-2" />
                <span
                    class="mr-3 overflow-hidden  overflow-ellipsis whitespace-nowrap"
                    >{{ data.text }}</span
                >
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, toRefs } from 'vue'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import AssetChip from '~/components/common/icon/assetChip.vue'

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
            const { getHierarchy, assetType } = useAssetInfo()
            const hierarchyInfo = computed(() =>
                getHierarchy(selectedAsset.value)
                    .filter((data) => data.value)
                    .map((data) => ({
                        id: data.id,
                        label: data.label,
                        text: data.value,
                    }))
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

            return { hierarchyInfo, assetType }
        },
    })
</script>
