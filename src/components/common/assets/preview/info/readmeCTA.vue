<template>
    <div class="px-5">
        <a-button
            block
            class="flex items-center justify-between px-2 shadow-none"
            @click="showReadmeModal"
            ><div class="flex items-center">Readme of {{ title(asset) }}</div>
            <AtlanIcon icon="External" />
        </a-button>
    </div>

    <a-modal
        v-model:visible="readmeVisible"
        :footer="null"
        :closable="false"
        :destroy-on-close="true"
        width="1000px"
    >
        <div
            v-if="isReadmeLoading"
            class="flex items-center justify-center w-full"
            style="height: 155px"
        >
            <AtlanLoader class="h-9" />
        </div>
        <AtlanReadme
            v-else
            v-model="localReadmeContent"
            class="flex flex-col bg-white border border-gray-200 rounded-lg"
            :is-editing-allowed="readmeEditPermission"
            :asset-type="asset.typeName"
            :handle-save="handleSave"
        />
    </a-modal>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs, PropType, computed } from 'vue'
    import { until } from '@vueuse/core'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import updateAssetAttributes from '~/composables/discovery/updateAssetAttributes'
    import { useAssetAttributes } from '~/composables/discovery/useCurrentUpdate'

    export default defineComponent({
        components: {},
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: false,
                default() {
                    return {}
                },
            },
        },

        setup(props) {
            const { asset } = toRefs(props)

            const { title, assetPermission, selectedAssetUpdatePermission } =
                useAssetInfo()

            const readmeAttribute = ref(['readme'])

            const {
                asset: readmeAsset,
                mutate: mutateReadme,
                isReady: isReadmeReady,
                isLoading: isReadmeLoading,
            } = useAssetAttributes({
                id: asset.value?.guid,
                attributes: readmeAttribute,
            })

            const { localReadmeContent, handleUpdateReadme, isLoading } =
                updateAssetAttributes(readmeAsset)

            const handleSave = (editorContent: string) => {
                handleUpdateReadme()
                return until(isLoading).toBe(false)
            }

            const readmeEditPermission = computed(
                () =>
                    selectedAssetUpdatePermission(
                        asset.value,
                        false,
                        'RELATIONSHIP_ADD',
                        'Readme'
                    ) && assetPermission('CREATE_README')
            )

            const readmeVisible = ref<boolean>(false)

            const showReadmeModal = () => {
                mutateReadme()
                readmeVisible.value = true
            }

            return {
                title,
                showReadmeModal,
                readmeVisible,
                localReadmeContent,
                handleSave,
                readmeEditPermission,
                isReadmeLoading,
            }
        },
    })
</script>
