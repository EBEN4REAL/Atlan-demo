<template>
    <div
        class="flex flex-col p-4 bg-white rounded"
        :class="isEditMode ? 'editor-open' : 'editor-close'"
    >
        <div class="flex items-center justify-between mb-3">
            <div class="flex items-center">
                <AtlanIcon icon="Readme" class="w-auto h-8 mr-3" /><span
                    class="text-base font-bold text-gray"
                    >Readme</span
                >
            </div>

            <a-button
                v-if="!localReadmeContent && isEdit && !isEditMode"
                class="flex items-center"
                type="primary"
                @click="handleEditMode"
            >
                <AtlanIcon icon="Edit" class="w-auto h-4 mr-1" />Add a
                readme</a-button
            >

            <div v-if="isEdit && isEditMode" class="flex gap-x-1">
                <a-button
                    v-if="!isLoading"
                    class="flex items-center"
                    @click="handleCancel"
                >
                    Cancel</a-button
                >

                <a-button
                    class="flex items-center"
                    type="primary"
                    :loading="isLoading"
                    @click="handleUpdate"
                >
                    Save</a-button
                >
            </div>

            <a-button
                v-if="isEdit && localReadmeContent && !isEditMode"
                class="flex items-center"
                type="primary"
                @click="handleEditMode"
            >
                <AtlanIcon icon="Edit" class="w-auto h-4 mr-1" />Edit</a-button
            >
        </div>

        <div
            v-if="!localReadmeContent && !isEditMode"
            class="text-sm text-gray-500"
        >
            Add a README with an overview of your asset.
        </div>
        <div v-if="isEditMode || readmeGuid(asset)" class="border-0">
            <Editor
                ref="editor"
                v-model="localReadmeContent"
                placeholder="Type '/' for commands"
                :is-edit-mode="isEditMode"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, PropType, toRefs } from 'vue'

    import Editor from '@/common/editor/index.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import updateAssetAttributes from '~/composables/discovery/updateAssetAttributes'

    export default defineComponent({
        components: {
            Editor,
        },
        props: {
            isEdit: {
                type: Boolean,
                required: false,
                default: true,
            },
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const { asset } = toRefs(props)

            const { readmeContent, readmeGuid } = useAssetInfo()

            const { handleUpdateReadme, localReadmeContent, isLoading } =
                updateAssetAttributes(asset)

            const isEditMode = ref(false)

            const handleEditMode = () => {
                isEditMode.value = !isEditMode.value
            }

            const editor = ref()

            const handleUpdate = () => {
                handleUpdateReadme()
                isEditMode.value = false
            }

            const handleCancel = () => {
                if (editor.value) {
                    editor.value.resetEditor(readmeContent(asset.value))
                }
                localReadmeContent.value = readmeContent(asset.value)
                isEditMode.value = false
            }

            return {
                isLoading,
                handleUpdate,
                isEditMode,
                handleEditMode,
                handleCancel,
                editor,
                localReadmeContent,
                readmeGuid,
            }
        },
    })
</script>

<style lang="less" scoped>
    .editor-open {
        min-height: 200px;
        transition: min-height 0.3s ease-in-out;
    }
    .editor-close {
        min-height: 0;
        transition: min-height 0.3s ease-in-out;
    }
</style>

<route lang="yaml">
meta:
    layout: project
    requiresAuth: true
</route>
