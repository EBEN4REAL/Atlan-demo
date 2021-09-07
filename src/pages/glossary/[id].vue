<template>
    <div v-if="isLoading && glossary?.guid !== id">
        <LoadingView />
    </div>
    <div v-else class="flex flex-row h-full" :class="$style.tabClasses">
        <div class="w-2/3 h-full">
            <!-- top section -->
            <ProfileHeader
                :title="title"
                :entity="glossary"
                :statusMessage="statusMessage"
                :statusObject="statusObject"
                :shortDescription="shortDescription"
            />

            <!-- tabs start here  -->
            <div class="m-0">
                <a-tabs
                    v-model:activeKey="currentTab"
                    default-active-key="1"
                    class="border-0"
                >
                    <a-tab-pane key="1" tab="Overview">
                        <div class="px-5 mt-4">
                            <div v-if="isNewGlossary" class="mb-4">
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
                            :display-text="title"
                            :guid="glossary?.guid"
                            :type="glossary?.typeName"
                            :show-preview-panel="currentTab === '2'"
                            @entityPreview="handleCategoryOrTermPreview"
                        />
                    </a-tab-pane>
                    <a-tab-pane key="4" tab="Requests"> Bots </a-tab-pane>
                    <a-tab-pane key="5" tab="Access Control">
                        Permissions
                    </a-tab-pane>
                </a-tabs>
            </div>
        </div>

        <div id="sidePanel" class="relative w-1/3">
            <SidePanel :entity="glossary" :top-terms="glossaryTerms" />
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        watch,
        onMounted,
        toRef,
        ref,
        provide,
        computed,
        inject,
    } from 'vue'

    // components
    import GlossaryTermsAndCategoriesTab from '@/glossary/glossaryTermsAndCategoriesTab.vue'
    import LoadingView from '@common/loaders/page.vue'
    import GlossaryProfileOverview from '@/glossary/common/glossaryProfileOverview.vue'
    import GlossaryContinueSettingUp from '@/glossary/continueSettingUp/glossaryContinueSettingUp.vue'
    import EntityHistory from '@/glossary/common/entityHistory.vue'
    import SidePanel from '@/glossary/sidePanel/index.vue'
    import CategoryTermPreview from '@/glossary/common/categoryTermPreview/categoryTermPreview.vue'
    import ThreeDotMenu from '@/glossary/common/threeDotMenu.vue'
    import ProfileHeader from '@/glossary/common/profileHeader.vue'

    // composables
    import useGTCEntity from '~/composables/glossary/useGtcEntity'
    import useGlossaryTerms from '~/composables/glossary/useGlossaryTerms'
    import useGlossaryCategories from '~/composables/glossary/useGlossaryCategories'
    import useUpdateGtcEntity from '~/composables/glossary/useUpdateGtcEntity'

    import { useRouter } from 'vue-router'
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
            ProfileHeader,
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
            const assetTypeLabel = {
                AtlasGlossaryTerm: 'term',
                AtlasGlossaryCategory: 'category',
                AtlasGlossary: 'glossary',
            }
            const newName = ref('')

            const router = useRouter()
            const {
                entity: glossary,
                title,
                shortDescription,
                qualifiedName,
                statusObject,
                error,
                isLoading,
                refetch,
                statusMessage,
            } = useGTCEntity<Glossary>('glossary', guid)

            const isNewGlossary = computed(() => title.value === 'New Glossary')

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

            const { data: updatedEntity, updateEntity } = useUpdateGtcEntity()

            // computed

            // methods
            const reInitTree = inject('reInitTree')

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
            const redirectToProfile = () => {
                router.push(`/glossary`)
            }
            const updateTitle = () => {
                updateEntity('glossary', glossary.value?.guid ?? '', {
                    name: newName.value,
                })
                if (reInitTree) {
                    console.log(reInitTree, 'hello')
                    setTimeout(() => {
                        reInitTree()
                    }, 2000)
                }
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

            watch(updatedEntity, () => {
                refetch()
                newName.value = ''
            })

            // Providers
            provide('refreshEntity', refetch)

            return {
                glossary,
                title,
                statusMessage,
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
                isNewGlossary,
                newName,
                refreshCategoryTermList,
                fetchNextCategoryOrTermList,
                refetch,
                handleCategoryOrTermPreview,
                handlClosePreviewPanel,
                assetTypeLabel,
                redirectToProfile,
                updateTitle,
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
