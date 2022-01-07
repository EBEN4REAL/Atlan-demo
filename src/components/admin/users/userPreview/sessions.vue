<template>
    <div class="px-4 py-2 mb-3 component-height">
        <div
            v-if="error"
            class="flex flex-col items-center h-full align-middle bg-white"
        >
            <ErrorView>
                <div class="mt-3">
                    <a-button
                        size="large"
                        type="primary"
                        ghost
                        @click="
                            () => {
                                fetchUserSessions()
                            }
                        "
                    >
                        <AtlanIcon icon="Reload" class="mr-2" />
                        Try again
                    </a-button>
                </div>
            </ErrorView>
        </div>
        <div
            v-else-if="isLoading"
            class="flex items-center justify-center w-full h-full"
        >
            <AtlanIcon icon="CircleLoader" class="h-5 animate-spin" />
        </div>
        <template v-else>
            <div class="py-1 mb-3 text-base font-bold text-gray-500">
                Sessions
            </div>
            <!-- <div class="">
                <SearchAndFilter
                    v-model:value="searchText"
                    :placeholder="`Search via IP address`"
                    size="minimal"
                    class=""
                />
            </div> -->
            <section class="overflow-y-auto session-list">
                <a-timeline class="ml-1">
                    <a-timeline-item
                        v-for="(s, x) in sessionList"
                        :key="x"
                        class="pb-5 cursor-default"
                    >
                        <template #dot>
                            <div
                                class="border ant-timeline-item-dot border-primary"
                            ></div>
                        </template>
                        <div class="mt-2">
                            <a-tooltip placement="bottom">
                                <template #title>
                                    <!-- <div class="p-3 text-gray-500"> -->
                                    <!-- <div class="">Last accessed</div> -->
                                    <div>{{ s.last_accessed_string }}</div>
                                    <!-- </div> -->
                                </template>
                                {{ s.last_accessed_time_ago }}
                            </a-tooltip>
                            <div class="text-sm text-gray-500">
                                {{ s.ipAddress }}
                            </div>
                        </div>
                    </a-timeline-item>
                </a-timeline>
                <template
                    v-if="
                        !sessionList.length ||
                        (searchText.length &&
                            !sessionList.filter((s) =>
                                s.ipAddress.includes(searchText)
                            ).length)
                    "
                >
                    <div class="flex items-center justify-center w-full h-full">
                        <EmptyState desc="No sessions found" />
                    </div>
                </template>
            </section>
        </template>
    </div>
</template>

<script lang="ts">
    import { defineComponent, computed, reactive, ref, watch } from 'vue'
    import { useTimeAgo } from '@vueuse/core'
    import ErrorView from '@common/error/index.vue'
    import { Users } from '~/services/service/users/index'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    import EmptyState from '@/common/empty/index.vue'

    export default defineComponent({
        name: 'UserPreviewSessions',
        components: {
            ErrorView,
            SearchAndFilter,
            EmptyState,
        },
        props: {
            selectedUser: {
                type: Object,
                default: () => {},
            },
        },
        setup(props, context) {
            const searchText = ref('')

            const sessionParams = reactive({ max: 100, first: 0 })
            const pV = computed(() => ({ id: props.selectedUser.id }))
            const {
                data,
                error,
                mutate: fetchUserSessions,
                isLoading,
            } = Users.GetUserSessions(pV, sessionParams, {
                asyncOptions: { immediate: false },
            })

            watch(
                pV,
                () => {
                    fetchUserSessions()
                },
                { deep: true, immediate: true }
            )
            // const signOutAllSessionsLoading = ref(false)
            // const signOutSessionByIdLoading = ref(false)

            const sessionList = computed(() => {
                if (data.value && data.value.length) {
                    return data.value.map((session: any) => ({
                        ...session,
                        started_at_string: new Date(
                            session.start
                        ).toLocaleString(),
                        last_accessed_string: new Date(
                            session.lastAccess
                        ).toLocaleString(),
                        started_time_ago: useTimeAgo(session.start).value,
                        last_accessed_time_ago: useTimeAgo(session.lastAccess)
                            .value,
                    }))
                }
                return []
            })
            // const signOutAllSessions = () => {
            //     const { data, isReady, error, isLoading } =
            //         Users.SignOutAllSessions(props.selectedUser.id)
            //     watch(
            //         [data, isReady, error, isLoading],
            //         () => {
            //             signOutAllSessionsLoading.value = isLoading.value
            //             if (isReady && !error.value && !isLoading.value) {
            //                 fetchUserSessions()
            //                 message.success('All sessions deleted')
            //             } else if (error && error.value) {
            //                 message.error(
            //                     'Unable to end all sessions, please try again'
            //                 )
            //             }
            //         },
            //         { immediate: true }
            //     )
            // }
            // const signOutUserSession = (sessionId: string) => {
            //     const { data, isReady, error, isLoading } =
            //         Users.SignOutSessionById(sessionId)
            //     watch(
            //         [data, isReady, error, isLoading],
            //         () => {
            //             signOutSessionByIdLoading.value = isLoading.value
            //             if (
            //                 isReady &&
            //                 !error.value &&
            //                 !signOutSessionByIdLoading.value
            //             ) {
            //                 fetchUserSessions()
            //                 message.success('User session ended')
            //             } else if (error && error.value) {
            //                 message.error(
            //                     'Unable to sign user out, please try again'
            //                 )
            //             }
            //         },
            //         { immediate: true }
            //     )
            // }

            return {
                searchText,
                isLoading,
                error,
                sessionList,
                fetchUserSessions,
            }
        },
    })
</script>
<style lang="less" scoped>
    .session-list {
        height: calc(100vh - 8rem) !important;
    }
    .component-height {
        height: calc(100vh - 5rem) !important;
    }
</style>
