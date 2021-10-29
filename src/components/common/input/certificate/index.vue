<template>
    <div class="text-xs text-gray-500">
        <div class="flex items-center justify-between mb-1 text-sm">
            <span> Certificate</span>
            <span class="text-primary">edit</span>
        </div>

        <div class="badge">
            <div class="flex items-center justify-between mb-1">
                <div class="flex items-center mb-0">
                    <component
                        :is="icon"
                        :key="selectedAsset.guid"
                        class="inline-flex self-center w-auto h-4 mr-1 mb-0.5"
                    />
                    <span class="text-sm tracking-wide text-gray-700">{{
                        capitalizeFirstLetter(status?.toLowerCase())
                    }}</span>
                </div>
                <div class="flex items-center text-gray-500">
                    <div class="flex text-sm gap-x-1">
                        <AtlanIcon icon="User"></AtlanIcon>
                        <div class="mr-1">{{ username }},</div>
                        {{ timestamp }}
                    </div>
                </div>
            </div>
        </div>
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
                description &&
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
        computed,
        ref,
        watch,
        nextTick,
    } from 'vue'
    // import { message } from 'ant-design-vue'
    // import updateAsset from '~/composables/discovery/updateAsset'
    import { assetInterface } from '~/types/assets/asset.interface'
    // import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { certificateList } from '~/constant/certification'
    // import assetTypeLabel from '@/glossary/constants/assetTypeLabel'

    import { capitalizeFirstLetter } from '~/utils/string'
    import AtlanIcon from '../../icon/atlanIcon.vue'

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

            const {
                certificateUpdatedBy,
                certificateUpdatedAt,
                certificateStatus,
            } = useAssetInfo()

            const status = computed(
                () => certificateStatus(selectedAsset.value) || ''
            )

            const username = computed(() =>
                certificateUpdatedBy(selectedAsset.value)
            )

            const timestamp = computed(() =>
                certificateUpdatedAt(selectedAsset.value)
            )

            const icon = computed(() => {
                const found = certificateList.find(
                    (item) =>
                        item.id.toLowerCase() === status?.value?.toLowerCase()
                )
                if (found) {
                    return found.icon
                }

                return ''
            })

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

            // const endEditDescription = () => {
            //     document.getElementById('description-sidebar').blur()
            // }

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
                certificateStatus,
                selectedAsset,
                status,
                capitalizeFirstLetter,
                username,
                timestamp,
                icon,
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

<style lang="less">
    .badge {
        &.verified {
            background-color: #eeffef !important;
            color: rgb(4, 165, 128) !important;
        }
        &.draft {
            background-color: #ffeec6 !important;
            color: rgb(243, 180, 68) !important;
        }
        &.deprecated {
            background-color: #ffd2b8 !important;
            color: rgb(254, 148, 88) !important;
        }
    }
</style>
