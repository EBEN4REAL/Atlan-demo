<template>
    <div
        class="flex flex-col w-full overflow-y-hidden border-l"
        :class="$style.gtcPreview"
    >
        <div
            v-if="preview"
            class="flex flex-row items-center justify-between px-5 py-4 align-middle "
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
                    class="flex items-center justify-center p-2 mr-2 text-sm"
                    @click="redirectToProfile(entity?.typeName, entity?.guid)"
                >
                    <atlan-icon icon="OpenTermProfile" class="w-auto" />
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

                    <a-button class="flex items-center p-2"
                        ><atlan-icon icon="Share" class="w-auto" />
                    </a-button>
                </a-dropdown>
            </div>
        </div>

        <div
            v-if="preview"
            class="flex items-center justify-between pb-6 border-b"
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
                            <AtlanIcon
                                icon="ChevronDown"
                                class="ml-1 transition-transform transform"
                                :class="isActive ? '-rotate-180' : 'rotate-0'"
                            />
                        </template>
                        <a-collapse-panel key="details" header="Details">
                            <div class="flex flex-col pl-6 pr-2">
                                <Description
                                    v-if="entity.guid"
                                    :selected-asset="entity"
                                    @update:selected-asset="
                                        (updated) =>
                                            $emit('updateAsset', updated)
                                    "
                                />
                                <Owners
                                    v-if="entity.guid"
                                    :selected-asset="entity"
                                />
                                <Status
                                    v-if="entity.guid"
                                    :selected-asset="entity"
                                    @update:selected-asset="updateEntityAndTree"
                                />
                            </div>
                        </a-collapse-panel>

                        <a-collapse-panel
                            v-if="entity.typeName === 'AtlasGlossaryTerm'"
                            key="governance"
                            header="Governance"
                        >
                            <div class="px-6 py-0">
                                <Classifications :selected-asset="entity" />
                            </div>
                        </a-collapse-panel>

                        <a-collapse-panel
                            v-if="entity.typeName === 'AtlasGlossaryTerm'"
                            key="related terms"
                            header="Related Terms"
                        >
                            <div class="px-6 py-0">
                                <RelatedTerms :entity="entity" />
                            </div>
                        </a-collapse-panel>

                        <a-collapse-panel
                            v-if="entity?.typeName === 'AtlasGlossaryTerm'"
                            key="properties"
                            header="Properties"
                        >
                            <div class="px-6 py-0 text-gray-500">
                                <p class="p-0 m-0 mb-2">Formula</p>
                                <p class="p-0 m-0 mb-6 text-sm">X + Y + Z</p>
                                <p class="p-0 m-0 mb-2">Abbreviation</p>
                                <p class="p-0 m-0 text-sm">S2021</p>
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
                    <LinkedAssets
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
                <div class="h-screen overflow-auto pb-52">
                    <Activity :selected-asset="entity" />
                </div>
            </a-tab-pane>
            <!-- TODO: introduce afer GA -->
            <!-- <a-tab-pane key="requests" tab="Requests"> Requests </a-tab-pane> -->
            <!-- <a-tab-pane key="chat" tab="chat"> Chat </a-tab-pane> -->
        </a-tabs>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, computed, ref, inject } from 'vue'
    import { useRouter } from 'vue-router'
    // components
    import Owners from '@common/sidebar/owners.vue'
    import Classifications from '@common/sidebar/classifications.vue'
    import Experts from '@common/sidebar/experts.vue'
    import Description from '@common/sidebar/description.vue'
    import Status from '@common/sidebar/status.vue'
    import Activity from '@/discovery/preview/tabs/activity/activityTab.vue'
    import RelatedTerms from '@/glossary/termProfile/relatedTerms.vue'
    import LinkedAssets from './linkedAssets.vue'
    import SidePanelTabHeaders from '~/components/common/tabs/sidePanelTabHeaders.vue'
    import { Components } from '~/api/atlas/client'

    //  utils
    import assetTypeLabel from '@/glossary/constants/assetTypeLabel'
    import { copyToClipboard } from '~/utils/clipboard'

    import {
        Category,
        Term,
        Glossary,
    } from '~/types/glossary/glossary.interface'

    import { List as StatusList } from '~/constant/status'

    export default defineComponent({
        components: {
            Owners,
            Description,
            Status,
            Experts,
            Activity,
            Classifications,
            RelatedTerms,
            LinkedAssets,
            SidePanelTabHeaders,
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
            const activeKey = ref(['details'])
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
                        status.id === props.entity?.attributes?.assetStatus
                )
            )

            // methods
            const redirectToProfile = () => {
                if (props.entity.typeName === 'AtlasGlossaryCategory')
                    router.push(`/glossary/category/${props.entity.guid}`)
                else if (props.entity.typeName === 'AtlasGlossaryTerm')
                    router.push(`/glossary/term/${props.entity.guid}`)
            }
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
                context.emit('updateAsset', selectedAsset)
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
            @apply px-6 py-4 m-0  text-sm text-gray-700 bg-white !important;
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
            @apply py-2 mb-4 px-4 !important;
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
