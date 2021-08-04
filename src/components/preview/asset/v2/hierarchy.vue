<template>
    <div class="flex mb-4 text-xs tracking-wider">
        <div
            v-for="(data, index) in hierarchyInfo"
            :key="index"
            class="flex items-center flex-1"
        >
            <img :src="data.img" class="w-auto h-4 mr-1" />
            <span
                class="flex-1 overflow-hidden  overflow-ellipsis whitespace-nowrap"
                >{{ data.text }}</span
            >
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        onMounted,
        PropType,
        Ref,
        ref,
        toRefs,
        watch,
    } from 'vue'
    import useAssetInfo from './useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'

    interface dataChips {
        text: string
        img: string
    }

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
            const hierarchyInfo: Ref<dataChips[]> = ref([])

            function init() {
                const { integrationName, logo } = useAssetInfo()
                hierarchyInfo.value = []
                hierarchyInfo.value.push({
                    text: integrationName(selectedAsset.value),
                    img: logo(selectedAsset.value),
                })
            }

            watch(selectedAsset, init)
            onMounted(init)

            return { hierarchyInfo }
        },
    })
</script>

<style lang="less" scoped></style>
