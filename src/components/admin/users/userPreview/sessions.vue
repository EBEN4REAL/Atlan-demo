<template>
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
                    <fa icon="fal sync" class="mr-2"></fa>
                    Try again
                </a-button>
            </div>
        </ErrorView>
    </div>
    <div
        v-else-if="isLoading"
        class="flex items-center justify-center w-full componentHeight"
    >
        <AtlanIcon icon="CircleLoader" class="h-5 animate-spin" />
    </div>
    <template v-else>
        <h1 class="px-4 py-2 text-xl font-bold">Sessions</h1>
        <!-- <div class="mx-4">
            <SearchAndFilter
                v-model="searchText"
                :placeholder="`Search via IP address`"
                size="minimal"
                class=""
            />
        </div> -->
        <section class="overflow-y-auto componentHeight">
            <template
                v-for="(s, x) in searchText.length
                    ? sessionList.filter((s) =>
                          s.ipAddress.includes(searchText)
                      )
                    : sessionList"
                :key="x"
            >
                <div class="px-4 py-3 hover:bg-gray-100">
                    <a-popover placement="right">
                        <template #content>
                            <div class="text-gray-500">
                                <div class="">Last accessed</div>
                                <div>{{ s.last_accessed_string }}</div>
                            </div>
                        </template>
                        {{ s.last_accessed_time_ago }}
                    </a-popover>
                    <div class="text-sm text-gray-500">
                        {{ s.ipAddress }}
                    </div>
                </div>
            </template>
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
                default: {},
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
    .componentHeight {
        height: calc(100vh - 12rem);
    }
</style>
