<template>
    <div class="tab-content-wrapper">
        <div class="mb-3 text-lg font-bold">Group info</div>
        <div class="mb-3">
            <UpdateName
                :group="selectedGroup"
                class="flex-1 mr-4"
                @refreshTable="$emit('refreshTable')"
            />
        </div>
        <div class="mb-3">
            <UpdateAlias
                :group="selectedGroup"
                class="flex-1"
                @refreshTable="$emit('refreshTable')"
            />
        </div>
        <div class="mb-3">
            <UpdateDescription
                :group="selectedGroup"
                class="flex-1 mr-4"
                @refreshTable="$emit('refreshTable')"
            />
        </div>
        <div class="mb-3">
            <div class="flex items-center">
                <p class="mb-0 text-gray-500">Member count</p>
            </div>
            <div class="text-gray">
                {{ selectedGroup.memberCount }}
            </div>
        </div>

        <div class="mb-3">
            <div class="flex-1 mr-4">
                <div class="flex items-center">
                    <p class="mb-0 text-gray-500">Created by</p>
                </div>
                <div class="text-gray">{{ selectedGroup.createdBy }}</div>
            </div>
        </div>
        <div class="mb-3">
            <div class="flex items-center">
                <p class="mb-0 text-gray-500">Creation date</p>
            </div>
            <div class="capitalize text-gray">
                {{ selectedGroup.createdAtTimeAgo }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import UpdateName from '~/components/admin/groups/groupPreview/about/updateName.vue'
import UpdateAlias from '~/components/admin/groups/groupPreview/about/updateAlias.vue'
import UpdateDescription from '~/components/admin/groups/groupPreview/about/updateDescription.vue'

export default defineComponent({
    name: 'About',
    components: {
        UpdateName,
        UpdateAlias,
        UpdateDescription,
    },
    props: {
        selectedGroup: {
            type: Object,
            default: {},
        },
    },
})
</script>
  
<style lang="less" scoped>
.tab-content-wrapper {
    min-height: calc(100vh - 10rem) !important;
}
</style>
  