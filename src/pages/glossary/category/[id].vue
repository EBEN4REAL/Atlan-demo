<template>
    <div v-if="isLoading && category?.guid !== id">
        <LoadingView />
    </div>
    <div v-else class="flex flex-row h-full" :class="$style.tabClasses">
        <div
            class="w-2/3 h-full"
            ref="scrollDiv"
            :class="{
                'overflow-y-auto': !headerReachedTop,
                ' border-r': bulkSelectedAssets.length,
            }"
            @scroll="handleScroll"
        >
            <ProfileHeader
                :title="title"
                :entity="category"
                :isNewEntity="isNewCategory"
                :statusMessage="statusMessage"
                :statusObject="statusObject"
                :shortDescription="shortDescription"
                :headerReachedTop="headerReachedTop"
            />

            <div class="m-0">
                <a-tabs
                    v-model:activeKey="currentTab"
                    default-active-key="1"
                    class="border-0"
                >
                    <a-tab-pane key="1" tab="Overview">
                        <div class="px-5 mt-4">
                            <div v-if="isNewCategory" class="mb-4">
                                <p
                                    class="p-0 mb-1 text-sm leading-5 text-gray-700 "
                                >
                                    Name
                                </p>
                                <div class="flex">
                                    <a-input
                                        v-model:value="newName"
                                        style="width: 200px"
                                    />
                                    <a-button
                                        v-if="newName"
                                        class="ml-4"
                                        type="primary"
                                        @click="updateTitle"
                                        >Submit</a-button
                                    >
                                </div>
                            </div>
                            <GlossaryProfileOverview :entity="category" />
                        </div>
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="Terms & Categories">
                        <GlossaryTermsAndCategoriesTab
                            :qualified-name="parentGlossaryQualifiedName"
                            :display-text="title"
                            :guid="guid"
                            :headerReachedTop="headerReachedTop"
                            :show-preview-panel="currentTab === '2'"
                            type="AtlasGlossaryCategory"
                            @entityPreview="handleCategoryOrTermPreview"
                            @firstCardReachedTop="handleFirstCardReachedTop"
                            @bulkSelectChange="updateBulkSelection"
                        />
                    </a-tab-pane>
                    <!-- <a-tab-pane key="4" tab="Requests"> Requests </a-tab-pane>
                    <a-tab-pane key="5" tab="Access Control">
                        Access Control
                    </a-tab-pane> -->
                </a-tabs>
            </div>
        </div>
        <div id="sidePanel" class="relative w-1/3 h-full">
            <SidePanel
                v-if="!bulkSelectedAssets || !bulkSelectedAssets.length"
                :entity="category"
            />
            <BulkSidebar
                v-else
                :bulk-selected-assets="bulkSelectedAssets"
            ></BulkSidebar>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        computed,
        watch,
        onMounted,
        toRef,
        ref,
        provide,
    } from 'vue'
    import { useRouter } from 'vue-router'

    // components
    import LoadingView from '@common/loaders/page.vue'
    import BulkSidebar from '@/common/bulk/bulkSidebar.vue'
    import GlossaryProfileOverview from '~/components/glossary/profile/overview/glossaryProfileOverview.vue'
    import SidePanel from '~/components/glossary/sidebar/profileSidePanel.vue'
    import GlossaryTermsAndCategoriesTab from '~/components/glossary/profile/termsAndCategories/glossaryTermsAndCategoriesTab.vue'
    import ProfileHeader from '~/components/glossary/profile/profileHeader.vue'

    // composables
    import useGTCEntity from '~/components/glossary/composables/useGtcEntity'
    // import useCategoryTerms from '~/components/glossary/composables/useCategoryTerms'
    import useUpdateGtcEntity from '~/components/glossary/composables/useUpdateGtcEntity'

    // static
    import { Category, Term } from '~/types/glossary/glossary.interface'

    export default defineComponent({
        components: {
            GlossaryProfileOverview,
            GlossaryTermsAndCategoriesTab,
            LoadingView,
            SidePanel,
            ProfileHeader,
            BulkSidebar,
        },
        props: {
            id: {
                type: String,
                required: true,
                default: '',
            },
        },
        setup(props) {
            // data
            const guid = toRef(props, 'id')
            const currentTab = ref('1')
            const previewEntity = ref<Category | Term | undefined>()
            const showPreviewPanel = ref(false)
            const newName = ref('')
            const scrollDiv = ref(null)
            const headerReachedTop = ref(false)
            const temp = ref(false) // Flag for sticky header
            const bulkSelectedAssets = ref([])

            const router = useRouter()

            const {
                entity: category,
                title,
                shortDescription,
                qualifiedName,
                statusMessage,
                statusObject,
                error,
                isLoading,
                refetch,
            } = useGTCEntity<Category>('category', guid, guid.value)

            // const {
            //     data: categoryTerms,
            //     error: termsError,
            //     isLoading: termsLoading,
            //     fetchCategoryTermsPaginated,
            // } = useCategoryTerms()

            const { data: updatedEntity, updateEntity } = useUpdateGtcEntity()

            // computed
            const termCount = computed(
                () => category.value?.attributes?.terms?.length ?? 0
            )
            const parentGlossaryQualifiedName = computed(
                () =>
                    category.value?.attributes?.qualifiedName?.split('@')[1] ??
                    ''
            )
            const isNewCategory = computed(
                () => title.value === 'Untitled Category'
            )

            // methods
            const handleCategoryOrTermPreview = (entity: Category | Term) => {
                previewEntity.value = entity
                showPreviewPanel.value = true
            }
            const handlClosePreviewPanel = () => {
                showPreviewPanel.value = false
            }

            const updateTitle = () => {
                updateEntity('category', category.value?.guid ?? '', {
                    name: newName.value,
                })
            }
            const handleScroll = () => {
                if (scrollDiv.value?.scrollTop > 70 && !temp.value) {
                    headerReachedTop.value = true
                } else if (scrollDiv.value?.scrollTop > 70 && temp.value) {
                    scrollDiv.value.scrollTop = 0
                    temp.value = !temp.value
                }
            }
            const handleFirstCardReachedTop = () => {
                scrollDiv.value.scrollTop = 0
                headerReachedTop.value = false
                temp.value = true
            }

            // lifecycle methods and watchers
            // onMounted(() => {
            //     fetchCategoryTermsPaginated({ guid: guid.value, offset: 0 })
            // })

            watch(guid, (newGuid) => {
                // fetchCategoryTermsPaginated({
                //     guid: newGuid,
                //     refreshSamePage: true,
                // })
                newName.value = ''
            })

            watch(updatedEntity, () => {
                refetch()
                newName.value = ''
            })
            // upate bulk list for sidebar
            const updateBulkSelection = (list) => {
                bulkSelectedAssets.value = [...list.value]
                console.log(bulkSelectedAssets.value)
            }

            // Providers
            provide('refreshEntity', refetch)

            return {
                category,
                // categoryTerms,
                currentTab,
                previewEntity,
                showPreviewPanel,
                title,
                statusMessage,
                shortDescription,
                termCount,
                parentGlossaryQualifiedName,
                qualifiedName,
                error,
                isLoading,
                // termsLoading,
                guid,
                statusObject,
                isNewCategory,
                newName,
                scrollDiv,
                headerReachedTop,
                handleCategoryOrTermPreview,
                handlClosePreviewPanel,
                updateTitle,
                handleScroll,
                handleFirstCardReachedTop,
                updateBulkSelection,
                bulkSelectedAssets,
            }
        },
    })
</script>
<style lang="less" module>
    .tabClasses {
        :global(.ant-tabs-tab) {
            margin: 0px 32px 0px 0px;
            padding: 0px 0px 18px 0px;
        }
        :global(.ant-tabs-nav) {
            margin: 0px !important;
        }
        :global(.ant-tabs-tab-active) {
            @apply text-gray-700 font-bold !important;
        }
        :global(.ant-tabs-bar) {
            @apply px-5 mb-0;
        }
    }
</style>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
