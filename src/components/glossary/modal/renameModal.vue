<template>
    <div @click="showModal">
        <slot name="trigger" @click="showModal" />
    </div>

    <a-modal
        v-model:visible="visible"
        width="40%"
        :closable="false"
        ok-text="Submit Request"
        cancel-text="Cancel"
        :footer="null"
    >
        <div class="font-bold text-base p-4">
            Rename {{ assetTypeLabel[entityType] }} - {{ entityTitle }}
        </div>
        <div class="px-3 py-2 mx-4 mb-3 bg-gray-100">
            You don't have edit access to this {{ assetTypeLabel[entityType] }},
            but you can suggest a new name to the
            <span class="text-primary cursor-pointer">
                <a-popover placement="rightBottom">
                    <template #content>
                        <AdminList></AdminList>
                    </template>
                    <span>workspace admin</span>
                </a-popover>
            </span>
        </div>
        <div class="flex items-center justify-center">
            <a-input
                v-model:value="newName"
                placeholder="New name"
                class="rounded mx-4 mb-4"
            />
        </div>
        <div class="flex justify-end p-3 space-x-2 ">
            <a-button @click="handleCancel">Cancel</a-button>
            <a-button
                class="text-white bg-primary"
                :loading="isLoading"
                @click="handleDelete"
                >Submit Request</a-button
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
        defineAsyncComponent,
    } from 'vue'

    import { useVModels, whenever } from '@vueuse/core'
    import updateAsset from '~/composables/discovery/updateAsset'
    import { generateUUID } from '~/utils/helper/generator'
    import { message } from 'ant-design-vue'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import assetTypeLabel from '~/components/glossary/constants/assetTypeLabel.ts'
    import Tooltip from '@/common/ellipsis/index.vue'

    export default defineComponent({
        name: 'RemoveGtcModal',
        components: {
            Tooltip,
            AdminList: defineAsyncComponent(
                () => import('@/common/info/adminList.vue')
            ),
        },
        props: {
            entityTitle: {
                type: String,
                required: true,
                default() {
                    return ''
                },
            },

            entityType: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
        },
        emits: [],
        setup(props, { emit }) {
            // data
            const visible = ref<boolean>(false)
            const newName = ref<String>('')

            // handlers
            const showModal = () => {
                visible.value = true
            }

            const handleCancel = () => {
                visible.value = false
            }
            return { visible, handleCancel, showModal, assetTypeLabel, newName }
        },
    })
</script>

<style lang="less" module>
    .input {
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
