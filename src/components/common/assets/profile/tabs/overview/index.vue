<template>
    <GlossaryOverview
        v-if="isGTC(selectedAsset)"
        :selected-asset="selectedAsset"
        :readme-edit-permission="readmeEditPermission"
    >
        <template #readme>
            <Readme
                :asset="selectedAsset"
                :is-edit="readmeEditPermission"
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
            />
        </template>
    </GlossaryOverview>
    <BiOverview
        v-else-if="isBiAsset(selectedAsset)"
        :selected-asset="selectedAsset"
        :readme-edit-permission="readmeEditPermission"
    >
        <template #readme>
            <Readme
                :asset="selectedAsset"
                :is-edit="readmeEditPermission"
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
            />
        </template>
    </BiOverview>
    <SaasOverview
        v-else-if="isSaasAsset(selectedAsset)"
        :selected-asset="selectedAsset"
        :readme-edit-permission="readmeEditPermission"
    >
        <template #readme>
            <Readme
                :asset="selectedAsset"
                :is-edit="readmeEditPermission"
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
            />
        </template>
    </SaasOverview>
    <SQLOverview
        v-else-if="isSQLAsset(selectedAsset)"
        :selected-asset="selectedAsset"
        :readme-edit-permission="readmeEditPermission"
    >
        <template #readme>
            <Readme
                :asset="selectedAsset"
                :is-edit="readmeEditPermission"
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
            />
        </template>
    </SQLOverview>
    <GeneralOverview
        v-else
        :selected-asset="selectedAsset"
        :readme-edit-permission="readmeEditPermission"
    >
        <template #readme>
            <Readme
                :asset="selectedAsset"
                :is-edit="readmeEditPermission"
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
            />
        </template>
    </GeneralOverview>
    <a-modal
        ref="unsavedChangesModalRef"
        :visible="isRevealed"
        title="Leave site?"
        ok-text="Leave"
        cancel-text="Stay"
        @ok="cancel"
        @cancel="confirm"
    >
        <p class="px-4">Changes that you made may not be saved.</p>
    </a-modal>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        computed,
        toRefs,
        ref,
        watch,
    } from 'vue'

    import Readme from '@common/widgets/readme/index.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import SQLOverview from './sql/index.vue'
    import BiOverview from './bi/index.vue'
    import GlossaryOverview from './glossary/index.vue'
    import SaasOverview from './saas/index.vue'
    import GeneralOverview from './general/index.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { useConfirmDialog, onClickOutside } from '@vueuse/core'
    import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

    export default defineComponent({
        name: 'OverviewTab',
        components: {
            SQLOverview,
            BiOverview,
            GlossaryOverview,
            GeneralOverview,
            SaasOverview,
            Readme,
        },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        emits: ['editing', 'savedChanges'],
        setup(props) {
            const {
                isBiAsset,
                isGTC,
                isSQLAsset,
                isSaasAsset,
                selectedAssetUpdatePermission,
                assetPermission,
            } = useAssetInfo()

            const { selectedAsset } = toRefs(props)

            const readmeEditPermission = computed(
                () =>
                    selectedAssetUpdatePermission(
                        selectedAsset.value,
                        false,
                        'RELATIONSHIP_ADD',
                        'Readme'
                    ) && assetPermission('CREATE_README')
            )
            const savedAllChanges = ref(true)
            const showUnsavedChangesModal = ref(false)

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
                    if (isCanceled) {
                        savedAllChanges.value = true
                        return true
                    }
                    return false
                }
                return true
            }

            const beforeUnloadListener = (event) => {
                event.preventDefault()
                return (event.returnValue = '')
            }

            watch(savedAllChanges, () => {
                if (savedAllChanges.value) {
                    window.removeEventListener(
                        'beforeunload',
                        beforeUnloadListener,
                        {
                            capture: true,
                        }
                    )
                } else {
                    window.addEventListener(
                        'beforeunload',
                        beforeUnloadListener,
                        {
                            capture: true,
                        }
                    )
                }
            })

            onBeforeRouteLeave(unsavedChangesGuard)
            onBeforeRouteUpdate(unsavedChangesGuard)
            return {
                isBiAsset,
                isGTC,
                isSQLAsset,
                isSaasAsset,
                readmeEditPermission,
                cancel,
                confirm,
                isRevealed,
                savedAllChanges,
            }
        },
    })
</script>
