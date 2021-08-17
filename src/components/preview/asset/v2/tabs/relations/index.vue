<template>
    <!-- {{ checkedList }} -->
    <div
        v-if="loading"
        class="flex items-center justify-center mt-4 text-sm leading-none"
    >
        <a-spin size="small" class="mr-2 leading-none"></a-spin
        ><span>Getting relations</span>
    </div>
    <div class="flex items-center justify-between">
        <a-input
            v-model:value="queryText"
            placeholder="Search for assets"
            size="default"
            class="my-3"
            @change="handleSearchChange"
        >
            <template #prefix>
                <Fa icon="fal cog" class="mr-2 text-gray-500" />
            </template>
        </a-input>
        <a-popover title="Show/hide" trigger="click">
            <template #content>
                <a-checkbox-group
                    v-model:value="checkedList"
                    :options="plainOptions"
                    class="flex flex-col"
                />
            </template>
            <Fa icon="fal plus" class="ml-2 text-gray-500 cursor-pointer" />
        </a-popover>
    </div>
    <a-collapse
        :bordered="false"
        expand-icon-position="right"
        accordion="true"
        class="p-0 m-0 bg-transparent"
    >
        <a-collapse-panel
            v-for="item in filteredRelationshipAssets"
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
            <AssetTypeItems
                :projections="checkedList"
                :assetType="item.displayText"
                :assetId="assetId"
            />
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
        computed,
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
            const queryText = ref('')

            const checkedList = ref(['description'])
            const { selectedAsset } = toRefs(props)
            const plainOptions = ['description', 'owners', 'business terms']

            const fetchData = () => {
                const { relationshipAssetTypes, isLoading } =
                    useEntityRelationships(selectedAsset.value.guid)

                relationshipAssets.value = relationshipAssetTypes.value
                assetId.value = selectedAsset.value.guid
            }

            const handleSearchChange = () => {
                console.log('changed')
            }
            const filteredRelationshipAssets = computed(() => {
                return relationshipAssets.value.filter((el) => {
                    return (
                        el.displayText
                            .toLowerCase()
                            .indexOf(queryText.value.toLowerCase()) !== -1
                    )
                })
            })
            watch(selectedAsset, fetchData, { immediate: true })
            // filter required data

            onMounted(fetchData)
            return {
                relationshipAssets,
                loading,
                filteredRelationshipAssets,
                assetId,
                queryText,
                handleSearchChange,
                plainOptions,
                checkedList,
            }
        },
    })
</script>

<style lang="less" scoped></style>
