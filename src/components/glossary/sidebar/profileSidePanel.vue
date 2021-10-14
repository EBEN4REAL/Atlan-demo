<template>
    <div class="w-full h-full border-l sidePanel" :class="$style.sidePanel">
        <a-tabs
            v-model:activeKey="tabActiveKey"
            tab-position="left"
            class="h-full"
        >
            <a-tab-pane key="info" class="p-0 m-0">
                <template #tab>
                    <SidePanelTabHeaders
                        title="Overview"
                        icon="Overview"
                        :isActive="tabActiveKey === 'info'"
                    />
                </template>

                <div class="h-screen pt-4 pb-24 overflow-auto">
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

                        <a-collapse-panel key="1" header="Details">
                            <div class="flex flex-col pl-5 pr-2 gap-y-4">
                                <div class="flex space-x-16">
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
                                    @update:selected-asset="refreshEntity"
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
                            </div>
                        </a-collapse-panel>

                        <a-collapse-panel key="2" header="Properties">
                            <div class="w-full px-5">
                                <Properties
                                    v-if="entity.guid"
                                    :selected-asset="entity"
                                    @update:selected-asset="updateEntityAndTree"
                                />
                            </div>
                        </a-collapse-panel>

                        <!-- <a-collapse-panel
                            v-if="termCount"
                            key="2"
                            header="Top Terms"
                        >
                            <div>
                                <GlossaryTopTerms
                                    v-if="glossaryTerms?.length"
                                    :terms="glossaryTerms"
                                />
                            </div>
                        </a-collapse-panel> -->
                    </a-collapse>
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
                <div class="h-screen overflow-auto">
                    <Activity :selectedAsset="entity" />
                </div>
            </a-tab-pane>
            <!-- hidden for GA -->
            <!-- <a-tab-pane key="chat">
                <template #tab>
                    <SidePanelTabHeaders
                        title="Chat"
                        icon="Chats"
                        :isActive="tabActiveKey === 'chat'"
                    />
                </template>
                Chat
            </a-tab-pane> -->
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
        watch,
        defineAsyncComponent,
    } from 'vue'

    import Owners from '@common/sidebar/owners.vue'
    import Experts from '@common/sidebar/experts.vue'
    import Description from '@common/sidebar/description.vue'
    import Status from '@common/sidebar/status.vue'
    import Properties from '@common/sidebar/properties.vue'
    import GlossaryTopTerms from '@/glossary/sidebar/glossaryTopTerms.vue'
    import Activity from '~/components/discovery/preview/tabs/activity/activityTab.vue'
    import SidePanelTabHeaders from '~/components/common/tabs/sidePanelTabHeaders.vue'

    import {
        Glossary,
        Category,
        Term,
    } from '~/types/glossary/glossary.interface'
    import { Components } from '~/api/atlas/client'
    import { useAccessStore } from '~/services/access/accessStore'

    export default defineComponent({
        components: {
            GlossaryTopTerms,
            Owners,
            Description,
            Status,
            Experts,
            SidePanelTabHeaders,
            Activity,
            Properties,
        },
        props: {
            entity: {
                type: Object as PropType<Glossary | Category | Term>,
                required: true,
                default: () => ({}),
            },
            topTerms: {
                type: Object as PropType<
                    Components.Schemas.AtlasGlossaryTerm[]
                >,
                required: false,
                default: () => ({}),
            },
        },
        setup(props) {
            const activeKey = ref(['1'])
            const tabActiveKey = ref('info')

            const refreshEntity = inject<() => void>('refreshEntity')
            const updateTreeNode = inject<any>('updateTreeNode')

            const shortDescription = computed(
                () => props.entity?.attributes?.shortDescription
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
            const glossaryTerms = computed(() => props.topTerms ?? [])

            const store = useAccessStore()
            const permissionMap = {
                AtlasGlossary: "UPDATE_GLOSSARY",
                AtlasGlossaryCategory: 'UPDATE_CATEGORY',
                AtlasGlossaryTerm: 'UPDATE_TERM'
            }
            const userHasEditPermission = computed(() => store.checkPermission(permissionMap[props.entity.typeName]))
            const updateEntityAndTree = (
                selectedAsset: Glossary | Category | Term
            ) => {
                if (updateTreeNode) {
                    updateTreeNode({
                        guid: selectedAsset.guid,
                        entity: selectedAsset,
                    })
                }
            }

            console.log(props.entity.typeName)

            // TODO: add BM panel

            // const applicableBMList = (typeName: string) => {

            // ?returning an empty array

            //     const ar =
            //         getApplicableBmGroups(typeName)?.map((b) => ({
            //             component: 'businessMetadata',
            //             id: b.name,
            //             label: b.options.displayName,
            //             image: b.options.image || '',
            //         })) || []
            //     console.log(typeName)
            //     console.log(ar)
            // }
            // const dynamicList = ref([])
            // applicableBMList(props.entity.typeName)
            // // watch(
            //     props.entity,
            //     () => {
            //         dynamicList.value = [
            //             ...applicableBMList(props.entity.typeName),
            //         ]
            //         console.log(applicableBMList(props.entity.typeName))
            //     },
            //     { immediate: true }
            // )

            // console.log(dynamicList.value)
            // console.log(props.entity.typeName)
            return {
                shortDescription,
                termCount,
                categoryCount,
                glossaryTerms,
                activeKey,
                refreshEntity,
                updateEntityAndTree,
                tabActiveKey,
                userHasEditPermission
            }
        },
    })
</script>
<style lang="less" module>
    .sidePanel {
        :global(.ant-tabs-nav-container-scrolling .ant-tabs-tab:first-child) {
            @apply ml-0 !important;
            @apply mt-4 !important;
        }

        :global(.ant-tabs-tab:first-child) {
            // @apply mt-4 !important;
            margin-top: 14px !important;
        }

        :global(.ant-collapse-header) {
            @apply py-4 px-5 text-sm text-gray-700 bg-white !important;
        }
        :global(.ant-collapse-borderless > .ant-collapse-item) {
            @apply border-0   mt-0 !important;
        }

        :global(.ant-collapse) {
            @apply p-0 m-0 space-y-0 bg-white !important;
        }

        :global(.ant-collapse-content) {
            @apply m-0 bg-white !important;
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
