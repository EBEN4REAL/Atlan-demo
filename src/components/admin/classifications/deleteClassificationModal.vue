<template>
    <a-modal
        :visible="showDeleteModal"
        :destroyOnClose="true"
        title="Delete"
        :onCancel="closeDeleteModal"
        :footer="null"
    >
        <div class="p-0 block-content">
            <p class="mb-0" v-show="selectedClassificationName">
                This will permanently delete the
                <span class="underline">{{ selectedClassificationName }}</span>
                classification and it
                <span class="font-w700">cannot</span> be undone.
            </p>
            <div class="flex justify-end">
                <a-button
                    type="danger"
                    @click="onDelete"
                    ghost
                    class="mt-3"
                    :loading="deleteStatus === 'loading'"
                    :loadingText="`Deleting this classification...`"
                >
                    <fa icon="fal trash" class="mr-2 text-left" />
                    I understand the consequences</a-button
                >
            </div>

            <p v-if="deleteErrorText" class="mt-4 mb-0 text-sm text-red-500">
                {{ deleteErrorText }}
            </p>
        </div>
    </a-modal>
</template>

<script lang="ts">
    import { defineComponent, computed, ref, toRaw, watch, Ref } from 'vue'
    import { useClassificationStore } from './_store'
    import { Classification } from '~/api/atlas/classification'
    import { useRouter } from 'vue-router'

    export default defineComponent({
        name: 'DeleteClassificationModal',
        props: {
            open: {
                type: Boolean,
            },
            classification: {
                type: Object,
            },
        },

        setup(props, context) {
            const router = useRouter()

            const store = useClassificationStore()
            const showDeleteModal = computed(() => props.open)

            const selectedClassification: any = computed(
                () => props.classification
            )
            const selectedClassificationName = computed(
                () => props.classification.name
            )
            const deleteStatus = ref('')
            const deleteErrorText = ref('')

            const resetRef = (ref: Ref<any>, time: number) => {
                setTimeout(() => {
                    ref.value = ''
                }, time)
            }

            const closeDeleteModal = () => {
                context.emit('close')
            }
            const onDelete = () => {
                const typeName: string | any = selectedClassification.value.name
                const { data, error } = Classification.archiveClassification({
                    cache: undefined,
                    typeName,
                })
                deleteStatus.value = 'loading'
                watch([data, error], () => {
                    if (!error.value) {
                        deleteStatus.value = 'success'
                        store.deleteClassificationByName(typeName)
                        const isAnyClassificationExist: string = store
                            .classificationTree[0]?.name
                            ? store.classificationTree[0]?.name
                            : ''
                        context.emit('close')
                        if (isAnyClassificationExist) {
                            store.setSelectedClassification(
                                isAnyClassificationExist
                            )
                        }

                        router.push(
                            `/admin/classifications/${encodeURIComponent(
                                isAnyClassificationExist
                            )}`
                        )
                    } else {
                        deleteStatus.value = 'error'
                        const reqError = toRaw(error.value)
                        deleteErrorText.value =
                            reqError?.response?.data?.errorMessage ??
                            'Failed to delete classification!'
                        resetRef(deleteErrorText, 6000)
                        // Notify.error("Unable to delete this classification");
                        console.log(
                            'WTF: handleDeleteClassification -> error',

                            reqError?.response?.data
                        )
                    }
                })
            }

            return {
                selectedClassificationName,
                deleteErrorText,
                showDeleteModal,
                onDelete,
                deleteStatus,
                closeDeleteModal,
                selectedClassification,
            }
        },
    })
</script>
<style lang="less" scoped></style>
