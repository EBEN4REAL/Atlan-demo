<template>
    <div
        class="flex flex-col w-full overflow-y-hidden border-l"
        :class="$style.gtcPreview"
    >
        <div v-if="preview" class="flex items-center justify-between pt-6 mr-3">
            <div class="flex items-center">
                <span
                    class="items-baseline pl-5 mr-2 text-xl font-bold leading-7 text-gray-700 "
                    >{{ entity.displayText }}</span
                >
                <component
                    :is="statusObject?.icon"
                    v-if="statusObject"
                    class="inline-flex self-center w-auto h-5 mb-1"
                />
            </div>
            <a-button
                class="px-1 border-0 outline-none"
                @click="handlClosePreviewPanel"
            >
                <AtlanIcon icon="Cancel" class="h-5 m-0" />
            </a-button>
        </div>

        <div
            v-if="preview"
            class="flex flex-row justify-between px-5 pt-4 pb-5 align-middle border-b "
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
                    class="flex items-center justify-center p-0 mr-4 text-sm border-0 shadow-none outline-none "
                    @click="redirectToProfile(entity?.typeName, entity?.guid)"
                >
                    <atlan-icon icon="OpenTermProfile" class="w-auto mr-2" />
                    Open
                    {{ type === 'AtlasGlossaryTerm' ? 'Term' : 'Category' }}
                    Details
                </a-button>
                <a-button
                    class="flex items-center p-0 border-0 shadow-none outline-none "
                    ><atlan-icon icon="Share" class="w-auto mr-1" />
                    <span class="text-sm">Share</span>
                </a-button>
            </div>
        </div>
        <a-tabs
            default-active-key="1"
            class="h-full border-0"
            tab-position="left"
        >
            <a-tab-pane key="info">
                <template #tab>
                    <AtlanIcon icon="Overview" class="mt-1" />
                </template>
                <div class="h-screen pb-64 overflow-auto">
                    <a-collapse
                        v-model:activeKey="activeKey"
                        :bordered="false"
                        expand-icon-position="right"
                    >
                        <template #expandIcon="{ isActive }">
                            <fa v-if="isActive" icon="fas chevron-up" />
                            <fa v-else icon="fas chevron-down" />
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
                                <Experts
                                    v-if="entity.guid"
                                    :selected-asset="entity"
                                    @update:selected-asset="
                                        (updated) =>
                                            $emit('updateAsset', updated)
                                    "
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
                    <AtlanIcon icon="Term" class="mt-1" />
                </template>
                <div class="h-screen overflow-auto pb-52">
                    <LinkedAssets
                        :term-qualified-name="entity.attributes.qualifiedName"
                    />
                </div>
            </a-tab-pane>
            <a-tab-pane key="activity">
                <template #tab>
                    <AtlanIcon icon="Activity" />
                </template>
                <div class="h-screen overflow-auto pb-52">
                    <Activity :selected-asset="entity" />
                </div>
            </a-tab-pane>
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
    import { Components } from '~/api/atlas/client'

    //  utils
    import redirectToProfile from '@/glossary/utils/redirectToProfile'

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
            // const redirectToProfile = () => {
            //     if (props.entity.typeName === 'AtlasGlossaryCategory')
            //         router.push(`/glossary/category/${props.entity.guid}`)
            //     else if (props.entity.typeName === 'AtlasGlossaryTerm')
            //         router.push(`/glossary/term/${props.entity.guid}`)
            // }
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

            console.log(useRouter)
            return {
                shortDescription,
                type,
                handlClosePreviewPanel,
                statusObject,
                redirectToProfile,
                activeKey,
                updateEntityAndTree,
            }
        },
    })
</script>
<style lang="less" module>
    .gtcPreview {
        height: calc(100vh - 50px);
        :global(.ant-collapse-header) {
            @apply pl-6 py-4 m-0  text-sm text-gray-700 bg-white !important;
        }
        :global(.ant-collapse-borderless > .ant-collapse-item) {
            @apply py-0 mt-0 border-0 !important;
        }

        :global(.ant-collapse) {
            @apply p-0 m-0 space-y-0 bg-white !important;
        }

        :global(.ant-collapse-content) {
            @apply mt-0 pb-4 bg-white !important;
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
