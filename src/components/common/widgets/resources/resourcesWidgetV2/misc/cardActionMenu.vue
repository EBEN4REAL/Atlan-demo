<template>
    <a-dropdown trigger="click" placement="bottomLeft">
        <slot />

        <template #overlay>
            <a-menu class="" mode="vertical">
                <EditResource :link="link" :is-edit="true">
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
                <DeleteResource :link="link">
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
    import EditResource from '@/common/widgets/resources/resourcesWidgetV2/resourceInputModal.vue'
    import DeleteResource from '@/common/widgets/resources/resourcesWidgetV2/misc/deleteResource.vue'
    import { Link } from '~/types/resources.interface'

    const props = defineProps({
        link: {
            type: Object as PropType<Link>,
            required: true,
        },
    })
</script>

<style scoped></style>
