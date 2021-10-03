<template>
    <div v-if="isLoading && glossary?.guid !== id">
        <LoadingView />
    </div>
    <div v-else class="flex flex-row h-full" :class="$style.tabClasses">
        <div
            class="w-2/3 h-full"
            @scroll="handleScroll"
            ref="scrollDiv"
            :class="{ 'overflow-y-auto': !headerReachedTop }"
        >
            <!-- top section -->
            <ProfileHeader
                :title="title"
                :entity="glossary"
                :isNewEntity="isNewGlossary"
                :statusMessage="statusMessage"
                :statusObject="statusObject"
                :shortDescription="shortDescription"
                :headerReachedTop="headerReachedTop"
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
                        </div>
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="Terms & Categories">
                        <GlossaryTermsAndCategoriesTab
                            :qualified-name="qualifiedName"
                            :display-text="title"
                            :guid="glossary?.guid"
                            :type="glossary?.typeName"
                            :show-preview-panel="currentTab === '2'"
                            :headerReachedTop="headerReachedTop"
                            @entityPreview="handleCategoryOrTermPreview"
                            @firstCardReachedTop="handleFirstCardReachedTop"
                        />
                    </a-tab-pane>
                    <!-- Hide for GA -->
                    <!-- <a-tab-pane key="4" tab="Requests"> Bots </a-tab-pane>
                    <a-tab-pane key="5" tab="Access Control">
                        Permissions
                    </a-tab-pane> -->
                </a-tabs>
            </div>
        </div>

        <div id="sidePanel" class="relative w-1/3">
            <SidePanel :entity="glossary"  />
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        watch,
        toRef,
        ref,
        provide,
        computed,
        inject,
    } from 'vue'
    import { useRouter } from 'vue-router'

    // components
    import LoadingView from '@common/loaders/page.vue'
    import GlossaryTermsAndCategoriesTab from '@/glossary/glossaryTermsAndCategoriesTab.vue'
    import GlossaryProfileOverview from '@/glossary/common/glossaryProfileOverview.vue'
    import SidePanel from '~/components/glossary/sidebar/profileSidePanel.vue'
    import ProfileHeader from '@/glossary/common/profileHeader.vue'

    // composables
    import useGTCEntity from '~/components/glossary/composables/useGtcEntity'
    // import useGlossaryTerms from '~/components/glossary/composables/useGlossaryTerms'
    // import useGlossaryCategories from '~/components/glossary/composables/useGlossaryCategories'
    import useUpdateGtcEntity from '~/components/glossary/composables/useUpdateGtcEntity'

    // static
    import {
        Glossary,
        Category,
        Term,
    } from '~/types/glossary/glossary.interface'

    export default defineComponent({
        components: {
            GlossaryProfileOverview,
            GlossaryTermsAndCategoriesTab,
            LoadingView,
            SidePanel,
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
            const newName = ref('')
            const scrollDiv = ref(null)
            const headerReachedTop = ref(false)
            const temp = ref(false)

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

            const isNewGlossary = computed(
                () => title.value === 'Untitled Glossary'
            )

            // const {
            //     terms: glossaryTerms,
            //     error: termsError,
            //     isLoading: termsLoading,
            //     fetchGlossaryTermsPaginated,
            // } = useGlossaryTerms()

            // const {
            //     categories: glossaryCategories,
            //     error: categoriesError,
            //     isLoading: categoriesLoading,
            //     fetchGlossaryCategoriesPaginated,
            // } = useGlossaryCategories()

            const { data: updatedEntity, updateEntity } = useUpdateGtcEntity()

            // computed

            // methods
            const reInitTree = inject('reInitTree')

            // const refreshCategoryTermList = (type: string) => {
            //     if (type === 'category') {
            //         fetchGlossaryCategoriesPaginated({
            //             refreshSamePage: true,
            //         })
            //     } else if (type === 'term') {
            //         fetchGlossaryTermsPaginated({ refreshSamePage: true })
            //     }
            // }

            // const fetchNextCategoryOrTermList = (type: string) => {
            //     if (type === 'category') {
            //         fetchGlossaryCategoriesPaginated({
            //             limit: 5,
            //         })
            //     } else if (type === 'term') {
            //         fetchGlossaryTermsPaginated({ limit: 5 })
            //     }
            // }

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
                    setTimeout(() => {
                        reInitTree()
                    }, 2000)
                }
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
            //     fetchGlossaryTermsPaginated({ guid: guid.value, offset: 0 })
            //     fetchGlossaryCategoriesPaginated({
            //         guid: guid.value,
            //         offset: 0,
            //     })
            // })

            // watch(guid, (newGuid) => {
            //     fetchGlossaryTermsPaginated({
            //         guid: newGuid,
            //         offset: 0,
            //     })
            //     fetchGlossaryCategoriesPaginated({
            //         guid: newGuid,
            //         offset: 0,
            //     })
            // })

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
                // termsLoading,
                // categoriesLoading,
                guid,
                // glossaryTerms,
                // glossaryCategories,
                qualifiedName,
                currentTab,
                previewEntity,
                showPreviewPanel,
                statusObject,
                isNewGlossary,
                newName,
                scrollDiv,
                headerReachedTop,
                // refreshCategoryTermList,
                // fetchNextCategoryOrTermList,
                refetch,
                handleCategoryOrTermPreview,
                handlClosePreviewPanel,
                redirectToProfile,
                updateTitle,
                handleScroll,
                handleFirstCardReachedTop,
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
        :global(.ant-tabs-tab-active) {
            @apply text-gray-700 font-bold !important;
        }
        :global(.ant-tabs-bar) {
            @apply mb-0 !important;
        }
        :global(.ant-tabs-tab) {
            margin: 0px 32px 0px 0px;
            padding: 0px 0px 18px 0px;
        }

        :global(.ant-tabs-bar) {
            @apply ml-5;
        }
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
