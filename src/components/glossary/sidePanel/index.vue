<template>
    <div class="w-full pt-4 border-l sidePanel" :class="$style.sidePanel">
        <a-tabs default-active-key="1">
            <a-tab-pane key="info" class="p-0 m-0" tab="Info">
                <div class="h-screen pb-24 overflow-auto">
                    <a-collapse
                        v-model:activeKey="activeKey"
                        :bordered="false"
                        expand-icon-position="right"
                    >
                        <template #expandIcon="{ isActive }">
                            <fa v-if="isActive" icon="fas chevron-up" />
                            <fa v-else icon="fas chevron-down" />
                        </template>
                        <a-collapse-panel key="1" header="Details">
                            <div class="flex flex-col pl-6">
                                <div class="flex mb-4 space-x-16">
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
                                    @update:selected-asset="refreshEntity"
                                />
                                <Owners
                                    v-if="entity.guid"
                                    :selected-asset="entity"
                                />
                                <Experts
                                    v-if="entity.guid"
                                    :selected-asset="entity"
                                    @update:selected-asset="refreshEntity"
                                />
                                <Status
                                    v-if="entity.guid"
                                    :selected-asset="entity"
                                    @update:selected-asset="updateEntityAndTree"
                                />
                            </div>
                        </a-collapse-panel>

                        <a-collapse-panel
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
                        </a-collapse-panel>
                        <a-collapse-panel key="3" header="Properties">
                            <div class="px-6 py-0 text-gray-500">
                                <p class="p-0 m-0 mb-2">Formula</p>
                                <p class="p-0 m-0 mb-6 text-sm">Add formula</p>
                                <p class="p-0 m-0 mb-2">Abbreviation</p>
                                <p class="p-0 m-0 text-sm">Add abbreviation</p>
                            </div>
                        </a-collapse-panel>
                    </a-collapse>
                </div>
            </a-tab-pane>
            <a-tab-pane key="activity" tab="Activity">
                <div class="h-screen overflow-auto">
                    <Activity :selectedAsset="entity" />
                </div>
            </a-tab-pane>
            <a-tab-pane key="chat" tab="Chat"> Chat </a-tab-pane>
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

    import GlossaryTopTerms from '@/glossary/common/glossaryTopTerms.vue'
    import Owners from '@common/sidebar/owners.vue'
    import Experts from '@common/sidebar/experts.vue'
    import Description from '@common/sidebar/description.vue'
    import Status from '@common/sidebar/status.vue'
    import Activity from '~/components/discovery/preview/tabs/activity/activityTab.vue'

    import {
        Glossary,
        Category,
        Term,
    } from '~/types/glossary/glossary.interface'
    import { Components } from '~/api/atlas/client'
    import businessMetadataListVue from '~/components/admin/custom-metadata/businessMetadataList.vue'
    import useBusinessMetadataHelper from '~/composables/businessMetadata/useBusinessMetadataHelper'

    export default defineComponent({
        components: {
            GlossaryTopTerms,
            Owners,
            Description,
            Status,
            Experts,
            Activity,
            businessMetadata: defineAsyncComponent(
                () =>
                    import(
                        '@/discovery/preview/tabs/info/businessMetadata/index.vue'
                    )
            ),
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

            const refreshEntity = inject<() => void>('refreshEntity')
            const updateTreeNode = inject<any>('updateTreeNode');

            const { getApplicableBmGroups } = useBusinessMetadataHelper()

            const shortDescription = computed(
                () => props.entity?.attributes?.shortDescription
            )
            const termCount = computed(
                () => props.entity?.attributes?.terms?.length ?? 0
            )
            const categoryCount = computed(
                () => props.entity?.attributes?.categories?.length ?? 0
            )
            const glossaryTerms = computed(() => props.topTerms ?? [])

            const updateEntityAndTree = (selectedAsset:  Glossary | Category | Term) => {
                if(refreshEntity)
                    refreshEntity()
                if(updateTreeNode){
                    updateTreeNode({guid: selectedAsset.guid, entity: selectedAsset})
                }
            }

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
            }
        },
    })
</script>
<style lang="less" module>
    .sidePanel {
        :global(.ant-collapse-header) {
            @apply pl-6 m-0  text-sm text-gray-700 bg-white !important;
        }
        :global(.ant-collapse-borderless > .ant-collapse-item) {
            @apply border-b border-gray-300 py-3  mt-0 !important;
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
            @apply mb-0 mx-0 px-6 !important;
        }
    }
</style>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
