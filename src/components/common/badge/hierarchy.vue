<template>
    <div class="flex text-xs tracking-wider">
        <div
            v-for="(data, index) in hierarchyInfo"
            :key="index"
            class="flex items-center mr-2"
        >
            <img :src="data.img" class="w-auto h-4 mr-1" />
            <span class="overflow-hidden overflow-ellipsis whitespace-nowrap">{{
                data.text
            }}</span>
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
    import useAssetInfo from '~/composables/asset/useAssetInfo'
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
                const {
                    integrationName,
                    databaseName,
                    schemaName,
                    logo,
                    databaseLogo,
                    schemaLogo,
                    tableInfo,
                } = useAssetInfo()
                hierarchyInfo.value = []
                hierarchyInfo.value.push({
                    text: integrationName(selectedAsset.value),
                    img: logo(selectedAsset.value),
                })
                hierarchyInfo.value.push({
                    text: databaseName(selectedAsset.value),
                    img: databaseLogo(selectedAsset.value),
                })
                hierarchyInfo.value.push({
                    text: schemaName(selectedAsset.value),
                    img: schemaLogo(selectedAsset.value),
                })

                // Pushing parent table info incase of columns
                let tableQN = tableInfo(
                    selectedAsset.value
                )?.uniqueAttributes.qualifiedName.split('/')

                if (tableQN)
                    hierarchyInfo.value.push({
                        text: tableQN[tableQN.length - 1],
                        img: '/src/assets/images/assetType/Table.svg',
                    })
            }

            watch(selectedAsset, init)
            onMounted(init)

            return { hierarchyInfo }
        },
    })
</script>

<style lang="less" scoped></style>
