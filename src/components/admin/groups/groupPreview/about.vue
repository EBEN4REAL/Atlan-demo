<template>
    <div class="px-4 py-2 overflow-hidden overflow-y-auto tab-content-wrapper">
        <div v-if="isLoading" class="flex items-center justify-center h-full">
            <AtlanLoader class="h-10" />
        </div>

        <div v-else class="h-full">
            <EditGroup
                v-if="isEditing"
                :selected-group="selectedGroup"
                @toggle-edit="toggleEdit"
                @success="$emit('success')"
                @updated-group="handleEdit"
            />
            <ViewGroup
                v-else
                :selected-group="selectedGroup"
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
        name: 'GroupPreviewAboutComponent',
        components: {
            EditGroup: defineAsyncComponent(
                () => import('@/admin/groups/groupPreview/about/EditGroup.vue')
            ),
            ViewGroup: defineAsyncComponent(
                () => import('@/admin/groups/groupPreview/about/ViewGroup.vue')
            ),
        },
        props: {
            selectedGroup: {
                type: Object,
                default: () => {},
            },

            isLoading: {
                type: Boolean,
                default: false,
            },
        },
        emits: ['updatedUser', 'success', 'imageUpdated', 'changeTab'],
        setup(props, { emit }) {
            const { selectedGroup, isLoading } = toRefs(props)
            const isEditing = ref(false)
            const toggleEdit = () => {
                // emit('success')
                isEditing.value = !isEditing.value
            }
            const handleEdit = () => {
                emit('updatedUser')
                emit('success')
            }
            const { aggData, populateAggregateData } =
                useOwnedAssetsAggregation()

            watch(
                selectedGroup,
                () =>
                    populateAggregateData({
                        ownerGroups: [selectedGroup.value.alias],
                    }),
                {
                    immediate: true,
                }
            )
            return {
                isEditing,
                toggleEdit,
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
