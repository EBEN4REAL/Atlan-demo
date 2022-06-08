<template>
    <GlossaryOverview
        v-if="isGTC(selectedAsset)"
        :selected-asset="selectedAsset"
        :readme-edit-permission="readmeEditPermission"
    >
        <template #readme>
            <AtlanReadme
                v-model="localReadmeContent"
                class="flex flex-col bg-white border border-gray-200 rounded-lg"
                :is-editing-allowed="readmeEditPermission"
                :handle-save="handleSave"
                :handle-success="handleSuccess"
                :handle-failure="handleFailure"
                :asset-type="selectedAsset.typeName"
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
            <AtlanReadme
                v-model="localReadmeContent"
                class="flex flex-col bg-white border border-gray-200 rounded-lg"
                :is-editing-allowed="readmeEditPermission"
                :handle-save="handleSave"
                :handle-success="handleSuccess"
                :handle-failure="handleFailure"
                :asset-type="selectedAsset.typeName"
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
            <AtlanReadme
                v-model="localReadmeContent"
                class="flex flex-col bg-white border border-gray-200 rounded-lg"
                :is-editing-allowed="readmeEditPermission"
                :asset-type="selectedAsset.typeName"
                :handle-save="handleSave"
                :handle-success="handleSuccess"
                :handle-failure="handleFailure"
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
    <ObjectOverview
        v-else-if="isObjectAsset(selectedAsset)"
        :selected-asset="selectedAsset"
        :readme-edit-permission="readmeEditPermission"
    >
        <template #readme>
            <AtlanReadme
                v-model="localReadmeContent"
                class="flex flex-col bg-white border border-gray-200 rounded-lg"
                :is-editing-allowed="readmeEditPermission"
                :asset-type="selectedAsset.typeName"
                :handle-save="handleSave"
                :handle-success="handleSuccess"
                :handle-failure="handleFailure"
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
    </ObjectOverview>
    <SQLOverview
        v-else-if="isSQLAsset(selectedAsset)"
        :selected-asset="selectedAsset"
        :readme-edit-permission="readmeEditPermission"
    >
        <template #readme>
            <AtlanReadme
                v-model="localReadmeContent"
                class="flex flex-col bg-white border border-gray-200 rounded-lg"
                :is-editing-allowed="readmeEditPermission"
                :asset-type="selectedAsset.typeName"
                :handle-save="handleSave"
                :handle-success="handleSuccess"
                :handle-failure="handleFailure"
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
            <AtlanReadme
                v-model="localReadmeContent"
                class="flex flex-col bg-white border border-gray-200 rounded-lg"
                :is-editing-allowed="readmeEditPermission"
                :asset-type="selectedAsset.typeName"
                :handle-save="handleSave"
                :handle-success="handleSuccess"
                :handle-failure="handleFailure"
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
        ok-text="Leave"
        cancel-text="Stay"
        @ok="cancel"
        @cancel="confirm"
    >
        <template #title>
            <p class="font-bold">Leave page?</p>
        </template>
        <p class="px-4">
            There are some unsaved changes in Readme, which will be lost if you
            don't save them.
        </p>
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
        inject,
    } from 'vue'

    import { useConfirmDialog, onClickOutside, until } from '@vueuse/core'
    import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
    import { assetInterface } from '~/types/assets/asset.interface'
    import SQLOverview from './sql/index.vue'
    import BiOverview from './bi/index.vue'
    import GlossaryOverview from './glossary/index.vue'
    import SaasOverview from './saas/index.vue'
    import ObjectOverview from './object/index.vue'
    import GeneralOverview from './general/index.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import updateAssetAttributes from '~/composables/discovery/updateAssetAttributes'

    export default defineComponent({
        name: 'OverviewTab',
        components: {
            SQLOverview,
            BiOverview,
            GlossaryOverview,
            GeneralOverview,
            SaasOverview,
            ObjectOverview,
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
                isObjectAsset,
                selectedAssetUpdatePermission,
                assetPermission,
            } = useAssetInfo()

            const { selectedAsset } = toRefs(props)

            const readmeAsset = inject('readmeAsset', {})

            const { localReadmeContent, handleUpdateReadme, isLoading } =
                updateAssetAttributes(readmeAsset)

            const handleSave = (editorContent: string) => {
                handleUpdateReadme()
                return until(isLoading).toBe(false)
            }

            const handleSuccess = () => {}

            const handleFailure = (error) => {}

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
                isObjectAsset,
                readmeEditPermission,
                cancel,
                confirm,
                isRevealed,
                savedAllChanges,
                localReadmeContent,
                handleSave,
                handleSuccess,
                handleFailure,
            }
        },
    })
</script>
