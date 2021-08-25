<template>
    <div
        class="flex flex-col w-1/3 min-h-screen border-l"
        :class="$style.gtcPreview"
    >
        <div
            v-if="preview"
            class="flex flex-row justify-between px-5 py-8 align-middle"
        >
            <div class="flex flex-row space-x-2 align-middle">
                <div class="flex flex-col justify-center">
                    <span>
                        <img
                            v-if="entity.typeName === 'AtlasGlossaryCategory'"
                            :src="CategorySvg"
                            :width="25"
                        />
                        <img
                            v-else-if="entity.typeName === 'AtlasGlossaryTerm'"
                            :src="TermSvg"
                        />
                    </span>
                </div>
                <span
                    v-if="type"
                    class="flex flex-col justify-center text-sm font-bold text-gray-500 "
                    >{{ type === 'AtlasGlossaryTerm' ? 'Term' : 'Category' }}
                </span>
            </div>
            <div class="flex flex-row space-x-2">
                <a-button class="px-2.5">
                    <fa icon="fal bookmark" />
                </a-button>
                <a-button
                    class="flex flex-col justify-center pt-1 text-xs border-0  text-primary bg-primary-light"
                    @click="redirectToProfile"
                >
                    Open
                    {{ type === 'AtlasGlossaryTerm' ? 'Term' : 'Category' }}
                    Details
                </a-button>
            </div>
        </div>
        <div v-if="preview" class="flex mb-5">
            <span class="pl-5 mr-2 text-xl font-bold leading-7 text-gray-700">{{
                entity.displayText
            }}</span>
            <component
                :is="statusObject?.icon"
                v-if="statusObject"
                class="inline-flex self-center w-auto h-5"
            />
        </div>

        <a-tabs default-active-key="1" class="border-0">
            <a-tab-pane key="info" tab="Info">
                <div class="h-screen overflow-auto pb-52">
                    <a-collapse :bordered="false" expand-icon-position="right">
                        <template #expandIcon="{ isActive }">
                            <fa v-if="isActive" icon="fas angle-up" />
                            <fa v-else icon="fas angle-down" />
                        </template>

                        <a-collapse-panel key="details" header="Details">
                            <div class="flex flex-col pl-6">
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
                            v-if="entity.typeName === 'AtlasGlossaryTerm'"
                            key="governance"
                            header="Governance"
                        >
                            <div class="px-6 py-0">
                                <Classifications :selectedAsset="entity" />
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
                    </a-collapse>
                </div>
            </a-tab-pane>
            <a-tab-pane
                v-if="entity.typeName === 'AtlasGlossaryTerm' && preview"
                key="linkedAssets"
                tab="Linked Assets"
            >
                <div class="h-screen overflow-auto pb-52">
                    <LinkedAssets
                        :termQualifiedName="entity.attributes.qualifiedName"
                    />
                </div>
            </a-tab-pane>
            <a-tab-pane key="activity" tab="Activity">
                <div class="h-screen overflow-auto">
                    <Activity :selectedAsset="entity" />
                </div>
            </a-tab-pane>
            <!-- <a-tab-pane key="requests" tab="Requests"> Requests </a-tab-pane> -->
            <!-- <a-tab-pane key="chat" tab="chat"> Chat </a-tab-pane> -->
        </a-tabs>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, computed, ref, toRef } from 'vue'
    import { useRouter } from 'vue-router'

    import Owners from '@/preview/asset/v2/tabs/info/assetDetails/owners.vue'
    import Experts from '@/preview/asset/v2/tabs/info/assetDetails/experts.vue'
    import Description from '@/preview/asset/v2/tabs/info/assetDetails/description.vue'
    import Status from '@/preview/asset/v2/tabs/info/assetDetails/status.vue'
    import Activity from '@/preview/asset/v2//tabs/activity/index.vue'
    import Classifications from '@/preview/asset/v2/tabs/info/governance/classifications.vue'
    import RelatedTerms from '@/glossary/termProfile/relatedTerms.vue'
    import LinkedAssets from './linkedAssets.vue'

    import { Category, Term } from '~/types/glossary/glossary.interface'
    import { Components } from '~/api/atlas/client'

    import TermSvg from '~/assets/images/gtc/term/term.png'
    import CategorySvg from '~/assets/images/gtc/category/category.png'

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
        setup(props) {
            const router = useRouter()

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

            const redirectToProfile = () => {
                if (props.entity.typeName === 'AtlasGlossaryCategory')
                    router.push(`/glossary/category/${props.entity.guid}`)
                else if (props.entity.typeName === 'AtlasGlossaryTerm')
                    router.push(`/glossary/term/${props.entity.guid}`)
            }

            return {
                TermSvg,
                CategorySvg,
                shortDescription,
                type,
                statusObject,
                redirectToProfile,
            }
        },
    })
</script>
<style lang="less" module>
    .gtcPreview {
        :global(.ant-collapse-header) {
            @apply pl-5 py-4 m-0 font-bold text-sm text-gray-700 bg-white !important;
        }
        :global(.ant-collapse-borderless > .ant-collapse-item) {
            @apply border-b border-gray-300 py-0 mt-0 !important;
        }

        :global(.ant-collapse) {
            @apply p-0 m-0 space-y-0 bg-white !important;
        }

        :global(.ant-collapse-content) {
            @apply mt-4 pb-4 bg-white !important;
        }
        :global(.ant-collapse-content-box) {
            @apply m-0 p-0  bg-transparent !important;
        }
        :global(.ant-tabs-tabpane) {
            @apply m-0 p-0  !important;
        }
        :global(.ant-tabs-bar) {
            @apply mb-0 mx-auto !important;
        }
    }
</style>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
