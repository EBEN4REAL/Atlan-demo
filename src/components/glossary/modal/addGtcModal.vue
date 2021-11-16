<template>
    <div @click="showModal">
        <slot name="trigger" @click="showModal" />
    </div>

    <a-modal
        v-model:visible="visible"
        :class="$style.input"
        width="50%"
        :destroyOnClose="true"
        :closable="true"
        okText="Save"
        cancelText=""
        :footer="null"
    >
        <div class="p-3">
            <div class="flex items-center mb-1">
                <GlossaryPopoverSelect
                    class="p-1 bg-gray-100 rounded"
                    v-model="localQualfiendName"
                    v-if="
                        typeNameTitle === 'Term' || typeNameTitle === 'Category'
                    "
                ></GlossaryPopoverSelect>
            </div>

            <a-input
                ref="titleBar"
                v-model:value="entity.attributes.name"
                :placeholder="`Untitled ${typeNameTitle}`"
                class="text-lg font-bold text-gray-700 border-0 shadow-none outline-none "
                :class="$style.titleInput"
            />
            <a-textarea
                v-model:value="entity.attributes.description"
                placeholder="Add description..."
                class="text-gray-500 border-0 shadow-none outline-none"
                :maxlength="140"
                :rows="2"
            />
        </div>

        <div class="flex justify-between p-3 border-t border-gray-200">
            <a-button type="primary" @click="handleSave" :loading="isLoading"
                >Save</a-button
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

    import StatusBadge from '@common/badge/status/index.vue'
    // import AddGtcModalOwners from './addGtcModalOwners.vue'
    // import Categories from '@/glossary/common/categories.vue'

    import useCreateGlossary from '~/composables/glossary/useCreateGlossary'
    import whoami from '~/composables/user/whoami'
    import useUpdateGtcEntity from '~/composables/glossary/useUpdateGtcEntity'

    import { List } from '~/constant/status'
    import {
        Glossary,
        Category,
        Term,
    } from '~/types/glossary/glossary.interface'
    import { useVModels, whenever } from '@vueuse/core'
    import updateAsset from '~/composables/discovery/updateAsset'
    import { generateUUID } from '~/utils/helper/generator'
    import { message } from 'ant-design-vue'

    import { mutate } from 'swrv'
    import useGlossaryData from '~/composables/glossary2/useGlossaryData'
    import useGlossary from '~/composables/glossary2/useGlossary'
    import { useCurrentUpdate } from '~/composables/discovery/useCurrentUpdate'

    import GlossaryPopoverSelect from '@/common/popover/glossarySelect/index.vue'

    export default defineComponent({
        name: 'AddGtcModal',
        components: {
            GlossaryPopoverSelect,
            // AddGtcModalOwners,
            // Categories,
        },
        props: {
            entityType: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
            glossaryQualifiedName: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
        },
        emits: ['add', 'update:visible'],
        setup(props, { emit }) {
            const { entityType, glossaryQualifiedName } = toRefs(props)
            const { getGlossaryByQF, getFirstGlossaryQF } = useGlossaryData()

            const localQualfiendName = ref(
                glossaryQualifiedName.value || getFirstGlossaryQF()
            )

            const visible = ref(false)

            const entity = reactive({
                attributes: {
                    userDescription: '',
                    name: '',
                    qualifiedName: '',
                },
                typeName: entityType.value,
            })

            if (
                ['AtlasGlossaryTerm', 'AtlasGlossaryCategory'].includes(
                    entityType.value
                )
            ) {
                entity.relationshipAttributes = {
                    anchor: {
                        typeName: 'AtlasGlossary',
                        guid: getGlossaryByQF(localQualfiendName.value)?.guid,
                    },
                }
            }

            const titleBar: Ref<null | HTMLInputElement> = ref(null)

            const showModal = async () => {
                resetInput()
                visible.value = true
                await nextTick()
                titleBar.value?.focus()
            }

            const body = ref({
                entities: [],
            })

            const {
                mutate: mutateAsset,
                isLoading,
                isReady,
                guidUpdatedMaps,
                guidCreatedMaps,
                error,
            } = updateAsset(body)

            const resetInput = () => {
                // title.value = ''
                // description.value = ''
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

            const handleSave = () => {
                if (typeNameTitle.value === 'Glossary') {
                    entity.attributes.qualifiedName = generateUUID()
                }

                if (
                    ['AtlasGlossaryTerm', 'AtlasGlossaryCategory'].includes(
                        entityType.value
                    )
                ) {
                    entity.attributes.qualifiedName = `${generateUUID()}@${
                        localQualfiendName.value
                    }`
                    entity.relationshipAttributes = {
                        anchor: {
                            typeName: 'AtlasGlossary',
                            guid: getGlossaryByQF(localQualfiendName.value)
                                ?.guid,
                        },
                    }
                }

                body.value = {
                    entities: [entity],
                }
                mutateAsset()
            }

            const guid = ref(null)

            const {
                asset,
                mutate: mutateUpdate,
                isReady: isUpdateReady,
            } = useCurrentUpdate({
                id: guid,
            })

            whenever(isReady, () => {
                if (error.value) {
                    console.error(error.value)
                } else {
                    visible.value = false
                    message.success(`${typeNameTitle.value} created`)

                    if (guidCreatedMaps.value?.length > 0) {
                        guid.value = guidCreatedMaps.value[0]
                    }

                    setTimeout(() => mutateUpdate(), 1000)
                }
            })

            whenever(isUpdateReady, () => {
                if (error.value) {
                } else {
                    emit('add', asset.value)
                }
            })

            return {
                visible,
                showModal,
                resetInput,
                isUpdateReady,
                titleBar,
                entityType,
                typeNameTitle,
                handleSave,
                mutateUpdate,
                isUpdateReady,
                guidUpdatedMaps,
                asset,
                glossaryQualifiedName,
                entity,
                isLoading,
                isReady,
                error,
                getGlossaryByQF,
                localQualfiendName,
                getFirstGlossaryQF,
                guidCreatedMaps,
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
        :global(.ant-modal-header) {
            @apply border-0 border-t-0 border-b-0 px-4  !important;
        }

        :global(.ant-modal-content) {
            @apply rounded-md  !important;
        }

        :global(.ant-modal-footer) {
            @apply border-0 border-t-0 px-4 border-b-0  !important;
        }
        :global(.ant-modal-body) {
            @apply p-0 !important;
        }
    }
    .titleInput {
        :global(.ant-input::-webkit-input-placeholder) {
            @apply font-bold text-gray-500 !important;
        }
    }
</style>
