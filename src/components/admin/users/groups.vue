<template>
    <a-popover v-model:visible="visiblePopover" placement="bottom">
        <template #content>
            <div class="p-3 pb-4 content-popover-group-persona">
                <div class="flex justify-between">
                    Groups
                    <div
                        class="cursor-pointer"
                        @click="handleManageGroups(user)"
                    >
                        <span class="ml-auto text-primary"> Manage </span>
                        <AtlanIcon
                            icon="ArrowRight"
                            class="ml-1 text-primary"
                        />
                    </div>
                </div>
                <div class="mt-3 container-scroll">
                    <div v-if="isLoading" class="flex justify-center mt-3">
                        <AtlanIcon
                            icon="CircleLoader"
                            class="mb-1 mr-2 text-primary animate-spin"
                        />
                    </div>
                    <div v-else class="flex flex-wrap gap-2">
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
                </div>
            </div>
        </template>
        <div class="text-left cursor-pointer text-primary group-count">
            {{
                user?.groupCount > 1
                    ? user?.groupCount + ' groups'
                    : user?.groupCount + ' group' || '-'
            }}
        </div>
    </a-popover>
</template>

<script lang="ts">
    import { defineComponent, ref, computed, toRefs, watch } from 'vue'
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
            const visiblePopover = ref(false)
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
                immediate: false,
            }))
            const { groupList, isLoading, getUserGroupList } =
                getUserGroups(groupListAPIParams)
            const handleManageGroups = (userData: any) => {
                visiblePopover.value = false
                emit('handleManageGroups', userData)
            }
            watch(visiblePopover, () => {
                if (visiblePopover.value) {
                    getUserGroupList()
                }
            })
            return {
                groupList,
                isLoading,
                handleManageGroups,
                visiblePopover,
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
    .content-popover-group-persona {
        min-width: 180px;
    }
    .container-scroll {
        max-height: 170px;
        overflow: auto;
        height: auto;
    }
    // .group-count {
    // &:hover {
    //     text-decoration: underline;
    // }
    // }
</style>
