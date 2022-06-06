<template>
    <a-dropdown trigger="click" placement="bottomLeft">
        <slot />

        <template #overlay>
            <a-menu class="" mode="vertical">
                <EditResource
                    v-if="actions.includes('edit')"
                    :link="link"
                    :is-edit="true"
                >
                    <template #trigger>
                        <a-menu-item key="edit">
                            <div class="flex items-center cursor-pointer">
                                <AtlanIcon
                                    icon="Edit"
                                    class="h-4 mb-0.5 mr-1"
                                />
                                Edit
                            </div>
                        </a-menu-item>
                    </template>
                </EditResource>
                <a-menu-item
                    v-if="actions.includes('copy')"
                    key="copyLink"
                    class="py-2"
                    @click="handleCopy"
                >
                    <div class="flex items-center">
                        <AtlanIcon
                            icon="CopyOutlined"
                            class="h-4 mb-0.5 mr-1"
                        />
                        <span class="text-sm">Copy link</span>
                    </div>
                </a-menu-item>
                <DeleteResource v-if="actions.includes('delete')" :link="link">
                    <template #trigger>
                        <a-menu-item key="delete">
                            <div
                                class="flex items-center text-red-500 cursor-pointer"
                            >
                                <AtlanIcon
                                    icon="Delete"
                                    class="h-4 mb-0.5 mr-1"
                                />
                                Delete
                            </div>
                        </a-menu-item>
                    </template>
                </DeleteResource>
            </a-menu>
        </template>
    </a-dropdown>
</template>

<script setup lang="ts">
    import { PropType } from 'vue'
    import { message } from 'ant-design-vue'
    import EditResource from '@/common/widgets/resources/resourceInputModal.vue'
    import DeleteResource from '@/common/widgets/resources/misc/deleteResource.vue'
    import { Link } from '~/types/resources.interface'
    import { copyToClipboard } from '~/utils/clipboard'

    const props = defineProps({
        link: {
            type: Object as PropType<Link>,
            required: true,
        },
        actions: {
            type: Array,
            required: false,
            default: ['edit', 'copy', 'delete'],
        },
    })
    const handleCopy = async () => {
        await copyToClipboard(props.link.attributes.link)
        message.success('Link copied!')
    }
</script>

<style scoped></style>
