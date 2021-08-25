<template>
    <div class="px-5">
        <div class="flex flex-wrap items-center w-full gap-x-16 gap-y-4">
            <template v-for="item in propertiesData" :key="item.id">
                <div class="flex flex-col text-sm cursor-pointer">
                    <span class="mb-2 text-sm text-gray-500">{{
                        item.label
                    }}</span>
                    <span class="text-gray-700">{{ item[item.id] }}</span>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/asset/useAssetInfo'

    export default defineComponent({
        name: 'TableauProperties',
        components: {},
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            properties: {
                type: Object as PropType<string[]>,
                required: true,
            },
        },
        setup(props) {
            const { selectedAsset, properties } = toRefs(props)
            const { getTableauProperties } = useAssetInfo()
            const propertiesData = getTableauProperties(
                selectedAsset.value,
                properties
            )
            return {
                propertiesData,
                properties,
            }
        },
    })
</script>

<style lang="less" module></style>
