<template>
    <splitpanes class="w-full h-full default-theme" v-if="!isHome">
        <pane
            min-size="12"
            max-size="50"
            :size="12"
            style="min-width: 264px"
            class="relative z-20 bg-white"
            id="filterPane"
        >
            <GlossaryTree
                :glossaryList="[]"
                :is-home="false"
                :tree-data="treeData"
                :on-load-data="onLoadData"
                :select-node="selectNode"
                :expand-node="expandNode"
                :drag-and-drop="dragAndDropNode"
                :is-loading="isInitingTree"
                :loaded-keys="loadedKeys"
                :selected-keys="selectedKeys"
                :expanded-keys="expandedKeys"
                :collapse-all="collapseAll"
                :parent-glossary="parentGlossary"
                v-model:parentGlossaryGuid="parentGlossaryGuid"
            />        
        </pane>

        <pane :size="82" class="bg-white w-ful">
            <div class="flex w-full h-full bg-white">
                <div class="flex-1 border-r border-gray-300 item-stretch">
                    <div class="flex h-full">
                        <!-- <KeepAlive> -->
                            <router-view />
                        <!-- </KeepAlive> -->
                    </div>
                </div>

                <div
                    v-if="isItem"
                    id="overAssetPreviewSidebar"
                    class="relative bg-white asset-preview-container"
                >
                    <GlossaryPreview :selected-asset="tempTerm" />
                    <!-- <AssetPreview :selected-asset="selectedAsset"></AssetPreview> -->
                </div>
                <!-- <BulkNotification class="fixed bottom-0 right-0" /> -->
            </div>
        </pane>
    </splitpanes>

</template>

<script lang="ts">
    import { computed, defineComponent, ref } from 'vue'
    import { useHead } from '@vueuse/head'
    import { useRoute } from 'vue-router'
    // import { useRoute, useRouter } from 'vue-router'
    // import useBusinessMetadata from '@/admin/custom-metadata/composables/useBusinessMetadata'
    import GlossaryDiscovery from '@/glossary/index.vue'
    import GlossaryPreview from '@/glossary/preview/glossaryPreview.vue'
    import AssetPreview from '@/assets/preview/index.vue'
    import GlossaryTree from '@/glossary/tree/glossaryTree.vue'

    // import BulkSidebar from '@/common/bulk/bulkSidebar.vue'
    // import { assetInterface } from '~/types/assets/asset.interface'

    // import { useClassifications } from '~/components/admin/classifications/composables/useClassifications'
    // import useBulkUpdateStore from '~/store/bulkUpdate'
    // import BulkNotification from '~/components/common/bulk/bulkNotification.vue'
    // import useDiscoveryStore from '~/store/discovery'
    // import { storeToRefs } from 'pinia'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import useGlossaryTree from '~/composables/glossary/useGlossaryTree'

    // export interface initialFiltersType {
    //     facetsFilters: any
    //     searchText: string
    //     limit: number
    // }
    export default defineComponent({
        components: {
            // AssetPreview,
            GlossaryDiscovery,
            GlossaryPreview,
            AssetPreview,
            GlossaryTree
            // BulkSidebar,
            // BulkNotification,
        },
        setup(props, { emit }) {
            useHead({
                title: 'Assets',
            })
            // const storeDiscovery = useDiscoveryStore()
            // const { selectedAsset } = storeToRefs(storeDiscovery)
            // const router = useRouter()
            const route = useRoute()
            const isItem = computed(() => route.params.id)
            const parentGlossaryGuid = ref('69e06f30-fb85-44b6-b16e-874814deba79')

            const {
                treeData,
                loadedKeys,
                onLoadData,
                isInitingTree,
                expandedKeys,
                expandNode,
                selectNode,
                dragAndDropNode,
                selectedKeys,
                reInitTree,
                collapseAll,
                parentGlossary
            } = useGlossaryTree({
                emit,
                filterMode: true,
                parentGlossaryGuid,
            })

            const { selectedAsset } = useAssetInfo()
            // const updateProfile = ref<boolean>(false)
            // // const lastUpdatedItem = ref(false)
            // const assetDiscovery: Ref<Element | null> = ref(null)
            // // const initialFilters: initialFiltersType =
            // //     getDecodedOptionsFromString(router)

            // router.currentRoute.value?.query
            // // const selected: Ref<assetInterface | undefined> = ref(undefined)
            // // const handlePreview = (selectedItem: assetInterface) => {
            // //     selected.value = selectedItem
            // //     lastUpdatedItem.value = selectedItem

            // // }
            // const page = computed(() =>
            //     isItem.value ? 'profile' : 'discovery'
            // )
            // watch(isItem, (newData) => {
            //     if (!newData) {
            //         nextTick(() => {
            //             assetDiscovery.value.mutateAssetInList(
            //                 selectedAsset.value
            //             )
            //         })
            //         // setTimeout(() => {
            //         // }, 300);
            //     }
            // })
            // // * Get all available BMs and save on store
            // const { fetchBMonStore } = useBusinessMetadata()
            // fetchBMonStore()

            // /* Making the network request here to fetch the latest changes of classifications.
            // So that everytime user visit the discover page it will be in sync to latest data not with store
            // */
            // const {
            //     isClassificationInitializedInStore,
            //     initializeClassificationsInStore,
            // } = useClassifications()
            // if (!isClassificationInitializedInStore()) {
            //     initializeClassificationsInStore()
            // }
            // function propagateToAssetList(updatedAsset: assetInterface) {
            //     if (page.value === 'discovery')
            //         assetDiscovery.value.mutateAssetInList(updatedAsset)
            //     storeDiscovery.setSelectedAsset(updatedAsset)
            //     updateProfile.value = true
            // }
            // const store = useBulkUpdateStore()
            // const handleCloseBulk = () => {
            //     store.setBulkSelectedAssets([])
            //     store.setBulkMode(false)
            // }
            // return {
            //     selected: selectedAsset,
            //     isItem,
            //     page,
            //     propagateToAssetList,
            //     assetDiscovery,
            //     handleCloseBulk,
            //     store,
            // }

            const tempTerm = ref({
                typeName: 'AtlasGlossaryTerm',
                attributes: {
                    sourceCreatedAt: 0,
                    certificateStatus: 'VERIFIED',
                    __modifiedBy: 'nitya',
                    qualifiedName:
                        'EfIXVR40svdOlYWyvfLjk@ytL2hFWseVCrnw1bODcav',
                    __state: 'ACTIVE',
                    meanings: [],
                    __guid: '68e3d587-995d-4e3d-9dc6-f813d9cc7746',
                    ownerGroups: '',
                    certificateUpdatedBy: 'nitya',
                    sourceUpdatedAt: 0,
                    __createdBy: 'nitya',
                    announcementUpdatedAt: 0,
                    __modificationTimestamp: 1635319049422,
                    anchor: {
                        guid: 'a4a86135-040a-4aa9-8f94-d4313cc05356',
                        typeName: 'AtlasGlossary',
                        attributes: { name: 'Sales Glossary' },
                        uniqueAttributes: {
                            qualifiedName: 'ytL2hFWseVCrnw1bODcav',
                        },
                    },
                    name: 'term 1',
                    certificateUpdatedAt: 1635318463737,
                    __timestamp: 1635318400213,
                    ownerUsers: 'nitya',
                },
                guid: '68e3d587-995d-4e3d-9dc6-f813d9cc7746',
                status: 'ACTIVE',
                displayText: 'term 1',
                classificationNames: [],
                classifications: [],
                meaningNames: [],
                meanings: [],
                isIncomplete: false,
                labels: [],
            })

            return {
                tempTerm,
                isItem,
                selectedAsset,
                
                treeData,
                loadedKeys,
                onLoadData,
                isInitingTree,
                expandedKeys,
                expandNode,
                selectNode,
                reInitTree,
                collapseAll,
                dragAndDropNode,
                selectedKeys,
                parentGlossaryGuid,
                parentGlossary
            }
        },
    })
</script>
<style scoped>
    .asset-preview-container {
        width: 420px !important;
        max-width: 420px !important;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
