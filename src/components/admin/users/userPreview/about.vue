<template>
    <div class="px-4 py-2 tab-content-wrapper overflow-hidden overflow-y-auto">
        <div class="h-full">
            <EditUser
                v-if="isEditing"
                :selected-user="selectedUser"
                :is-current-user="isCurrentUser"
                @toggle-edit="toggleEdit"
                @success="$emit('success')"
                @image-updated="handleImageUpdate"
            />
            <ViewUser
                v-else
                :selected-user="selectedUser"
                :is-current-user="isCurrentUser"
                @toggle-edit="toggleEdit"
                @success="$emit('success')"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineAsyncComponent, defineComponent, ref, toRefs } from 'vue'

    export default defineComponent({
        name: 'UserPreviewAboutComponent',
        components: {
            EditUser: defineAsyncComponent(() => import("@/admin/users/userPreview/editUserDetails.vue")),
            ViewUser: defineAsyncComponent(() => import("@/admin/users/userPreview/viewUserDetails.vue")),
        },
        props: {
            selectedUser: {
                type: Object,
                default: () => {},
            },
            isCurrentUser: {
                type: Boolean,
                default: false,
            },
        },
        emits: ['updatedUser', 'success', 'imageUpdated'],
        setup(props, { emit }) {
            const { selectedUser, isCurrentUser } = toRefs(props)
            const isEditing = ref(false)
            const toggleEdit = () => {
                emit("success")
                isEditing.value = !isEditing.value
            }
            const handleImageUpdate = (updatedImageUrl) => {
                emit('imageUpdated', updatedImageUrl)
            }
            return {
                selectedUser,
                isCurrentUser,
                isEditing,
                toggleEdit,
                handleImageUpdate
            }
        }
    })
</script>
<style lang="less" scoped>
    .tab-content-wrapper {
        height: calc(100vh - 5rem) !important;
    }
</style>
