<template>
    <!-- preloader -->
    <!-- TODO: isLoading from useAPI doesnt work fine  -->
    <!-- <div
        v-if="loading"
        class="flex items-center justify-center px-5 mt-4 text-base"
    >
        <a-spin size="small" class="mr-2 leading-none"></a-spin
        ><span>Getting relations</span>
    </div> -->
    <!-- preloader ends here -->
    <div class="flex items-center justify-between px-5 mt-4 mb-1 text-base">
        <!-- searchbar -->
        <a-input-search
            v-model:value="queryText"
            placeholder="Search"
            size="default"
        >
        </a-input-search>
        <!-- filters -->
        <a-popover title="Show/hide" trigger="click" placement="bottomRight">
            <template #content>
                <a-checkbox-group
                    v-model:value="checkedList"
                    :options="plainOptions"
                    class="flex flex-col"
                />
            </template>
            <a-button class="p-1 ml-2 rounded">
                <AtlanIcon icon="FilterDot" class="h-6" />
            </a-button>
        </a-popover>
    </div>
    <!-- accordions for different asset type -->
    <a-collapse
        :bordered="false"
        expand-icon-position="right"
        :accordion="true"
        class="m-0 bg-transparent"
        :class="$style.filter"
    >
        <template #expandIcon="{ isActive }">
            <div class="">
                <fa
                    icon="fas chevron-down"
                    class="ml-1 transition-transform transform"
                    :class="isActive ? '-rotate-180' : 'rotate-0'"
                />
            </div>
        </template>

        <!-- each panel is a asset type -->
        <a-collapse-panel
            v-for="(item, index) in filteredRelationshipAssets"
            :key="index"
            v-model:activeKey="activeKeys"
            class="bg-transparent"
        >
            <template #header>
                <div class="flex items-center px-5 py-4">
                    <!-- first letter to be uppercase -->
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
            <!-- accordion on expand  -->
            <AssetTypeItems
                :projections="checkedList"
                :assetType="item.displayText"
                :assetId="assetId"
                :cssClasses="cssClasses"
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
    import AssetTypeItems from '@/preview/asset/tabs/relations/assetTypeItems.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useEntityRelationships from '~/composables/asset/useEntityRelationships'

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
            const activeKeys = ref([])

            const checkedList = ref(['description'])
            const { selectedAsset } = toRefs(props)
            // TODO: define these flter types in constant folder
            const plainOptions = ['description', 'owners', 'business terms']

            const fetchData = () => {
                const { relationshipAssetTypes, isLoading } =
                    useEntityRelationships(selectedAsset.value.guid)

                relationshipAssets.value = relationshipAssetTypes.value
                assetId.value = selectedAsset.value.guid
                loading.value = isLoading.value
            }

            // filter required data
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

            onMounted(fetchData)
            return {
                relationshipAssets,
                loading,
                filteredRelationshipAssets,
                assetId,
                queryText,
                plainOptions,
                activeKeys,
                checkedList,
                cssClasses: {
                    textSize: 'text-sm',
                    paddingY: 'py-2',
                },
            }
        },
    })
</script>

<style lang="less" module>
    .filter {
        :global(.ant-collapse-content-box) {
            padding-right: 0px !important;
            padding-left: 0px !important;
            padding-top: 0px !important;
            padding-bottom: 0px !important;
        }
        :global(.ant-collapse-header) {
            padding-right: 0px !important;
            padding-left: 0px !important;
            padding-top: 0px !important;
            padding-bottom: 0px !important;
        }
    }
    .badge {
        :global(.ant-badge-dot) {
            @apply bg-primary !important;
        }
        :global(.ant-badge-count) {
            @apply top-3 right-2 !important;
        }
    }
</style>
