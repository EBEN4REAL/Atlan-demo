<template>
    <div
        class="flex flex-col w-full overflow-y-hidden border-l"
        :class="$style.gtcPreview"
    >
        <div
            v-if="preview"
            class="flex flex-row items-center justify-between px-5 pt-3 align-middle "
        >
            <div class="flex flex-row space-x-2 align-middle">
                <div class="flex flex-col justify-center">
                    <span>
                        <AtlanIcon
                            icon="Category"
                            class="h-4 m-0 mb-1"
                            v-if="entity.typeName === 'AtlasGlossaryCategory'"
                        />

                        <AtlanIcon
                            icon="Term"
                            class="h-4 m-0"
                            v-else-if="entity.typeName === 'AtlasGlossaryTerm'"
                        />
                    </span>
                </div>
                <span v-if="type" class="flex flex-col justify-center text-sm"
                    >{{ type === 'AtlasGlossaryTerm' ? 'Term' : 'Category' }}
                </span>
            </div>
            <div class="flex flex-row items-center">
                <a-button
                    class="flex items-center justify-center p-1 px-2 text-sm border-r-0 rounded-none rounded-l "
                    @click="redirectToProfile(entity?.typeName, entity?.guid)"
                >
                    <atlan-icon
                        v-if="entity?.typeName === 'AtlasGlossaryTerm'"
                        icon="OpenTermProfile"
                        class="w-auto"
                    />
                    <atlan-icon
                        v-if="entity?.typeName === 'AtlasGlossaryCategory'"
                        icon="OpenCategoryProfile"
                        class="w-auto"
                    />
                </a-button>
                <a-dropdown>
                    <template #overlay>
                        <a-menu @click="handleMenuClick">
                            <a-menu-item key="1" @click="handleCopyProfileLink">
                                Copy link
                            </a-menu-item>
                            <!-- <a-menu-item key="2">
                            Share via other integration
                        </a-menu-item>
                        <a-menu-item key="3"> Share via slack </a-menu-item> -->
                        </a-menu>
                    </template>

                    <a-button
                        class="flex items-center p-1 px-2 rounded-none rounded-r "
                        ><atlan-icon icon="Share" class="w-auto" />
                    </a-button>
                </a-dropdown>
            </div>
        </div>

        <div
            v-if="preview"
            class="flex items-center justify-between pb-3 border-b"
        >
            <div class="flex w-3/4 tems-center">
                <span
                    class="items-baseline pl-5 mr-2 text-xl font-bold leading-7 truncate  text-primary"
                    >{{ entity.displayText }}</span
                >
                <component
                    :is="statusObject?.icon"
                    v-if="statusObject"
                    class="inline-flex self-center w-auto h-4 mb-0.5"
                />
            </div>
            <a-button
                class="fixed z-10 px-0 border-r-0 rounded-none rounded-l  -left-5"
                @click="handlClosePreviewPanel"
            >
                <AtlanIcon
                    icon="ChevronDown"
                    class="h-4 ml-1 transition-transform transform -rotate-90"
                />
            </a-button>
        </div>

        <!-- header ends here -->
        <a-tabs
            default-active-key="1"
            class="h-full border-0"
            tab-position="left"
            v-model:activeKey="tabActiveKey"
        >
            <a-tab-pane key="info">
                <template #tab>
                    <SidePanelTabHeaders
                        title="Overview"
                        icon="Overview"
                        :isActive="tabActiveKey === 'info'"
                    />
                </template>
                <div class="h-screen pb-64 overflow-auto">
                    <a-collapse
                        v-model:activeKey="activeKey"
                        :bordered="false"
                        expand-icon-position="right"
                    >
                        <template #expandIcon="{ isActive }">
                            <div class="">
                                <AtlanIcon
                                    icon="ChevronDown"
                                    class="ml-1 transition-transform duration-300 transform "
                                    :class="
                                        isActive ? '-rotate-180' : 'rotate-0'
                                    "
                                />
                            </div>
                        </template>

                        <a-collapse-panel key="details" header="Details">
                            <div class="flex flex-col pl-5 pr-2 gap-y-4">
                                <div
                                    v-if="
                                        entity?.typeName ===
                                        'AtlasGlossaryCategory'
                                    "
                                    class="flex mb-4 space-x-16"
                                >
                                    <div class="flex flex-col">
                                        <span
                                            class="mb-2 text-sm leading-5 text-gray-500 "
                                        >
                                            Categories
                                        </span>
                                        <span
                                            class="p-0 m-0 text-sm leading-5 text-gray-700 "
                                            >{{ categoryCount }}
                                        </span>
                                    </div>
                                    <div class="flex flex-col">
                                        <span
                                            class="mb-2 text-sm leading-5 text-gray-500 "
                                        >
                                            Terms
                                        </span>
                                        <span
                                            class="p-0 m-0 text-sm leading-5 text-gray-700 "
                                            >{{ termCount }}
                                        </span>
                                    </div>
                                </div>

                                <Description
                                    v-if="entity.guid"
                                    :selected-asset="entity"
                                    :editPermission="userHasEditPermission"
                                    @update:selected-asset="
                                        (updated) =>
                                            $emit('updateAsset', updated)
                                    "
                                />
                                <Owners
                                    v-if="entity.guid"
                                    :selected-asset="entity"
                                    :editPermission="userHasEditPermission"
                                    @update:selected-asset="updateEntityAndTree"
                                />
                                <Status
                                    v-if="entity.guid"
                                    :selected-asset="entity"
                                    :editPermission="userHasEditPermission"
                                    @update:selected-asset="updateEntityAndTree"
                                />
                                <Categories
                                    v-if="
                                        entity.guid &&
                                        entity.typeName === 'AtlasGlossaryTerm'
                                    "
                                    :categories="entity.attributes.categories"
                                    :glossaryQualifiedName="
                                        entity.attributes?.anchor
                                            ?.uniqueAttributes?.qualifiedName
                                    "
                                    :termGuid="entity.guid"
                                    :term="entity"
                                    :editPermission="userHasEditPermission"
                                    mode="edit"
                                />
                            </div>
                        </a-collapse-panel>

                        <!-- <a-collapse-panel
                            v-if="entity.typeName === 'AtlasGlossaryTerm'"
                            key="governance"
                            header="Governance"
                        >
                            <div class="px-5 py-0">
                                <Classifications :selected-asset="entity" />
                            </div>
                        </a-collapse-panel> -->

                        <!-- <a-collapse-panel
                            v-if="entity.typeName === 'AtlasGlossaryTerm'"
                            key="related terms"
                            header="Related Terms"
                        >
                            <div class="px-6 py-0">
                                <RelatedTerms :entity="entity" />
                            </div>
                        </a-collapse-panel> -->

                        <a-collapse-panel
                            v-if="entity?.typeName === 'AtlasGlossaryTerm'"
                            key="properties"
                            header="Properties"
                        >
                            <div class="w-full px-5">
                                <Properties
                                    v-if="entity.guid"
                                    :selected-asset="entity"
                                    @update:selected-asset="updateEntityAndTree"
                                />
                            </div>
                        </a-collapse-panel>
                    </a-collapse>
                </div>
            </a-tab-pane>
            <a-tab-pane
                v-if="entity.typeName === 'AtlasGlossaryTerm' && preview"
                key="linkedAssets"
            >
                <template #tab>
                    <SidePanelTabHeaders
                        title="Linked terms"
                        icon="Term"
                        :isActive="tabActiveKey === 'linkedAssets'"
                    />
                </template>
                <div class="h-screen overflow-auto pb-52">
                    <LinkedAssetsTab
                        :term-qualified-name="entity.attributes.qualifiedName"
                    />
                </div>
            </a-tab-pane>
            <a-tab-pane key="activity">
                <template #tab>
                    <SidePanelTabHeaders
                        title="Activity"
                        icon="Activity"
                        :isActive="tabActiveKey === 'activity'"
                    />
                </template>
                <div class="h-screen pb-48 overflow-auto">
                    <Activity :selected-asset="entity" />
                </div>
            </a-tab-pane>
            <a-tab-pane key="metadata">
                <template #tab>
                    <SidePanelTabHeaders
                        title="Custom metadata"
                        icon="Metadata"
                        :is-active="tabActiveKey === 'metadata'"
                    />
                </template>
                <div
                    class="flex items-center justify-between px-5 py-3 font-semibold text-gray-700  text-md"
                >
                    Custom metadata
                </div>
                <div class="h-screen overflow-auto pb-52">
                    <BusinessMetadataTab
                        v-if="entity"
                        :selected-asset="entity"
                        :info-tab-data="entity"
                    />
                </div>
            </a-tab-pane>
            <!-- TODO: introduce afer GA -->
            <!-- <a-tab-pane key="requests" tab="Requests"> Requests </a-tab-pane> -->
            <!-- <a-tab-pane key="chat" tab="chat"> Chat </a-tab-pane> -->
        </a-tabs>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        computed,
        ref,
        inject,
        defineAsyncComponent,
    } from 'vue'
    import { useRouter } from 'vue-router'
    // components
    import Owners from '@common/sidebar/owners.vue'
    import Classifications from '@common/sidebar/classifications.vue'
    import Experts from '@common/sidebar/experts.vue'
    import Description from '@common/sidebar/description.vue'
    import Status from '@common/sidebar/status.vue'
    import Activity from '@/discovery/preview/tabs/activity/activityTab.vue'
    import RelatedTerms from '@/glossary/profile/relatedTerms.vue'
    import LinkedAssetsTab from './linkedAssetsTab.vue'
    import SidePanelTabHeaders from '~/components/common/tabs/sidePanelTabHeaders.vue'
    import { Components } from '~/api/atlas/client'
    import Categories from '@/glossary/common/categories.vue'
    import { message } from 'ant-design-vue'

    //  utils
    import assetTypeLabel from '@/glossary/constants/assetTypeLabel'
    import { copyToClipboard } from '~/utils/clipboard'
    import redirect from '@/glossary/utils/redirectToProfile'

    import { useClassifications } from '~/components/admin/classifications/composables/useClassifications'

    import {
        Category,
        Term,
        Glossary,
    } from '~/types/glossary/glossary.interface'

    import { List as StatusList } from '~/constant/status'
    import { useAccessStore } from '~/services/access/accessStore'

    export default defineComponent({
        components: {
            Owners,
            Description,
            Status,
            Experts,
            Activity,
            Classifications,
            RelatedTerms,
            LinkedAssetsTab,
            SidePanelTabHeaders,
            Properties: defineAsyncComponent(
                () => import('@common/sidebar/properties.vue')
            ),
            BusinessMetadataTab: defineAsyncComponent(
                () =>
                    import(
                        '@/discovery/preview/tabs/businessMetadata/businessMetadataTab.vue'
                    )
            ),
            Categories,
        },
        props: {
            entity: {
                type: Object as PropType<Category | Term>,
                required: true,
                default: () => ({}),
            },
            preview: {
                type: Boolean,
                required: false,
                default: true,
            },
        },
        emits: ['closePreviewPanel', 'updateAsset'],
        setup(props, context) {
            const router = useRouter()
            const activeKey = ref('details')
            const tabActiveKey = ref('info')
            const updateTreeNode = inject<any>('updateTreeNode')
            // computed
            const shortDescription = computed(
                () => props.entity?.attributes?.shortDescription
            )
            const type = computed(() => props.entity?.typeName)

            const statusObject = computed(() =>
                StatusList.find(
                    (status) =>
                        status.id ===
                        props.entity?.attributes?.certificateStatus
                )
            )
            const termCount = computed(
                () => props.entity?.attributes?.terms?.length ?? 0
            )
            const categoryCount = computed(() => {
                if (props.entity?.typeName === 'AtlasGlossary') {
                    return props.entity?.attributes?.categories?.length ?? 0
                }
                if (props.entity?.typeName === 'AtlasGlossaryCategory') {
                    return (
                        props.entity?.attributes?.childrenCategories?.length ??
                        0
                    )
                }
                return 0
            })
            const store = useAccessStore()
            const permissionMap = {
                AtlasGlossary: 'UPDATE_GLOSSARY',
                AtlasGlossaryCategory: 'UPDATE_CATEGORY',
                AtlasGlossaryTerm: 'UPDATE_TERM',
            }
            const userHasEditPermission = computed(() =>
                store.checkPermission(permissionMap[props.entity.typeName])
            )

            // methods
            const redirectToProfile = redirect(router)
            const handlClosePreviewPanel = () => {
                context.emit('closePreviewPanel')
            }
            const updateEntityAndTree = (
                selectedAsset: Glossary | Category | Term
            ) => {
                if (updateTreeNode)
                    updateTreeNode({
                        guid: selectedAsset.guid,
                        entity: selectedAsset,
                    })
            }
            const handleCopyProfileLink = () => {
                const baseUrl = window.location.origin
                if (props.entity?.typeName !== 'AtlasGlossary') {
                    const text = `${baseUrl}/glossary/${
                        assetTypeLabel[props.entity?.typeName]
                    }/${props?.entity?.guid}`
                    copyToClipboard(text)
                } else {
                    const text = `${baseUrl}/${
                        assetTypeLabel[props.entity?.typeName]
                    }/${props?.entity?.guid}`
                    copyToClipboard(text)
                }
                message.success({
                    content: 'Copied!',
                })
            }
            const {
                isClassificationInitializedInStore,
                initializeClassificationsInStore,
            } = useClassifications()
            if (!isClassificationInitializedInStore()) {
                initializeClassificationsInStore()
            }
            return {
                shortDescription,
                type,
                handlClosePreviewPanel,
                statusObject,
                redirectToProfile,
                activeKey,
                tabActiveKey,
                updateEntityAndTree,
                handleCopyProfileLink,
                termCount,
                categoryCount,
                userHasEditPermission,
            }
        },
    })
</script>
<style lang="less" module>
    .gtcPreview {
        height: calc(100vh - 50px);
        :global(.ant-tabs-nav-container-scrolling .ant-tabs-tab:first-child) {
            @apply ml-0 !important;
            @apply mt-4 !important;
        }

        :global(.ant-collapse-header) {
            @apply px-5 py-4 m-0  text-sm text-gray-700 bg-white !important;
        }
        :global(.ant-collapse-borderless > .ant-collapse-item) {
            @apply py-0 mt-0 border-0 !important;
        }

        :global(.ant-collapse) {
            @apply p-0 m-0 space-y-0 bg-white !important;
        }
        :global(.ant-tabs-tab:first-child) {
            @apply mt-4 !important;
        }

        :global(.ant-collapse-content) {
            @apply mt-0  bg-white !important;
        }
        :global(.ant-collapse-content-box) {
            @apply m-0 p-0  bg-transparent !important;
        }
        :global(.ant-tabs-tabpane) {
            @apply m-0 p-0  !important;
        }
        :global(.ant-tabs-bar) {
            @apply mb-0 mx-0 p-0 m-0 !important;
        }
        :global(.ant-tabs-tab) {
            @apply py-2 mb-4 px-3 !important;
        }
        :global(.ant-tabs) {
            @apply px-0 !important;
        }
        :global(.ant-tabs-content) {
            @apply p-0 !important;
        }
    }
</style>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
