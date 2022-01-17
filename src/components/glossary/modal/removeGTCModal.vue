<template>
    <div @click="showModal">
        <slot name="trigger" @click="showModal" />
    </div>

    <a-modal
        v-model:visible="visible"
        :class="$style.input"
        width="30%"
        :closable="false"
        okText="Save"
        cancelText=""
        :footer="null"
    >
        <div class="p-3">
            <p class="mb-1 font-bold text-md">
                Archive {{ entity?.displayText }}
            </p>
            <p v-if="entity?.typeName === 'AtlasGlossary'" class="text-md">
                Are you sure you want to archive
                {{ entity?.displayText }} and all its contents?
            </p>
            <p
                v-else-if="entity?.typeName === 'AtlasGlossaryCategory'"
                class="text-md"
            >
                Are you sure you want to archive
                {{ entity?.displayText }} ? Sub-categories and terms will be
                moved to
                {{
                    entity?.attributes?.anchor?.attributes?.name ??
                    'Parent Glossary'
                }}.
            </p>

            <p v-else class="text-md">
                Are you sure you want to archive
                {{ entity?.displayText }} ?
            </p>
        </div>

        <div class="flex justify-end p-3 space-x-2 border-t border-gray-200">
            <a-button @click="handleCancel">Cancel</a-button>
            <a-button
                class="text-white bg-error"
                :loading="isLoading"
                @click="handleDelete"
                >Archive</a-button
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
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import assetTypeLabel from '~/components/glossary/constants/assetTypeLabel.ts'

    export default defineComponent({
        name: 'RemoveGtcModal',
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
            redirect: {
                type: Boolean,
                required: false,
                default() {
                    return false
                },
            },
        },
        emits: ['delete', 'update:visible'],
        setup(props, { emit }) {
            const { entityType, guid, entity } = toRefs(props)
            const visible = ref(false)
            const isLoading = ref(false)
            const glossaryStore = useGlossaryStore()
            const handleSelectGlossary = inject('handleSelectGlossary')
            const selectedGlossaryQf = computed(
                () => glossaryStore.activeGlossaryQualifiedName
            )
            const { deleteGTC } = useDeleteGlossary()
            const showModal = async () => {
                visible.value = true
            }
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

            const handleCancel = () => {
                visible.value = false
            }
            const handleDelete = () => {
                const {
                    data,
                    isLoading: loading,
                    deleteError,
                } = deleteGTC(props.entity?.guid, props.redirect ?? false)
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
                // delete entity event
                const eventCategory = assetTypeLabel[props.entity?.typeName]
                useAddEvent('gtc', eventCategory, 'deleted', {})
            }
            return {
                visible,
                showModal,
                typeNameTitle,
                isLoading,
                handleDelete,
                handleCancel,
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
