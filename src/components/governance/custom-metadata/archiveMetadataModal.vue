<template>
    <a-modal
        v-model:visible="visible"
        :title="``"
        centered
        :footer="null"
        :closable="false"
        @cancel="visible = false"
    >
        <div class="p-4">
            <div class="mb-5 font-size-h5">
                Are you sure archive
                <span class="font-weight-bold">{{
                    businessMetadata.displayName
                }}</span>
                business metadata?
            </div>
            <div class="d-flex align-items-center justify-content-between">
                <div
                    v-if="!deleteLoading && deleteError"
                    class="pr-3 text-danger font-size-14"
                    style="text-align: left"
                >
                    {{ getErrorMessage(deleteError) }}
                </div>
                <div
                    class="d-flex align-items-center justify-content-end w-100"
                >
                    <a-button
                        type="secondary"
                        class="mr-2"
                        @click="$emit('close')"
                    >
                        Cancel
                    </a-button>
                    <a-button
                        key="submit"
                        type="danger"
                        :loading="deleteLoading"
                        @click="handleArchive"
                    >
                        Archive
                    </a-button>
                </div>
            </div>
        </div>
    </a-modal>
</template>

<script lang="ts">
    import {
        defineComponent,
        reactive,
        ref,
        toRefs,
        computed,
        onMounted,
        nextTick,
        watch,
    } from 'vue'

    import useBusinessMetadata from '@/governance/custom-metadata/composables/useBusinessMetadata'
    import { getErrorMessage } from '~/utils/error'
    import { Types } from '~/services/meta/types'

    // ? composables

    export default defineComponent({
        props: {
            visible: {
                type: Boolean,
                default: false,
            },
            businessMetadata: {
                type: Object,
                required: true,
            },
        },
        setup(props, context) {
            // Data
            const deleteLoading = ref(false)
            const deleteError = ref(null)

            // props
            const visible = computed(() => props.visible)
            const businessMetadata = computed(() => props.businessMetadata)

            // methods

            const { updateNewBusinessMetadata } = Types

            const handleArchive = () => {
                deleteLoading.value = true
                let businessMetadata = JSON.parse(
                    JSON.stringify(props.businessMetadata)
                )
                businessMetadata = {
                    ...businessMetadata,
                    isArchived: true,
                }
                const payload = {
                    businessMetadataDefs: [businessMetadata],
                    classificationDefs: [],
                    entityDefs: [],
                    enumDefs: [],
                    structDefs: [],
                }
                const apiResponse = ref()
                apiResponse.value = updateNewBusinessMetadata(ref(payload))

                watch(
                    () => apiResponse.value.data,
                    (n, o) => {
                        if (
                            apiResponse.value.data &&
                            apiResponse.value.data.businessMetadataDefs &&
                            apiResponse.value.data.businessMetadataDefs.length
                        ) {
                            context.emit(
                                'updateBusinessMetadataList',
                                apiResponse.value.data.businessMetadataDefs[0]
                            )
                        }
                        context.emit('afterArchive')
                        context.emit('close')
                        deleteLoading.value = false
                    }
                )

                watch(
                    () => apiResponse.value.error,
                    (error) => {
                        // error
                        deleteLoading.value = false
                        console.log(
                            '🚀 ~ file: index.vue ~ line 89 ~ handleArchive ~ error',
                            error
                        )
                        if (error.response) {
                            deleteError.value = error.response
                        }
                    }
                )
            }

            return {
                businessMetadata,
                visible,
                handleArchive,
                getErrorMessage,
                deleteLoading,
                deleteError,
            }
        },
    })
</script>

<style scoped></style>
