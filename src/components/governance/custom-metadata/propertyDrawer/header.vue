<template>
    <Shortcut
        shortcut-key="esc"
        action="close"
        placement="left"
        :delay="0"
        :edit-permission="true"
    >
        <div class="close-btn-sidebar" @click="$emit('close')">
            <AtlanIcon icon="Add" class="text-white outline-none" />
        </div>
    </Shortcut>
    <div
        class="flex items-center justify-between px-3 py-4 border-b border-gray-300"
    >
        <div class="flex items-center flex-grow gap-x-2">
            <div
                class="flex items-center justify-center w-8 h-8 p-2 rounded-full bg-primary-light"
            >
                <AtlanIcon icon="Metadata" class="text-primary" />
            </div>
            <div class="flex-grow font-bold">
                <Truncate :tooltip-text="title" class="" :rows="2" />
            </div>
        </div>
        <div class="flex items-center justify-end gap-x-4">
            <div v-if="!editing" class="flex items-center space-x-2">
                <a-switch
                    v-model:checked="createMore"
                    size="small"
                    :class="createMore ? 'bg-primary' : 'bg-gray-300'"
                />
                <p class="p-0 m-0">Create more</p>
            </div>
            <template v-else>
                <a-dropdown v-model:visible="visible" trigger="click">
                    <div
                        class="flex items-center justify-center w-8 h-8 rounded cursor-pointer"
                        :class="visible ? 'bg-gray-100' : 'hover:bg-gray-100'"
                    >
                        <AtlanIcon icon="ThreeDotsAlt" class="h-1" />
                    </div>
                    <template #overlay>
                        <a-menu class="w-40" @click="visible = false">
                            <a-menu-item
                                class="h-9"
                                @click="
                                    copyAPI(
                                        property.displayName,
                                        'Name Copied!'
                                    )
                                "
                            >
                                <AtlanIcon icon="CopyOutlined" class="mr-2" />
                                Copy Name
                            </a-menu-item>
                            <a-menu-item
                                class="h-9"
                                @click="copyAPI(property.name, 'GUID Copied!')"
                            >
                                <AtlanIcon icon="CopyOutlined" class="mr-2" />
                                Copy GUID
                            </a-menu-item>
                            <a-menu-item class="h-9">
                                <AtlanIcon
                                    class="inline mb-1 mr-2"
                                    :class="
                                        !true ? 'text-red-200' : 'text-error'
                                    "
                                    icon="Trash"
                                />
                                Delete
                            </a-menu-item>
                        </a-menu>
                        >
                    </template>
                </a-dropdown>
            </template>
            <AtlanButton
                type="primary"
                size="sm"
                class="w-7"
                :loading="loading"
                @click="$emit('update')"
            >
                {{ editing ? 'Update' : 'Add' }}
            </AtlanButton>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { useVModels } from '@vueuse/core'
    import { message, Modal } from 'ant-design-vue'
    import { inject, ref } from 'vue'
    import Truncate from '@/common/ellipsis/index.vue'
    import Shortcut from '@/common/popover/shortcut.vue'

    import { copyToClipboard } from '~/utils/clipboard'
    import { CUSTOM_METADATA_ATTRIBUTE as CMA } from '~/types/typedefs/customMetadata.interface'

    const props = defineProps({
        title: {
            type: String,
            default: 'New Property',
        },
        editing: {
            type: Boolean,
            required: true,
        },
        loading: {
            type: Boolean,
            required: true,
        },
        createMore: {
            type: Boolean,
        },
    })

    const emits = defineEmits(['close', 'toggleCreateMore', 'update'])
    const { createMore } = useVModels(props, emits)

    const property = inject('property') as CMA
    const visible = ref(false)

    const copyAPI = (text: string, theMessage: String) => {
        copyToClipboard(text)
        message.success({
            content: theMessage,
        } as any)
    }
</script>

<style scoped></style>
