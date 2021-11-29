<template>
    <a-drawer
        :visible="showGroupPreview"
        :destroy-on-close="true"
        placement="right"
        :body-style="{ height: '100%' }"
        :mask="false"
        :width="420"
        :closable="false"
        class="drawer"
    >
        <UserOrGroupPreview previewType="group" @close="handleCloseGroupPreview" />
    </a-drawer>
    <a-drawer
        :visible="showUserPreview"
        :destroy-on-close="true"
        placement="right"
        :body-style="{ height: '100%' }"
        :mask="false"
        :width="420"
        :closable="false"
        class="drawer"
    >
        <UserOrGroupPreview previewType="user" @close="handleCloseUserPreview" />
    </a-drawer>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import { useGroupPreview } from '~/composables/group/showGroupPreview'
    import UserOrGroupPreview from '@/admin/common/userOrGroupPreview.vue'

    export default defineComponent({
        name: 'UserPreviewDrawer',
        components: {
            UserOrGroupPreview,
        },
        setup() {
            const {
                showPreview: showUserPreview,
                closePreview: closeUserPreview
            } = useUserPreview()
            const handleCloseUserPreview = () => {
                closeUserPreview()
            }
            const {
                showPreview: showGroupPreview,
                closePreview: closeGroupPreview
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

<style lang="less" scoped>
    .drawer {
        :global(.ant-drawer-body) {
            @apply overflow-hidden !important;
        }
    }
</style>
