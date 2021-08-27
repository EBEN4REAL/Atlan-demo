<template>
    <div v-if="isLoading && glossary?.guid !== id">
        <LoadingView />
    </div>
    <div v-else class="flex flex-row h-full" :class="$style.tabClasses">
        <div class="w-2/3 h-full">
            <!-- top section -->
            <div class="flex flex-row justify-between pl-5 pr-4 mt-6 mb-5">
                <div class="flex flex-row">
                    <div class="mr-5">
                        <img :src="GlossarySvg" />
                    </div>
                    <div class="flex flex-col w-3/4">
                        <div class="flex">
                            <span class="mr-3 text-xl font-bold leading-6">{{
                                title
                            }}</span>
                            <component
                                :is="statusObject?.icon"
                                v-if="statusObject"
                                class="inline-flex self-center w-auto h-4 mb-1"
                            />
                        </div>
                        <span class="mt-1 text-sm leading-5 text-gray-500">{{
                            shortDescription
                        }}</span>
                    </div>
                </div>
                <div class="flex flex-row space-x-2">
                    <a-button class="px-2.5">
                        <fa icon="fal bookmark" />
                    </a-button>
                    <a-button class="px-2.5 flex align-middle" @click="refetch">
                        <fa icon="fal upload" class="h-3 mr-2" />
                        <span>Share</span>
                    </a-button>
                    <ThreeDotMenu :entity="glossary" :showLinks="false" />
                    <!-- <a-dropdown :trigger="['click']">
                        <a-button class="px-2.5" @click.prevent>
                            <fa icon="fal ellipsis-v" class="h-4" />
                        </a-button>
                        <template #overlay>
                            <a-menu>
                                <a-menu-item>Add Term</a-menu-item>
                                <a-menu-item>Add Category</a-menu-item>
                                <a-menu-divider />
                                <a-sub-menu key="status" title="No status">
                                    <a-menu-item>Verified</a-menu-item>
                                    <a-menu-item>Work in Progress</a-menu-item>
                                    <a-menu-item>Warning</a-menu-item>
                                    <a-menu-item>Deprecated</a-menu-item>
                                </a-sub-menu>
                                <a-sub-menu key="owner" title="Add Owner">
                                    <a-menu-item>5d menu item</a-menu-item>
                                    <a-menu-item>6th menu item</a-menu-item>
                                </a-sub-menu>
                                <a-sub-menu key="expert" title="Add Expert">
                                    <a-menu-item>5d menu item</a-menu-item>
                                    <a-menu-item>6th menu item</a-menu-item>
                                </a-sub-menu>
                                <a-menu-divider />
                                <a-menu-item>Archive</a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown> -->
                </div>
            </div>
            <!-- tabs start here  -->
            <div class="m-0">
                <a-tabs
                    v-model:activeKey="currentTab"
                    default-active-key="1"
                    class="border-0"
                >
                    <a-tab-pane key="1" tab="Overview">
                        <div class="px-5 mt-4">
                            <GlossaryProfileOverview :entity="glossary" />
                            <!-- <GlossaryContinueSettingUp
                                v-if="
                                    !isLoading ||
                                    !termsLoading ||
                                    !categoriesLoading
                                "
                                :terms="glossaryTerms"
                                :categories="glossaryCategories"
                                @updateDescription="refreshCategoryTermList"
                                @fetchNextCategoryOrTermList="
                                    fetchNextCategoryOrTermList
                                "
                            /> -->
                        </div>
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="Terms & Categories">
                        <GlossaryTermsAndCategoriesTab
                            :qualified-name="qualifiedName"
                            :guid="glossary?.guid"
                            :type="glossary?.typeName"
                            :show-preview-panel="currentTab === '2'"
                            @entityPreview="handleCategoryOrTermPreview"
                        />
                    </a-tab-pane>
                    <a-tab-pane key="4" tab="Bots"> Bots </a-tab-pane>
                    <a-tab-pane key="5" tab="Permissions">
                        Permissions
                    </a-tab-pane>
                </a-tabs>
            </div>
        </div>

        <div id="sidePanel" class="relative w-1/3 ">
            <SidePanel :entity="glossary" :top-terms="glossaryTerms" />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, watch, onMounted, toRef, ref, provide } from 'vue'

    // components
    import GlossaryTermsAndCategoriesTab from '@/glossary/glossaryTermsAndCategoriesTab.vue'
    import LoadingView from '@common/loaders/page.vue'
    import GlossaryProfileOverview from '@/glossary/common/glossaryProfileOverview.vue'
    import GlossaryContinueSettingUp from '@/glossary/continueSettingUp/glossaryContinueSettingUp.vue'
    import EntityHistory from '@/glossary/common/entityHistory.vue'
    import SidePanel from '@/glossary/sidePanel/index.vue'
    import CategoryTermPreview from '@/glossary/common/categoryTermPreview/categoryTermPreview.vue'
    import ThreeDotMenu from '@/glossary/common/threeDotMenu.vue'

    // composables
    import useGTCEntity from '~/composables/glossary/useGtcEntity'
    import useGlossaryTerms from '~/composables/glossary/useGlossaryTerms'
    import useGlossaryCategories from '~/composables/glossary/useGlossaryCategories'

    // static
    import {
        Glossary,
        Category,
        Term,
    } from '~/types/glossary/glossary.interface'

    import GlossarySvg from '~/assets/images/gtc/glossary/glossary.png'

    export default defineComponent({
        components: {
            GlossaryProfileOverview,
            GlossaryContinueSettingUp,
            GlossaryTermsAndCategoriesTab,
            EntityHistory,
            LoadingView,
            SidePanel,
            CategoryTermPreview,
            ThreeDotMenu,
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

            const {
                entity: glossary,
                title,
                shortDescription,
                qualifiedName,
                statusObject,
                error,
                isLoading,
                refetch,
            } = useGTCEntity<Glossary>('glossary', guid)

            const {
                terms: glossaryTerms,
                error: termsError,
                isLoading: termsLoading,
                fetchGlossaryTermsPaginated,
            } = useGlossaryTerms()

            const {
                categories: glossaryCategories,
                error: categoriesError,
                isLoading: categoriesLoading,
                fetchGlossaryCategoriesPaginated,
            } = useGlossaryCategories()

            // computed

            // methods
            const refreshCategoryTermList = (type: string) => {
                if (type === 'category') {
                    fetchGlossaryCategoriesPaginated({
                        refreshSamePage: true,
                    })
                } else if (type === 'term') {
                    fetchGlossaryTermsPaginated({ refreshSamePage: true })
                }
            }

            const fetchNextCategoryOrTermList = (type: string) => {
                if (type === 'category') {
                    fetchGlossaryCategoriesPaginated({
                        limit: 5,
                    })
                } else if (type === 'term') {
                    fetchGlossaryTermsPaginated({ limit: 5 })
                }
            }

            const handleCategoryOrTermPreview = (entity: Category | Term) => {
                previewEntity.value = entity
                showPreviewPanel.value = true
            }
            const handlClosePreviewPanel = () => {
                previewEntity.value = undefined
                showPreviewPanel.value = false
            }

            // lifecycle methods and watchers
            onMounted(() => {
                fetchGlossaryTermsPaginated({ guid: guid.value, offset: 0 })
                fetchGlossaryCategoriesPaginated({
                    guid: guid.value,
                    offset: 0,
                })
            })

            watch(guid, (newGuid) => {
                fetchGlossaryTermsPaginated({
                    guid: newGuid,
                    offset: 0,
                })
                fetchGlossaryCategoriesPaginated({
                    guid: newGuid,
                    offset: 0,
                })
            })

            // Providers
            provide('refreshEntity', refetch)

            return {
                glossary,
                title,
                shortDescription,
                error,
                isLoading,
                termsLoading,
                categoriesLoading,
                GlossarySvg,
                guid,
                glossaryTerms,
                glossaryCategories,
                qualifiedName,
                currentTab,
                previewEntity,
                showPreviewPanel,
                statusObject,
                refreshCategoryTermList,
                fetchNextCategoryOrTermList,
                refetch,
                handleCategoryOrTermPreview,
                handlClosePreviewPanel,
            }
        },
    })
</script>
<style lang="less" module>
    .glossaryHome {
        :global(.ant-tabs-nav) {
            @apply ml-8;
        }
        :global(.ant-tabs-bar) {
            @apply mb-0;
        }
    }
    .tabClasses {
        :global(.ant-tabs-tab) {
            margin: 0px 32px 0px 0px !important;
            padding: 0px 0px 20px 0px !important;
        }
        :global(.ant-tabs-nav) {
            margin: 0px !important;
        }
        :global(.ant-tabs-tab-active) {
            @apply text-gray-700 font-bold !important;
        }
        :global(.ant-tabs-bar) {
            @apply px-5;
        }
        :global(.ant-tabs-bar) {
            @apply mb-0 !important;
        }
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
