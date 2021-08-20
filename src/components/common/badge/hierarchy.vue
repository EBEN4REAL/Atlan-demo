<template>
    <div class="flex overflow-hidden text-xs tracking-wider flex-nowrap">
        <template v-for="data in hierarchyInfo">
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
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs } from 'vue'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        name: 'HierarchyBar',
        components: {},
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)

            const { logo, getHierarchy } = useAssetInfo()
            const hierarchyInfo = getHierarchy(selectedAsset.value)
                .filter((data) => data.value)
                .map((data) => ({ id: data.id, text: data.value }))

            return { hierarchyInfo, logo }
        },
    })
</script>

<style lang="less" scoped></style>
