<template>
    <a-drawer
        :visible="showGroupPreview"
        :destroy-on-close="true"
        placement="right"
        :body-style="{ height: '100%' }"
        :mask="false"
        :width="420"
        :closable="false"
    >
        <GroupPreview @close="handleCloseGroupPreview" />
    </a-drawer>
    <a-drawer
        :visible="showUserPreview"
        :destroy-on-close="true"
        placement="right"
        :body-style="{ height: '100%' }"
        :mask="false"
        :width="420"
        :closable="false"
    >
        <UserPreview @close="handleCloseUserPreview" />
    </a-drawer>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import UserPreview from '@/admin/users/userPreview/userPreview.vue'
    import GroupPreview from '@/admin/groups/groupPreview/groupPreview.vue'
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import { useGroupPreview } from '~/composables/group/showGroupPreview'

    export default defineComponent({
        name: 'UserPreviewDrawer',
        components: {
            UserPreview,
            GroupPreview,
        },
        setup() {
            const {
                showPreview: showUserPreview,
                closePreview: closeUserPreview,
            } = useUserPreview()
            const handleCloseUserPreview = () => {
                closeUserPreview()
            }
            const {
                showPreview: showGroupPreview,
                closePreview: closeGroupPreview,
            } = useGroupPreview()
            const handleCloseGroupPreview = () => {
                closeGroupPreview()
            }

            return {
                showUserPreview,
                showGroupPreview,
                handleCloseUserPreview,
                handleCloseGroupPreview,
            }
        },
    })
</script>
