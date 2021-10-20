<template>
    <div class="text-xs text-gray-500">
        <p v-if="usingInInfo" class="mb-2 text-sm">
            Description<span v-if="isLoading" class="ml-2">
                <a-spin size="small" class="leading-none"></a-spin>
            </span>
        </p>
        <div v-if="showEditableDescription" class="flex">
            <a-textarea
                id="description-sidebar"
                v-model:value="descriptionInput"
                class="inline-block w-full text-sm cursor-pointer  text-gray focus:bg-gray-100"
                autofocus
                placeholder="Add an asset description"
                show-count
                :maxlength="140"
                :rows="4"
                :disabled="isLoading"
                @blur="handleDescriptionEdit"
                @pressEnter="endEditDescription"
            >
            </a-textarea>
            <span v-if="isLoading && !usingInInfo" class="ml-2">
                <a-spin size="small" class="leading-none"></a-spin>
            </span>
        </div>
        <span
            v-if="
                description &&
                description !== '' &&
                !showEditableDescription &&
                !isLoading
            "
            class="inline-block w-full px-2 py-1 text-sm rounded-sm cursor-pointer  text-gray hover:bg-gray-100"
            style="margin-bottom: -4px; margin-top: -4px; margin-left: -8px"
            @click="handleAddDescriptionClick"
        >
            {{ description }}
        </span>
        <div
            v-if="
                (!description || description === '') &&
                !showEditableDescription &&
                !isLoading
            "
        >
            <span
                v-if="editPermission"
                class="text-xs cursor-pointer text-primary hover:underline"
                @click="handleAddDescriptionClick"
            >
                Add description</span
            >
            <span v-else class="text-xs text-gray-500 cursor-pointer">
                No description</span
            >
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        toRefs,
        ref,
        watch,
        nextTick,
    } from 'vue'
    import updateDescription from '~/composables/asset/updateDescription'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { message } from 'ant-design-vue'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import assetTypeLabel from '@/glossary/constants/assetTypeLabel'

    export default defineComponent({
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            usingInInfo: {
                type: Boolean,
                default: () => true,
            },
            editPermission: {
                type: Boolean,
                required: false,
                default: true,
            },
        },
        emits: ['update:selectedAsset'],
        setup(props, { emit }) {
            const { selectedAsset } = toRefs(props)
            const { update, description, isLoading, error, handleCancel } =
                updateDescription(selectedAsset)

            const showEditableDescription = ref<boolean>(false)
            const isError = ref<boolean>(false)

            const descriptionInput = ref()
            const handleDescriptionEdit = (e: any) => {
                if (
                    description.value === e.target.value ||
                    (description.value === undefined && e.target.value === '')
                ) {
                    showEditableDescription.value = false
                } else {
                    description.value = e.target.value
                    update()
                    watch(error, () => {
                        if (error && error.value) {
                            isError.value = true
                        }
                    })
                    watch(isLoading, () => {
                        if (isLoading.value === false) {
                            showEditableDescription.value = false
                        }
                    })

                    watch(isError, () => {
                        if (isError.value) {
                            handleCancel()
                            message.error(
                                'Unable to update description. Please try again later.'
                            )
                            isError.value = false
                        }
                    })
                }
            }

            const endEditDescription = () => {
                document.getElementById('description-sidebar').blur()
            }

            const handleAddDescriptionClick = () => {
                if (props.editPermission) {
                    showEditableDescription.value = true
                    nextTick(() => {
                        descriptionInput.value = description.value
                        document.getElementById('description-sidebar').focus()
                    })
                }
            }

            watch(description, () => {
                // event sent on update description
                if (
                    selectedAsset.value?.typeName === 'AtlasGlossary' ||
                    selectedAsset.value?.typeName === 'AtlasGlossaryTerm' ||
                    selectedAsset.value?.typeName === 'AtlasGlossaryCategory'
                )
                    useAddEvent('gtc', 'metadata', 'description_updated', {
                        gtc_type: assetTypeLabel[selectedAsset.value?.typeName],
                    })
                else
                    useAddEvent(
                        'discovery',
                        'metadata',
                        'description_updated',
                        undefined
                    )

                emit('update:selectedAsset', selectedAsset.value)
            })

            return {
                description,
                handleDescriptionEdit,
                endEditDescription,
                showEditableDescription,
                handleAddDescriptionClick,
                descriptionInput,
                isLoading,
            }
        },
    })
</script>
