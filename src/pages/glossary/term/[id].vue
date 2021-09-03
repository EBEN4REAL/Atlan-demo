<template>
    <div v-if="isLoading && term?.guid !== id">
        <LoadingView />
    </div>
    <div v-else class="flex flex-row h-full" :class="$style.tabClasses">
        <div
            class="h-full overflow-auto"
            :class="
                currentTab === '1' || currentTab === '2' ? 'w-2/3' : 'w-full'
            "
        >
            <div class="flex flex-row justify-between pl-5 pr-5 mt-6 mb-5">
                <div class="flex flex-row w-full">
                    <div class="mr-5">
                        <img :src="TermSvg" />
                    </div>
                    <div class="flex flex-col w-full">
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
                    <a-button class="px-2"
                        ><atlan-icon
                            icon="BookmarkOutlined"
                            class="w-auto h-4 text-gray-700"
                    /></a-button>

                    <a-button class="flex items-center"
                        ><atlan-icon icon="Share" class="w-auto h-4 mr-2" />
                        <span class="mt-1 text-sm">Share</span>
                    </a-button>

                    <ThreeDotMenu :entity="term" :showLinks="false" />
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
                            <div v-if="isNewTerm" class="mb-4">
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
                            <GlossaryProfileOverview :entity="term" />
                        </div>
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="Linked Assets">
                        <div :class="$style.tabClasses">
                            <LinkedAssetsTab
                                :term-qualified-name="qualifiedName"
                                :show-preview-panel="currentTab === '2'"
                                @preview="handlePreview"
                            />
                        </div>
                    </a-tab-pane>
                </a-tabs>
            </div>
        </div>
        <div id="sidePanel" class="relative w-1/3 h-full">
            <CategoryTermPreview
                class="pt-6"
                :entity="term"
                :preview="false"
                @updateAsset="refetch"
            />
        </div>
        <!-- <div v-if="currentTab === '2' && previewEntity" class="border-l" :class="$style.tabClasses">
            <AssetPreview
                page="discovery"
                :selected-asset="previewEntity"
            ></AssetPreview>
        </div> -->
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, toRef, ref, provide, watch } from 'vue'

    import ThreeDotMenu from '@/glossary/common/threeDotMenu.vue'
    import GlossaryProfileOverview from '@/glossary/common/glossaryProfileOverview.vue'
    import TopAssets from '@/glossary/termProfile/topAssets.vue'
    import LinkedAssetsTab from '@/glossary/termProfile/linkedAssetsTab.vue'
    import EntityHistory from '@/glossary/common/entityHistory.vue'
    import LoadingView from '@common/loaders/page.vue'
    import RelatedTerms from '@/glossary/termProfile/relatedTerms.vue'
    import CategoryTermPreview from '@/glossary/common/categoryTermPreview/categoryTermPreview.vue'
    import AssetPreview from '~/components/discovery/preview/assetPreview.vue'

    import useGTCEntity from '~/composables/glossary/useGtcEntity'
    import useUpdateGtcEntity from '~/composables/glossary/useUpdateGtcEntity'

    import { Term } from '~/types/glossary/glossary.interface'

    import TermSvg from '~/assets/images/gtc/term/term.png'

    export default defineComponent({
        components: {
            GlossaryProfileOverview,
            TopAssets,
            RelatedTerms,
            LinkedAssetsTab,
            EntityHistory,
            LoadingView,
            CategoryTermPreview,
            AssetPreview,
            ThreeDotMenu,
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
            const previewEntity = ref()
            const newName = ref('')

            const {
                entity: term,
                title,
                shortDescription,
                qualifiedName,
                statusObject,
                error,
                isLoading,
                refetch,
            } = useGTCEntity<Term>('term', guid, guid.value)

            const { data: updatedEntity, updateEntity } = useUpdateGtcEntity()

            const parentGlossaryName = computed(
                () => term.value?.attributes?.qualifiedName?.split('@')[1] ?? ''
            )

            const linkedAssetsCount = computed(
                () => term.value?.attributes?.assignedEntities?.length ?? 0
            )

            const isNewTerm = computed(() => title.value === 'New Term')

            const handlePreview = (entity: any) => {
                previewEntity.value = entity
            }

            const updateTitle = () => {
                updateEntity('term', term.value?.guid ?? '', {
                    name: newName.value,
                })
            }

            watch(updatedEntity, () => {
                refetch()
                newName.value = ''
            })

            // Providers
            provide('refreshEntity', refetch)

            return {
                term,
                currentTab,
                error,
                isLoading,
                guid,
                TermSvg,
                title,
                shortDescription,
                qualifiedName,
                linkedAssetsCount,
                parentGlossaryName,
                previewEntity,
                statusObject,
                isNewTerm,
                newName,
                handlePreview,
                refetch,
                updateTitle,
            }
        },
    })
</script>
<style lang="less" module>
    .termHome {
        :global(.ant-tabs-bar) {
            @apply mb-0;
        }
        :global(.ant-tabs-nav) {
            @apply ml-8;
        }
    }
    .overviewTab {
        :global(.ant-tabs-nav) {
            @apply ml-0;
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
