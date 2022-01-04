<template>
    <div class="px-4 py-2 overflow-hidden overflow-y-auto tab-content-wrapper">
        <div v-if="isLoading" class="flex items-center justify-center h-full">
            <AtlanIcon icon="Loader" class="h-10 animate-spin" />
        </div>

        <div v-else class="h-full">
            <EditUser
                v-if="isEditing"
                :selected-user="selectedUser"
                :is-current-user="isCurrentUser"
                @toggle-edit="toggleEdit"
                @success="$emit('success')"
                @image-updated="handleImageUpdate"
                @updated-user="handleEdit"
            />
            <ViewUser
                v-else
                :selected-user="selectedUser"
                :is-current-user="isCurrentUser"
                :agg-data="aggData"
                @toggle-edit="toggleEdit"
                @success="$emit('success')"
                @changeTab="(tab) => $emit('changeTab', tab)"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineAsyncComponent,
        defineComponent,
        ref,
        toRefs,
        watch,
    } from 'vue'
    import useOwnedAssetsAggregation from '@/composables/common/useOwnedAssetsAggregation'

    export default defineComponent({
        name: 'UserPreviewAboutComponent',
        components: {
            EditUser: defineAsyncComponent(
                () => import('@/admin/users/userPreview/editUserDetails.vue')
            ),
            ViewUser: defineAsyncComponent(
                () => import('@/admin/users/userPreview/viewUserDetails.vue')
            ),
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
            isLoading: {
                type: Boolean,
                default: false,
            },
        },
        emits: ['updatedUser', 'success', 'imageUpdated', 'changeTab'],
        setup(props, { emit }) {
            const { selectedUser, isCurrentUser, isLoading } = toRefs(props)
            const isEditing = ref(false)
            const toggleEdit = () => {
                // emit('success')
                isEditing.value = !isEditing.value
            }
            const handleEdit = () => {
                emit('updatedUser')
                emit('success')
            }

            const handleImageUpdate = (updatedImageUrl) => {
                emit('imageUpdated', updatedImageUrl)
            }

            const { aggData, populateAggregateData } =
                useOwnedAssetsAggregation()

            watch(
                selectedUser,
                () =>
                    populateAggregateData({
                        ownerUsers: [selectedUser.value.username],
                    }),
                {
                    immediate: true,
                }
            )

            return {
                selectedUser,
                isCurrentUser,
                isEditing,
                toggleEdit,
                handleImageUpdate,
                isLoading,
                aggData,
                handleEdit,
            }
        },
    })
</script>
<style lang="less" scoped>
    .tab-content-wrapper {
        height: calc(100vh - 5rem) !important;
    }
</style>
