<template>
    <div v-if="id === '-1' || !userHasAccess">
        <NoAccessPage />
    </div>
    <div v-else>
        <div v-if="!category || (isLoading && category?.guid !== id)">
            <LoadingView />
        </div>
        <div v-else-if="category" class="flex flex-row h-full" :class="$style.tabClasses">
            <div
                class="w-2/3"
                ref="scrollDiv"
                :class="{
                    'overflow-y-auto': !headerReachedTop,
                    ' border-r': bulkSelectedAssets.length,
                }"
                :style="!headerReachedTop ? 'height: 100vh ' : ''"
                @scroll="handleScroll"
            >
                <ProfileHeader
                    :title="title"
                    :entity="category"
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
                                <GlossaryProfileOverview
                                    :entity="category"
                                    :header-reached-top="headerReachedTop"
                                    @firstCardReachedTop="
                                        handleFirstCardReachedTop
                                    "
                                />
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
        inject,
        provide,
        ComputedRef,
        WritableComputedRef,
        Ref
    } from 'vue'

    // components
    import LoadingView from '@common/loaders/page.vue'
    import BulkSidebar from '@/common/bulk/bulkSidebar.vue'
    import GlossaryProfileOverview from '~/components/glossary/profile/overview/glossaryProfileOverview.vue'
    import SidePanel from '~/components/glossary/sidebar/profileSidePanel.vue'
    import GlossaryTermsAndCategoriesTab from '~/components/glossary/profile/termsAndCategories/glossaryTermsAndCategoriesTab.vue'
    import ProfileHeader from '~/components/glossary/profile/profileHeader.vue'
    import NoAccessPage from '~/components/glossary/common/noAccessPage.vue'

    // composables

    // static
    import { Category, Term } from '~/types/glossary/glossary.interface'

    import { useAccessStore } from '~/services/access/accessStore'

    export default defineComponent({
        components: {
            GlossaryProfileOverview,
            GlossaryTermsAndCategoriesTab,
            LoadingView,
            SidePanel,
            ProfileHeader,
            BulkSidebar,
            NoAccessPage,
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
            const scrollDiv = ref(null)
            const headerReachedTop = ref(false)
            const temp = ref(false) // Flag for sticky header
            const bulkSelectedAssets = ref([])


            const category = inject<Ref<Category>>('currentEntity')
            const title = inject<WritableComputedRef<string | undefined>>('currentTitle')
            const shortDescription = inject<ComputedRef<string>>('currentShortDescription')
            const qualifiedName = inject<ComputedRef<string>>('currentQualifiedName')
            const statusObject = inject<ComputedRef>('statusObject')
            const error = inject<Ref>('profileError')
            const isLoading = inject<Ref<boolean> | undefined>('profileIsLoading')
            const refetch = inject<() => void>('refreshEntity', () => {})
            const statusMessage = inject<ComputedRef<string>>('statusMessage')

            // computed
            const termCount = computed(
                () => category.value?.attributes?.terms?.length ?? 0
            )
            const parentGlossaryQualifiedName = computed(
                () =>
                    category.value?.attributes?.qualifiedName?.split('@')[1] ??
                    ''
            )

            const accessStore = useAccessStore()
            const userHasAccess = computed(() =>
                accessStore.checkPermission('READ_CATEGORY')
            )

            // methods
            const handleCategoryOrTermPreview = (entity: Category | Term) => {
                previewEntity.value = entity
                showPreviewPanel.value = true
            }
            const handlClosePreviewPanel = () => {
                showPreviewPanel.value = false
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

            // upate bulk list for sidebar
            const updateBulkSelection = (list) => {
                bulkSelectedAssets.value = [...list.value]
                console.log(bulkSelectedAssets.value)
            }

            return {
                category,
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
                guid,
                statusObject,
                scrollDiv,
                headerReachedTop,
                handleCategoryOrTermPreview,
                handlClosePreviewPanel,
                handleScroll,
                handleFirstCardReachedTop,
                updateBulkSelection,
                bulkSelectedAssets,
                userHasAccess,
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
