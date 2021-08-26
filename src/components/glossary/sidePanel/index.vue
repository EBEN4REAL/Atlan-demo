<template>
    <div class="w-1/2 pt-4 border-l sidePanel" :class="$style.sidePanel">
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
                                <div class="flex space-x-16">
                                    <div class="flex flex-col">
                                        <span
                                            class="
                                                mb-2
                                                text-sm
                                                leading-5
                                                text-gray-500
                                            "
                                        >
                                            Categories
                                        </span>
                                        <span
                                            class="
                                                p-0
                                                m-0
                                                text-sm
                                                leading-5
                                                text-gray-700
                                            "
                                            >{{ categoryCount }}
                                        </span>
                                    </div>
                                    <div class="flex flex-col">
                                        <span
                                            class="
                                                mb-2
                                                text-sm
                                                leading-5
                                                text-gray-500
                                            "
                                        >
                                            Terms
                                        </span>
                                        <span
                                            class="
                                                p-0
                                                m-0
                                                text-sm
                                                leading-5
                                                text-gray-700
                                            "
                                            >{{ termCount }}
                                        </span>
                                    </div>
                                </div>
                                <Description
                                    v-if="entity.guid"
                                    :selectedAsset="entity"
                                />
                                <Owners
                                    v-if="entity.guid"
                                    :selectedAsset="entity"
                                />
                                <Experts
                                    v-if="entity.guid"
                                    :selectedAsset="entity"
                                />
                                <Status
                                    v-if="entity.guid"
                                    :selectedAsset="entity"
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
    import { defineComponent, PropType, computed, ref, toRef } from 'vue'

    import GlossaryTopTerms from '@/glossary/common/glossaryTopTerms.vue'
    import Owners from '@/discovery/preview/tabs/info/assetDetails/owners.vue'
    import Experts from '@/discovery/preview/tabs/info/assetDetails/experts.vue'
    import Description from '@/discovery/preview/tabs/info/assetDetails/description.vue'
    import Status from '@/discovery/preview/tabs/info/assetDetails/status.vue'
    import Activity from '~/components/discovery/preview/tabs/activity/activityTab.vue'

    import {
        Glossary,
        Category,
        Term,
    } from '~/types/glossary/glossary.interface'
    import { Components } from '~/api/atlas/client'

    export default defineComponent({
        components: {
            GlossaryTopTerms,
            Owners,
            Description,
            Status,
            Experts,
            Activity,
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
            return {
                shortDescription,
                termCount,
                categoryCount,
                glossaryTerms,
                activeKey,
            }
        },
    })
</script>
<style lang="less" module>
    .sidePanel {
        :global(.ant-collapse-header) {
            @apply pl-6 m-0 font-bold text-sm text-gray-700 bg-white !important;
        }
        :global(.ant-collapse-borderless > .ant-collapse-item) {
            @apply border-b border-gray-300 py-3  mt-0 !important;
        }

        :global(.ant-collapse) {
            @apply p-0 m-0 space-y-0 bg-white !important;
        }

        :global(.ant-collapse-content) {
            @apply mt-4 bg-white !important;
        }
        :global(.ant-collapse-content-box) {
            @apply m-0 p-0  bg-transparent !important;
        }
        :global(.ant-tabs-tabpane) {
            @apply m-0 p-0  !important;
        }
        :global(.ant-tabs-bar) {
            @apply mb-0 mx-0;
        }
    }
</style>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
