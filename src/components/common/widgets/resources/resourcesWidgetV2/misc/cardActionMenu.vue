<template>
    <a-dropdown trigger="click" placement="bottomRight">
        <slot />

        <template #overlay>
            <a-menu class="p-2" mode="vertical">
                <EditResource :link="link" :is-edit="true">
                    <template #trigger>
                        <a-menu-link key="edit">
                            <div class="flex items-center cursor-pointer">
                                <AtlanIcon
                                    icon="Edit"
                                    class="h-4 mb-0.5 mr-1"
                                />
                                Edit
                            </div>
                        </a-menu-link>
                    </template>
                </EditResource>
                <!-- <DeleteResource
                            :asset="selectedAsset"
                            :link="link"
                            :edit-permission="editPermission"
                        >
                            <template #trigger>
                                <a-menu-link key="delete">
                                    <div class="flex items-center text-red-500">
                                        <AtlanIcon
                                            icon="Delete"
                                            class="h-4 mb-0.5 mr-1"
                                        />
                                        Delete
                                    </div>
                                </a-menu-link>
                            </template>
                        </DeleteResource> -->
            </a-menu>
        </template>
    </a-dropdown>
</template>

<script setup lang="ts">
    import { PropType } from 'vue'
    import EditResource from '@/common/widgets/resources/resourcesWidgetV2/resourceInputModal.vue'
    import { Link } from '~/types/resources.interface'

    const props = defineProps({
        link: {
            type: Object as PropType<Link>,
            required: true,
        },
    })
</script>

<style scoped></style>
