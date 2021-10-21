<template>
    <div>
        <a-drawer
            :visible="showGroupPreview"
            :destroy-on-close="true"
            placement="right"
            :body-style="{ height: '100%' }"
            @close="handleCloseGroupPreview"
            :mask="false"
            :class="$style.drawerWidth"
        >
            <GroupPreview />
        </a-drawer>
        <a-drawer
            :visible="showUserPreview"
            :destroy-on-close="true"
            placement="right"
            :body-style="{ height: '100%' }"
            @close="handleCloseUserPreview"
            :mask="false"
            :class="$style.drawerWidth"
        >
            <UserPreview />
        </a-drawer>
    </div>
</template>
    
<script lang="ts">
import { defineComponent } from 'vue'
import UserPreview from '@/admin/users/userPreview/userPreview.vue'
import GroupPreview from '@/admin/groups/groupPreview/groupPreview.vue'
import { useUserPreview } from '~/composables/user/showUserPreview'
import { useGroupPreview } from '~/composables/drawer/showGroupPreview'

export default defineComponent({
    name: 'UserPreviewDrawer',
    components: {
        UserPreview,
        GroupPreview,
    },
    setup() {
        const { showPreview: showUserPreview, closePreview: closeUserPreview } =
            useUserPreview()
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
<style lang="less" module>
.drawerWidth {
    :global(.ant-drawer-content-wrapper) {
        width: 420px !important;
        min-width: 420px !important;
        max-width: 420px !important;
    }
}
</style>
  