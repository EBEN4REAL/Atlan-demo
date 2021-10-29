<template>
    <div class="text-xs text-gray-500">
        <div class="flex items-center justify-between mb-1 text-sm">
            <span> Description</span>
            <span class="text-primary">edit</span>
        </div>
        <p class="text-sm text-gray-700">{{ description(selectedAsset) }}</p>
        <!-- <div class="flex">
            <a-textarea
                id="description-sidebar"
                v-model:value="descriptionInput"
                class="inline-block w-full text-sm cursor-pointer text-gray focus:bg-gray-100"
                autofocus
                placeholder="Add an asset description"
                show-count
                :maxlength="140"
                :rows="4"
            >
            </a-textarea>
            <span v-if="isLoading && !usingInInfo" class="ml-2">
                <a-spin size="small" class="leading-none"></a-spin>
            </span> -->
        <!--     </div> -->
        <!-- <span
            v-if="
                description !== '' &&
                !showEditableDescription &&
                !isLoading
            "
            class="inline-block w-full px-2 py-1 text-sm rounded-sm cursor-pointer text-gray hover:bg-gray-100"
            style="margin-bottom: -4px; margin-top: -4px; margin-left: -8px"
            @click="handleAddDescriptionClick"
        >
            {{ description }}
        </span> -->
        <!-- <div
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
        </div> -->
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
    // import { message } from 'ant-design-vue'
    // import updateAsset from '~/composables/discovery/updateAsset'
    import { assetInterface } from '~/types/assets/asset.interface'
    // import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    // import assetTypeLabel from '@/glossary/constants/assetTypeLabel'

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

            const { description } = useAssetInfo()

            // const descriptionLocal = ref(description(selectedAsset.value))

            // const { data, mutate, error, isLoading } = updateAsset({})

            // // const showEditableDescription = ref<boolean>(false)
            // // const isError = ref<boolean>(false)

            // const descriptionInput = ref()
            // const handleDescriptionEdit = (e: any) => {
            //     if (
            //         descriptionLocal.value === e.target.value ||
            //         descriptionLocal.value === undefined
            //     ) {
            //         showEditableDescription.value = false
            //     } else {
            //         descriptionLocal.value = e.target.value
            //         mutate()
            //         // watch(error, () => {
            //         //     if (error && error.value) {
            //         //         isError.value = true
            //         //     }
            //         // })
            //         // watch(isLoading, () => {
            //         //     if (isLoading.value === false) {
            //         //         showEditableDescription.value = false
            //         //     }
            //         // })

            //         // watch(isError, () => {
            //         //     if (isError.value) {
            //         //         handleCancel()
            //         //         message.error(
            //         //             'Unable to update description. Please try again later.'
            //         //         )
            //         //         isError.value = false
            //         //     }
            //         // })
            //     }
            // }

            const endEditDescription = () => {
                document.getElementById('description-sidebar').blur()
            }

            // const handleAddDescriptionClick = () => {
            //     if (props.editPermission) {
            //         showEditableDescription.value = true
            //         nextTick(() => {
            //             descriptionInput.value = description.value
            //             document.getElementById('description-sidebar').focus()
            //         })
            //     }
            // }

            // watch(description, () => {
            //     // event sent on update description
            //     if (
            //         selectedAsset.value?.typeName === 'AtlasGlossary' ||
            //         selectedAsset.value?.typeName === 'AtlasGlossaryTerm' ||
            //         selectedAsset.value?.typeName === 'AtlasGlossaryCategory'
            //     )
            //         useAddEvent('gtc', 'metadata', 'description_updated', {
            //             gtc_type: assetTypeLabel[selectedAsset.value?.typeName],
            //         })
            //     else
            //         useAddEvent(
            //             'discovery',
            //             'metadata',
            //             'description_updated',
            //             undefined
            //         )

            //     emit('update:selectedAsset', selectedAsset.value)
            // })

            return {
                description,
                selectedAsset,
                // description,
                // handleDescriptionEdit,
                // endEditDescription,
                // // showEditableDescription,
                // handleAddDescriptionClick,
                // descriptionInput,
                // isLoading,
            }
        },
    })
</script>
