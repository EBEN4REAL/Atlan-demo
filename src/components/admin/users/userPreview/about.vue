<template>
    <div class="px-4 py-2 tab-content-wrapper">
        <div class="mb-3 text-lg font-bold">User info</div>
        <div class="mb-3">
            <UpdateFirstName
                :selected-user="selectedUser"
                :allow-update="isCurrentUser"
                class="flex-1 mr-4"
                @updatedUser="$emit('updatedUser')"
            />
        </div>
        <div class="mb-3">
            <UpdateLastName
                :selected-user="selectedUser"
                :allow-update="isCurrentUser"
                class="flex-1"
                @updatedUser="$emit('updatedUser')"
            />
        </div>
        <div class="mb-3">
            <div class="flex-1 mr-4">
                <p class="mb-0 text-gray-500">Username</p>
                <div class="text-gray">@{{ selectedUser.username }}</div>
            </div>
        </div>
        <div class="mb-3">
            <UpdateRole
                :selected-user="selectedUser"
                :allow-update="isCurrentUser"
                class="flex-1"
                @updatedUser="$emit('updatedUser')"
            />
        </div>
        <div class="mb-3">
            <div class="flex-1 mr-4">
                <p class="mb-0 text-gray-500">Email</p>
                <div class="text-gray">{{ selectedUser.email }}</div>
            </div>
        </div>
        <div class="mb-3">
            <UpdateDesignation
                class="flex-1"
                :user="selectedUser"
                :allow-update="isCurrentUser"
                @updatedUser="$emit('updatedUser')"
            />
        </div>
        <div class="mb-3">
            <div class="flex-1 mr-4">
                <p class="mb-0 text-gray-500">Joining date</p>
                <div class="text-gray">
                    {{ selectedUser.created_at_time_ago }}
                </div>
            </div>
        </div>
        <div class="mb-3">
            <UpdateSkills
                class="flex-1 mr-4"
                :user="selectedUser"
                :allow-update="isCurrentUser"
                @updatedUser="$emit('updatedUser')"
            />
        </div>
        <div class="mb-3">
            <UpdateMobileNumber
                :selected-user="selectedUser"
                :allow-update="isCurrentUser"
                class="flex-1"
                @updatedUser="$emit('updatedUser')"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import UpdateFirstName from '~/components/admin/users/userPreview/about/updateFirstName.vue'
    import UpdateLastName from '~/components/admin/users/userPreview/about/updateLastName.vue'
    import UpdateMobileNumber from '~/components/admin/users/userPreview/about/updateMobileNumber.vue'
    import UpdateSkills from '~/components/admin/users/userPreview/about/updateSkills.vue'
    import UpdateDesignation from '~/components/admin/users/userPreview/about/updateDesignation.vue'
    import UpdateRole from '~/components/admin/users/userPreview/about/updateRole.vue'

    export default defineComponent({
        name: 'UserPreviewAboutComponent',
        components: {
            UpdateFirstName,
            UpdateLastName,
            UpdateMobileNumber,
            UpdateSkills,
            UpdateDesignation,
            UpdateRole,
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
    })
</script>
<style lang="less" scoped>
    .tab-content-wrapper {
        min-height: calc(100vh - 10rem) !important;
    }
</style>
