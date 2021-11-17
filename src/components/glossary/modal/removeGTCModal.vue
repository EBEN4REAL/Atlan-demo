<template>
    <!-- <div @click="showModal"></div>
        <slot name="trigger" @click="showModal" />
    </div> -->

    <!-- <a-modal
        v-model:visible="visible"
        :class="$style.input"
        width="50%"
        :closable="true"
        okText="Save"
        cancelText=""
        :footer="null"
    >
        <div class="p-3">
            <p class="font-bold uppercase text-md">Are you sure you want to delete the {{typeNameTitle}} and all its contents? </p>
    
        </div>

        <div class="flex justify-end p-3 border-t border-gray-200">
            <a-button type="danger" @click="handleSave" :loading="isLoading"
                >Delete</a-button
            >
        </div>
    </a-modal> -->
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
    import { message } from 'ant-design-vue'

    export default defineComponent({
        name: 'AddGtcModal',
        components: {
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
            guid: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
        },
        emits: ['add', 'update:visible'],
        setup(props, { emit }) {
            // const { entityType, guid } = toRefs(props)
            // const visible = ref(false)
            // const entity = reactive({
            //     attributes: {
            //         userDescription: '',
            //         name: '',
            //         qualifiedName: '',
            //     },
            //     typeName: entityType.value,
            // })
            // const showModal = async () => {
            //     visible.value = true
            // }
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
            // const typeNameTitle = computed(() => {
            //     switch (entityType.value) {
            //         case 'AtlasGlossary':
            //             return 'Glossary'
            //         case 'AtlasGlossaryCategory':
            //             return 'Category'
            //         case 'AtlasGlossaryTerm':
            //             return 'Term'
            //         default:
            //             return 'Glossary'
            //     }
            // })
            // const handleSave = () => {
            //     if (typeNameTitle.value === 'Glossary') {
            //         entity.attributes.qualifiedName = generateUUID()
            //     }
            //     body.value = {
            //         entities: [entity],
            //     }
            //     mutateAsset()
            // }
            // whenever(isReady, () => {
            //     if (error.value) {
            //         console.error(error.value)
            //     } else {
            //         visible.value = false
            //         message.success(`${typeNameTitle.value} created`)
            //         if (guidUpdatedMaps.value?.length > 0) {
            //             guid.value = guidUpdatedMaps.value[0]
            //         }
            //         setTimeout(() => mutateUpdate(), 1000)
            //     }
            // })
            // whenever(isUpdateReady, () => {
            //     if (error.value) {
            //     } else {
            //         emit('delete', asset.value)
            //     }
            // })
            // return {
            //     visible,
            //     showModal,
            //     entityType,
            //     typeNameTitle,
            //     handleSave,
            //     guid,
            //     entity,
            //     isLoading,
            //     isReady,
            //     error,
            // }
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
