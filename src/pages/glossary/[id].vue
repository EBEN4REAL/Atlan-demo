<template>
    <div v-if="isLoading">
        <LoadingView />
    </div>
    <div v-else class="flex flex-row h-full" :class="$style.tabClasses">
        <div
            class="h-full overflow-auto"
            :class="
                currentTab === '1' ||
                (currentTab === '2' && !previewEntity?.guid)
                    ? 'w-full'
                    : 'w-2/3'
            "
        >
            <div class="flex flex-row justify-between pl-8 pr-4 mt-6 mb-5">
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
                    <a-button class="px-2.5 flex align-middle">
                        <fa icon="fal upload" class="h-3 mr-2" />
                        <span>Share</span>
                    </a-button>
                    <a-button class="px-2.5">
                        <fa icon="fal ellipsis-v" class="h-4" />
                    </a-button>
                </div>
            </div>
            <div class="m-0">
                <a-tabs
                    v-model:activeKey="currentTab"
                    default-active-key="1"
                    class="border-0"
                >
                    <a-tab-pane key="1" tab="Overview">
                        <div class="px-5 mt-4">
                            <GlossaryProfileOverview :entity="glossary" />
                            <GlossaryContinueSettingUp
                                v-if="!isLoading"
                                :terms="glossaryTerms"
                                :categories="glossaryCategories"
                                @updateDescription="refreshCategoryTermList"
                                @fetchNextCategoryOrTermList="
                                    fetchNextCategoryOrTermList
                                "
                            />
                        </div>
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="Terms & Categories">
                        <GlossaryTermsAndCategoriesTab
                            :qualified-name="qualifiedName"
                            :guid="glossary.guid"
                            :type="glossary.typeName"
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
        <SidePanel
            v-if="currentTab === '1'"
            :entity="glossary"
            :topTerms="glossaryTerms"
        />
        <CategoryTermPreview
            v-if="currentTab === '2' && previewEntity"
            :entity="previewEntity"
        />
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
    } from 'vue'

    import GlossaryTermsAndCategoriesTab from '@/glossary/glossaryTermsAndCategoriesTab.vue'
    import LoadingView from '@common/loaders/page.vue'
    import GlossaryProfileOverview from '@/glossary/common/glossaryProfileOverview.vue'
    import GlossaryContinueSettingUp from '@/glossary/continueSettingUp/glossaryContinueSettingUp.vue'
    import EntityHistory from '@/glossary/common/entityHistory.vue'
    import SidePanel from '@/glossary/sidePanel/index.vue'
    import CategoryTermPreview from '@/glossary/common/categoryTermPreview/categoryTermPreview.vue'

    import useGTCEntity from '~/composables/glossary/useGtcEntity'
    import useGlossaryTerms from '~/composables/glossary/useGlossaryTerms'
    import useGlossaryCategories from '~/composables/glossary/useGlossaryCategories'

    import {
        Glossary,
        Category,
        Term,
    } from '~/types/glossary/glossary.interface'

    import GlossarySvg from '~/assets/images/gtc/glossary/glossary.png'
    import { List as StatusList } from '~/constant/status'

    export default defineComponent({
        components: {
            GlossaryProfileOverview,
            GlossaryContinueSettingUp,
            GlossaryTermsAndCategoriesTab,
            EntityHistory,
            LoadingView,
            SidePanel,
            CategoryTermPreview,
        },
        props: {
            id: {
                type: String,
                required: true,
                default: '',
            },
        },
        setup(props) {
            const guid = toRef(props, 'id')
            const currentTab = ref('1')
            const previewEntity = ref<Category | Term | undefined>()

            const {
                entity: glossary,
                error,
                isLoading,
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

            const title = computed(() => glossary.value?.attributes?.name)
            const shortDescription = computed(
                () => glossary.value?.attributes?.shortDescription
            )
            const qualifiedName = computed(
                () => glossary.value?.attributes?.qualifiedName ?? ''
            )
            const statusObject = computed(() =>
                StatusList.find(
                    (status) =>
                        status.id === glossary.value?.attributes?.assetStatus
                )
            )

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
            }

            return {
                glossary,
                title,
                shortDescription,
                error,
                isLoading,
                termsLoading,
                GlossarySvg,
                guid,
                glossaryTerms,
                glossaryCategories,
                qualifiedName,
                currentTab,
                previewEntity,
                statusObject,
                refreshCategoryTermList,
                fetchNextCategoryOrTermList,
                handleCategoryOrTermPreview,
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
            @apply px-5 !important;
        }
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
