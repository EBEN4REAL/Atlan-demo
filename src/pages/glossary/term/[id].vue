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
            <ProfileHeader
                :title="title"
                :entity="term"
                :isNewEntity="isNewTerm"
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
                                :term-guid="id"
                                :show-preview-panel="currentTab === '2'"
                                @preview="handlePreview"
                            />
                        </div>
                    </a-tab-pane>
                    <a-tab-pane key="4" tab="Requests"> Bots </a-tab-pane>
                    <a-tab-pane key="5" tab="Access Control">
                        Permissions
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
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, toRef, ref, provide, watch } from 'vue'

    import GlossaryProfileOverview from '@/glossary/common/glossaryProfileOverview.vue'
    import LinkedAssetsTab from '@/glossary/termProfile/linkedAssetsTab.vue'
    import EntityHistory from '@/glossary/common/entityHistory.vue'
    import RelatedTerms from '@/glossary/termProfile/relatedTerms.vue'
    import CategoryTermPreview from '@/glossary/common/categoryTermPreview/categoryTermPreview.vue'
    import AssetPreview from '~/components/discovery/preview/assetPreview.vue'
    import ProfileHeader from '@/glossary/common/profileHeader.vue'

    import useGTCEntity from '~/components/glossary/composables/useGtcEntity'
    import useUpdateGtcEntity from '~/components/glossary/composables/useUpdateGtcEntity'

    import { Term } from '~/types/glossary/glossary.interface'

    import TermSvg from '~/assets/images/gtc/term/term.png'

    import { useRouter } from 'vue-router'
    export default defineComponent({
        components: {
            GlossaryProfileOverview,
            LinkedAssetsTab,
            CategoryTermPreview,
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
            const guid = toRef(props, 'id')
            const currentTab = ref('1')
            const previewEntity = ref()
            const newName = ref('')
            const assetTypeLabel = {
                AtlasGlossaryTerm: 'term',
                AtlasGlossaryCategory: 'category',
                AtlasGlossary: 'glossary',
            }
            const router = useRouter()

            const {
                entity: term,
                title,
                shortDescription,
                qualifiedName,
                statusObject,
                error,
                statusMessage,
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
            const redirectToProfile = () => {
                router.push(`/glossary/${term.value?.attributes?.anchor?.guid}`)
            }
            watch(updatedEntity, () => {
                refetch()
                newName.value = ''
            })

            watch(guid, () => {
                currentTab.value = '1'
            })
            // Providers
            provide('refreshEntity', refetch)

            return {
                redirectToProfile,
                term,
                currentTab,
                error,
                isLoading,
                guid,
                TermSvg,
                title,
                statusMessage,
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
                assetTypeLabel,
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
            margin: 0px 32px 0px 0px;
            padding: 0px 0px 18px 0px;
        }
        :global(.ant-tabs-nav) {
            margin: 0px !important;
        }
        :global(.ant-tabs-tab-active) {
            @apply text-gray-700 font-bold !important;
        }
        :global(.ant-tabs-bar) {
            @apply px-5 mb-0;
        }
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
