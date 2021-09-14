<template>
    <div v-if="isLoading && category?.guid !== id">
        <LoadingView />
    </div>
    <div v-else class="flex flex-row h-full" :class="$style.tabClasses">
        <div class="w-2/3 h-full">
            <ProfileHeader
                :title="title"
                :entity="category"
                :isNewEntity="isNewCategory"
                :statusMessage="statusMessage"
                :statusObject="statusObject"
                :shortDescription="shortDescription"
            />

            <div class="m-0">
                <a-tabs
                    v-model:activeKey="currentTab"
                    default-active-key="1"
                    class="border-0"
                >
                    <a-tab-pane key="1" tab="Overview">
                        <div class="px-8 mt-4">
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
                    <a-tab-pane key="2" tab="Terms & Sub-Categories">
                        <GlossaryTermsAndCategoriesTab
                            :qualified-name="parentGlossaryQualifiedName"
                            :display-text="title"
                            :guid="guid"
                            :show-preview-panel="currentTab === '2'"
                            type="AtlasGlossaryCategory"
                            @entityPreview="handleCategoryOrTermPreview"
                        />
                    </a-tab-pane>
                    <a-tab-pane key="4" tab="Requests"> Requests </a-tab-pane>
                    <a-tab-pane key="5" tab="Access Control">
                        Access Control
                    </a-tab-pane>
                </a-tabs>
            </div>
        </div>

        <div id="sidePanel" class="relative w-1/3 h-full">
            <SidePanel :entity="category" :top-terms="categoryTerms" />
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

    // components
    import GlossaryProfileOverview from '@/glossary/common/glossaryProfileOverview.vue'
    import LoadingView from '@common/loaders/page.vue'
    import { useRouter } from 'vue-router'
    import SidePanel from '@/glossary/sidePanel/index.vue'
    import GlossaryTermsAndCategoriesTab from '@/glossary/glossaryTermsAndCategoriesTab.vue'
    import ProfileHeader from '@/glossary/common/profileHeader.vue'

    // composables
    import useGTCEntity from '~/components/glossary/composables/useGtcEntity'
    import useCategoryTerms from '~/components/glossary/composables/useCategoryTerms'
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

            const {
                data: categoryTerms,
                error: termsError,
                isLoading: termsLoading,
                fetchCategoryTermsPaginated,
            } = useCategoryTerms()

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
            const redirectToProfile = () => {
                router.push(
                    `/glossary/${category.value?.attributes?.anchor?.guid}`
                )
            }

            // lifecycle methods and watchers
            onMounted(() => {
                fetchCategoryTermsPaginated({ guid: guid.value, offset: 0 })
            })

            watch(guid, (newGuid) => {
                fetchCategoryTermsPaginated({
                    guid: newGuid,
                    refreshSamePage: true,
                })
                newName.value = ''
            })

            watch(updatedEntity, () => {
                refetch()
                newName.value = ''
            })

            // Providers
            provide('refreshEntity', refetch)

            return {
                category,
                categoryTerms,
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
                termsLoading,
                guid,
                statusObject,
                isNewCategory,
                newName,
                handleCategoryOrTermPreview,
                handlClosePreviewPanel,
                updateTitle,
                redirectToProfile,
            }
        },
    })
</script>
<style lang="less" module>
    .categoryHome {
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
            padding: 0px 0px 18px 0px !important;
        }
        :global(.ant-tabs-nav) {
            margin: 0px !important;
        }
        :global(.ant-tabs-tab-active) {
            @apply text-gray-700 font-bold !important;
        }
        :global(.ant-tabs-bar) {
            @apply px-5 mb-0 !important;
        }
    }
</style>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
