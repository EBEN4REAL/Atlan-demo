<template>
    <div @click="showModal">
        <slot name="trigger" @click="showModal" />
    </div>

    <a-modal
        v-model:visible="visible"
        :class="$style.input"
        width="25%"
        :closable="false"
        okText="Save"
        cancelText=""
        :footer="null"
    >
        <div class="p-3">
            <p class="mb-1 font-bold text-md">Delete {{ typeNameTitle }}</p>
            <p class="text-md">
                Are you sure you want to delete the {{ typeNameTitle }} and all
                its contents?
            </p>
        </div>

        <div class="flex justify-end p-3 border-t border-gray-200">
            <a-button type="danger" @click="handleDelete" :loading="isLoading"
                >Delete</a-button
            >
        </div>
    </a-modal>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        computed,
        onMounted,
        nextTick,
        watch,
        Ref,
        inject,
        PropType,
        toRefs,
        reactive,
    } from 'vue'

    import { useVModels, whenever } from '@vueuse/core'
    import updateAsset from '~/composables/discovery/updateAsset'
    import { generateUUID } from '~/utils/helper/generator'
    import useDeleteGlossary from '~/composables/glossary/useDeleteGlossary.ts'
    import useGlossaryStore from '~/store/glossary'
    import { message } from 'ant-design-vue'

    export default defineComponent({
        name: 'AddGtcModal',
        components: {
            // AddGtcModalOwners,
            // Categories,
        },
        props: {
            entity: {
                type: Object,
                required: true,
                default: () => {},
            },

            entityType: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
            guid: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
        },
        emits: ['delete', 'update:visible'],
        setup(props, { emit }) {
            const { entityType, guid, entity } = toRefs(props)
            const visible = ref(false)
            const isLoading = ref(false)
            const glossaryStore = useGlossaryStore()
            const selectedGlossaryQf = computed(
                () => glossaryStore.activeGlossaryQualifiedName
            )
            // const entityToDelete = reactive({
            //     attributes: {
            //         userDescription: '',
            //         name: '',
            //         qualifiedName: '',
            //     },
            //     typeName: entityType.value,
            // })
            const { deleteGlossary, deleteCategory, deleteTerm } =
                useDeleteGlossary()
            const serviceMap = {
                AtlasGlossaryTerm: deleteTerm,
                AtlasGlossaryCategory: deleteCategory,
                AtlasGlossary: deleteGlossary,
            }
            const showModal = async () => {
                visible.value = true
            }
            // const body = ref({
            //     entities: [],
            // })
            // const {
            //     mutate: mutateAsset,
            //     isLoading,
            //     isReady,
            //     guidUpdatedMaps,
            //     error,
            // } = updateAsset(body)
            const typeNameTitle = computed(() => {
                switch (entityType.value) {
                    case 'AtlasGlossary':
                        return 'Glossary'
                    case 'AtlasGlossaryCategory':
                        return 'Category'
                    case 'AtlasGlossaryTerm':
                        return 'Term'
                    default:
                        return 'Glossary'
                }
            })
            // const handleSave = () => {
            //     if (typeNameTitle.value === 'Glossary') {
            //         entityToDelete.attributes.qualifiedName = generateUUID()
            //     }
            //     entityToDelete.attributes.name = entity.value.attributes.name
            //     entityToDelete.attributes.name = entity.value.attributes.name
            //     entityToDelete.attributes.anchor =
            //         entity.value.attributes.anchor
            //     body.value = {
            //         entities: [entityToDelete],
            //     }
            //     console.log(entityToDelete)

            //     mutateAsset()
            // }
            const handleDelete = () => {
                const {
                    data,
                    isLoading: loading,
                    deleteError,
                } = serviceMap[props.entity?.typeName](
                    props.entity?.guid,
                    false
                )
                isLoading.value = loading.value
                if (data && !deleteError.value) {
                    if (props.entity?.typeName === 'AtlasGlossaryCategory') {
                        message.success(`${props.entity?.displayText} deleted`)
                        if (!selectedGlossaryQf?.value?.length) {
                            emit(
                                'delete',
                                props.entity?.attributes?.parentCategory
                                    ?.guid ??
                                    props?.entity?.attributes?.anchor?.guid ??
                                    'root'
                            )
                        } else {
                            emit(
                                'delete',
                                props.entity?.attributes?.parentCategory
                                    ?.guid ?? 'root'
                            )
                        }
                    } else if (props.entity?.typeName === 'AtlasGlossaryTerm') {
                        message.success(`${props.entity?.displayText} deleted`)
                        if (props.entity?.attributes?.categories?.length) {
                            props.entity?.attributes?.categories?.forEach(
                                (category) => {
                                    emit('delete', category.guid)
                                }
                            )
                        }
                        if (!selectedGlossaryQf?.value?.length) {
                            emit(
                                'delete',
                                props?.entity?.attributes?.anchor?.guid ??
                                    'root'
                            )
                        } else emit('delete', 'root')
                    } else {
                        emit('delete', 'root')
                    }
                }
                isLoading.value = loading.value
                visible.value = false
            }
            return {
                visible,
                showModal,
                typeNameTitle,
                isLoading,
                handleDelete,
            }
        },
    })
</script>

<style lang="less" module>
    .input {
        :global(.ant-input:focus, .ant-input:hover, .ant-input::selection, .focus-visible) {
            @apply shadow-none outline-none border-0 border-transparent border-r-0 !important;
        }
        :global(.ant-input):focus,
        :global(.ant-input):hover {
            @apply shadow-none outline-none border-0 border-transparent border-r-0 !important;
        }
        :global(.ant-input) {
            @apply shadow-none outline-none px-0 border-0 !important;
        }
        :global(.ant-modal-content) {
            @apply rounded-md  !important;
        }
    }
    .titleInput {
        :global(.ant-input::-webkit-input-placeholder) {
            @apply font-bold text-gray-500 !important;
        }
    }
</style>
