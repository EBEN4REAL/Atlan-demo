<template>
    <AtlanReadme
        v-model="localReadmeContent"
        class="flex flex-col bg-white border border-gray-200 rounded-lg"
        :is-editing-allowed="readmeEditPermission"
        :asset-type="readmeAsset.typeName"
        :handle-save="handleSave"
    />
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs, PropType, computed } from 'vue'
    import { until } from '@vueuse/core'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import updateAssetAttributes from '~/composables/discovery/updateAssetAttributes'

    export default defineComponent({
        components: {},
        props: {
            readmeAsset: {
                type: Object as PropType<assetInterface>,
                required: false,
                default() {
                    return {}
                },
            },
        },

        setup(props) {
            const { readmeAsset } = toRefs(props)

            const { title, assetPermission, selectedAssetUpdatePermission } =
                useAssetInfo()

            const { localReadmeContent, handleUpdateReadme, isLoading } =
                updateAssetAttributes(readmeAsset)

            const handleSave = (editorContent: string) => {
                handleUpdateReadme()
                return until(isLoading).toBe(false)
            }

            const readmeEditPermission = computed(
                () =>
                    selectedAssetUpdatePermission(
                        readmeAsset.value,
                        false,
                        'RELATIONSHIP_ADD',
                        'Readme'
                    ) && assetPermission('CREATE_README')
            )

            const readmeVisible = ref<boolean>(false)

            return {
                title,

                readmeVisible,
                localReadmeContent,
                handleSave,
                readmeEditPermission,
            }
        },
    })
</script>
