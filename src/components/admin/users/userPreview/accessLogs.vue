<template>
    <div class="px-4 py-2 mb-3">
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
                                fetchLogs()
                            }
                        "
                    >
                        <AtlanIcon
                            icon="Refresh"
                            class="inline-block mb-1 mr-1"
                        />
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
            <div class="mb-3 text-base font-bold text-gray-500">
                Access Logs
            </div>
            <!-- <div class="mx-4">
                <SearchAndFilter
                    v-model="searchText"
                    :placeholder="`Search via `"
                    size="minimal"
                    class=""
                />
            </div> -->
            <section class="overflow-y-auto componentHeight">
                <template v-for="(log, x) in accessLogs" :key="x">
                    <div class="py-3 hover:bg-gray-100">
                        {{ log.type }}
                        <div class="text-sm text-gray-500">
                            <span>{{ log.time_ago }}</span>
                            |
                            <span>{{ log.ipAddress }}</span>
                        </div>
                    </div>
                </template>
                <template v-if="!accessLogs.length">
                    <div class="flex items-center justify-center w-full h-full">
                        <EmptyState desc="No logs found" />
                    </div>
                </template>
            </section>
            <div
                class="flex flex-row justify-center w-full"
                v-if="accessLogs.length"
            >
                <a-button
                    class="mr-2"
                    :disabled="accessLogsParams.first === 0"
                    @click="paginateLogs('prev')"
                >
                    <AtlanIcon icon="CaretLeft" />
                </a-button>
                <a-button
                    :disabled="accessLogs.length < accessLogsParams.max"
                    @click="paginateLogs('next')"
                >
                    <AtlanIcon icon="CaretRight" />
                </a-button>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, ref, watch } from 'vue'
import { useTimeAgo } from '@vueuse/core'
import ErrorView from '@common/error/index.vue'
import { Users } from '~/services/service/users/index'
import EmptyState from '@/common/empty/index.vue'
import SearchAndFilter from '@/common/input/searchAndFilter.vue'

export default defineComponent({
    name: 'UserPreviewAccessLogsComponent',
    components: {
        ErrorView,
        EmptyState,
        SearchAndFilter,
    },
    props: {
        selectedUser: {
            type: Object,
            default: {},
        },
    },
    setup(props, context) {
        const accessLogsParams: any = reactive({ max: 10, first: 0 })
        const pV = computed(() => ({
            id: props.selectedUser.id,
        }))
        const params = new URLSearchParams({ max: '10', first: '0' })
        const searchText = ref('')
        const fetchLogs = () => {
            // reset query params
            for (const key of params.keys()) {
                params.delete(key)
            }
            Object.keys(accessLogsParams).forEach((param) => {
                if (!Array.isArray(accessLogsParams[param])) {
                    params.set(param, accessLogsParams[param])
                } else if (
                    accessLogsParams[param] &&
                    accessLogsParams[param].length
                ) {
                    accessLogsParams[param].forEach((value) => {
                        params.append(param, value)
                    })
                }
            })
            fetchUserAccessLogs()
        }
        const {
            data,
            error,
            isLoading,
            mutate: fetchUserAccessLogs,
        } = Users.GetUserAccessLogs(pV, params, {
            asyncOptions: { immediate: false },
        })
        const accessLogs = computed(() => {
            if (isLoading.value) return []
            if (data.value && data.value.length) {
                return data.value.map((log: any) => ({
                    ...log,
                    time_ago: useTimeAgo(log.time).value,
                }))
            }
            return []
        })

        const applyLogTypeFilter = (value) => {
            if (value && value.length > 0) {
                accessLogsParams.type = value
            } else {
                delete accessLogsParams.type
            }
        }
        const applyIPAddressFilter = (ip) => {
            if (ip) {
                accessLogsParams.ipAddress = ip
            } else {
                delete accessLogsParams.ipAddress
            }
        }
        const handleApplyIPAddressFilter = (searchValues, confirm) => {
            confirm()
            const searchText = searchValues[0]
            accessLogsParams.first = 0
            applyIPAddressFilter(searchText)
        }
        const handleResetIPAddressFilter = (resetFilters) => {
            resetFilters()
            accessLogsParams.first = 0
            applyIPAddressFilter(null)
        }
        const paginateLogs = (value) => {
            if (value === 'start') {
                accessLogsParams.first = 0
                fetchLogs()
            }
            if (value === 'prev') {
                accessLogsParams.first -= accessLogsParams.max
                fetchLogs()
            } else if (value === 'next') {
                accessLogsParams.first += accessLogsParams.max
                fetchLogs()
            }
        }
        watch(
            pV,
            () => {
                fetchLogs()
            },
            { deep: true, immediate: true }
        )
        return {
            searchText,
            accessLogs,
            isLoading,
            fetchLogs,
            error,
            accessLogsParams,
            handleResetIPAddressFilter,
            handleApplyIPAddressFilter,
            paginateLogs,
        }
    },
})
</script>

<style lang="less" scoped>
.componentHeight {
    height: calc(100vh - 12rem);
}
</style>
