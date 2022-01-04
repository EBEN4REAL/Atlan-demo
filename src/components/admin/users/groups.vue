<template>
    <!-- <a-dropdown v-model:visible="filterOpened"> -->
    <!-- <template #overlay> -->
    <div class="flex flex-wrap gap-2 mt-3">
        <div
            v-for="group in groupList"
            :key="group.id"
            class="flex items-center px-2 border rounded-xl min-w"
        >
            <div class="mr-2 icon-wrapper">
                <AtlanIcon icon="Group" class="text-primary" />
            </div>
            {{ group.name }}
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, computed, toRefs } from 'vue'
    import getUserGroups from '~/composables/user/getUserGroups'

    export default defineComponent({
        name: 'GroupUser',
        props: {
            user: {
                type: Object,
                required: true,
            },
        },
        setup(props, { emit }) {
            const users = ref([])
            const { user } = toRefs(props)
            const userId = computed(() => user.value.id)
            const groupListAPIParams = computed(() => ({
                userId: userId.value,
                params: {
                    limit: user.value.groupCount,
                    offset: 0,
                    sort: 'name',
                    filter: {},
                },
                immediate: true,
            }))
            const { groupList, isLoading } = getUserGroups(groupListAPIParams)
            return {
                groupList,
            }
        },
    })
</script>

<style lang="less" scoped>
    .icon-wrapper {
        background: #f4f6fd;
        border-radius: 50%;
        padding: 0 2px;
        margin: 2px 0;
    }
</style>
