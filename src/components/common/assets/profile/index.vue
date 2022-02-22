<template>
    <div class="flex flex-col w-full h-full">
        <AssetHeader :item="asset" />
        <a-tabs
            v-model:activeKey="activeKey"
            :class="$style.profiletab"
            class="flex-1"
            :destroy-inactive-tab-pane="true"
        >
            <a-tab-pane
                v-for="tab in getProfileTabs(asset)"
                :key="tab.id"
                :tab="tab.label"
                :disabled="isScrubbed(asset) && tab.scrubbed"
            >
                <NoAccess
                    v-if="isScrubbed(asset) && tab.scrubbed"
                    :back-button="true"
                />

                <component
                    :is="tab.component"
                    v-else-if="tab.component"
                    :key="tab.id"
                    :selected-asset="asset"
                    :read-permission="isScrubbed(asset)"
                    @preview="$emit('preview', $event)"
                    @saved-changes="
                        () => {
                            savedAllChanges = true
                        }
                    "
                    @editing="
                        () => {
                            savedAllChanges = false
                        }
                    "
                ></component>
            </a-tab-pane>
        </a-tabs>
    </div>
    <a-modal
        ref="unsavedChangesModalRef"
        :visible="isRevealed"
        title="Leave Page?"
        ok-text="No"
        cancel-text="Yes"
        @ok="cancel"
        @cancel="confirm"
    >
        <p class="px-4">
            Leaving this page will cause you to
            <span class="font-bold">lose your unsaved changes</span>. Do you
            want to leave this page?
        </p>
    </a-modal>
</template>

<script lang="ts">
    import {
        defineComponent,
        defineAsyncComponent,
        PropType,
        toRefs,
        provide,
        computed,
        ref,
    } from 'vue'
    import {
        onBeforeRouteLeave,
        onBeforeRouteUpdate,
        useRoute,
        useRouter,
    } from 'vue-router'
    import { useConfirmDialog, onClickOutside } from '@vueuse/core'

    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    import AssetHeader from './header/index.vue'
    import NoAccess from '@/common/assets/misc/noAccess.vue'

    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetEvaluate from '~/composables/discovery/useAssetEvaluation'

    export default defineComponent({
        name: 'AssetProfile',
        components: {
            AssetHeader,
            NoAccess,
            Columns: defineAsyncComponent(
                () => import('./tabs/columns/index.vue')
            ),
            Overview: defineAsyncComponent(
                () => import('./tabs/overview/index.vue')
            ),
            Lineage: defineAsyncComponent(
                () => import('./tabs/lineage/index.vue')
            ),
            Queries: defineAsyncComponent(
                () => import('./tabs/queries/index.vue')
            ),
            LinkedAssets: defineAsyncComponent(
                () => import('./tabs/linkedAssets/index.vue')
            ),
            TermsAndCategories: defineAsyncComponent(
                () => import('./tabs/termsAndCategories/index.vue')
            ),
            RelatedAssets: defineAsyncComponent(
                () => import('./tabs/relatedAssets/index.vue')
            ),
        },
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: false,
                default: () => {},
            },
            page: {
                type: String,
                required: false,
                default: 'assets',
            },
        },
        emits: ['preview'],
        setup(props) {
            const { asset, page } = toRefs(props)
            const { getAllowedActions } = useAssetEvaluate()
            const actions = computed(() => getAllowedActions(asset.value))
            const savedAllChanges = ref(true)
            provide('actions', actions)
            provide('selectedAsset', asset)

            const { getProfileTabs, isScrubbed } = useAssetInfo()

            const route = useRoute()
            const router = useRouter()

            const showUnsavedChangesModal = ref(false)

            const activeKey = computed({
                get: () => route?.params?.tab,
                set: (key) =>
                    router.replace(`/${page.value}/${route.params.id}/${key}`),
            })

            const { isRevealed, reveal, confirm, cancel } = useConfirmDialog(
                showUnsavedChangesModal
            )

            // on click outside logic
            const unsavedChangesModalRef = ref(null)
            onClickOutside(unsavedChangesModalRef, () => cancel())

            /**
             * A route guard that checks for unsaved changes, and correspondingly
             * handles re-directions.
             */
            const unsavedChangesGuard = async () => {
                if (!savedAllChanges.value) {
                    const { isCanceled } = await reveal()
                    if (!isCanceled) {
                        savedAllChanges.value = true
                    }
                    return !isCanceled
                }
                return true
            }

            onBeforeRouteLeave(unsavedChangesGuard)
            onBeforeRouteUpdate(unsavedChangesGuard)

            return {
                getProfileTabs,
                activeKey,
                isScrubbed,
                savedAllChanges,
                confirm,
                cancel,
                showUnsavedChangesModal,
                isRevealed,
                unsavedChangesModalRef,
            }
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>

<style lang="less" module>
    .profiletab {
        :global(.ant-tabs-tab:first-child) {
            @apply ml-6;
        }

        :global(.ant-tabs-tab-active) {
            -webkit-text-stroke: 0.65px;
            -moz-text-stroke: 0.65px;
        }

        :global(.ant-tabs-nav) {
            @apply mb-0 !important;
        }

        :global(.ant-tabs-content-holder) {
            @apply bg-primary-light overflow-y-auto !important;
        }
        :global(.ant-tabs-content) {
            @apply min-h-full !important;
        }
    }
</style>
