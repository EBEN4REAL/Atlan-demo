<template>
    <div
        v-if="loading"
        class="flex items-center justify-center mt-4 text-sm leading-none"
    >
        <a-spin size="small" class="mr-2 leading-none"></a-spin
        ><span>Getting relations</span>
    </div>

    <a-collapse
        :bordered="false"
        expand-icon-position="right"
        accordion="true"
        class="p-0 m-0 bg-transparent"
    >
        <a-collapse-panel
            v-for="item in relationshipAssets"
            :key="item.displayText"
            class="bg-transparent"
        >
            <template #header>
                <div class="flex items-center">
                    <p class="my-0 font-bold">
                        {{ item.displayText.charAt(0).toUpperCase()
                        }}{{ item.displayText.slice(1) }}
                    </p>
                    <div
                        v-if="item.length"
                        class="px-2 mx-2 bg-primary-light text-primary"
                    >
                        {{ item.length }}
                    </div>
                </div>
            </template>
            <AssetTypeItems :assetType="item.displayText" :assetId="assetId" />
        </a-collapse-panel>
    </a-collapse>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        watch,
        ref,
        onMounted,
        toRefs,
    } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useEntityRelationships from '~/composables/asset/useEntityRelationships'
    import AssetTypeItems from './assetTypeItems.vue'

    export default defineComponent({
        components: { AssetTypeItems },
        props: {
            id: String,
            componentData: {
                type: Object as PropType<any>,
            },
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const relationshipAssets = ref([])
            const loading = ref(false)
            const assetId = ref('')
            const { selectedAsset } = toRefs(props)

            const fetchData = () => {
                const { relationshipAssetTypes, isLoading } =
                    useEntityRelationships(selectedAsset.value.guid)

                relationshipAssets.value = relationshipAssetTypes.value
                assetId.value = selectedAsset.value.guid
            }

            watch(selectedAsset, fetchData, { immediate: true })
            // filter required data

            onMounted(fetchData)
            return {
                relationshipAssets,
                loading,
                assetId,
            }
        },
    })
</script>

<style lang="less" scoped></style>
