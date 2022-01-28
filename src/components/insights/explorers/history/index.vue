<template>
    <div class="flex flex-col items-center w-full h-full history-container">
        <div class="w-full p-4 pb-0 text-lg font-bold text-gray-700">
            Query History
        </div>
        <div class="flex flex-row w-full px-4 mt-2 space-x-2">
            <a-input
                v-model:value="searchQuery"
                class="h-8 rounded"
                :class="$style.inputSearch"
                placeholder="Search query history"
            >
                <template #suffix>
                    <AtlanIcon icon="Search" color="#6F7590" />
                </template>
            </a-input>
            <a-popover trigger="click" placement="bottomLeft">
                <a-button class="flex items-center w-8 h-8 p-2 filterButton">
                    <template #icon>
                        <AtlanIcon icon="Filter" class="-ml-0.5" />
                    </template>
                </a-button>
                <template #content>
                    <div>Filters</div>
                </template>
            </a-popover>
        </div>

        <div class="flex flex-col w-full h-full mt-2 overflow-y-scroll">
            <div
                class="flex items-center justify-between w-full px-4 py-4 cursor-pointer item-border"
                @click="expandedToday = !expandedToday"
            >
                <div class="flex items-center">
                    <AtlanIcon
                        :icon="expandedToday ? 'CaretDown' : 'CaretRight'"
                        class="w-4 h-4 mr-1 mb-0.5"
                    />
                    <span class="text-base font-bold text-gray-700">Today</span>
                </div>
                <span class="text-sm text-gray-500">{{
                    dayjs().format('MMMM D, YYYY')
                }}</span>
            </div>

            <QueryHistoryList
                v-if="expandedToday"
                :lowerLimit="dayjs(new Date(Date.now())).endOf('day').format()"
                :upperLimit="
                    dayjs(new Date(Date.now())).startOf('day').format()
                "
            />

            <div
                class="flex items-center justify-between w-full px-4 py-4 cursor-pointer item-border"
                @click="expandedYesterday = !expandedYesterday"
            >
                <div class="flex items-center">
                    <AtlanIcon
                        :icon="expandedYesterday ? 'CaretDown' : 'CaretRight'"
                        class="w-4 h-4 mr-1 mb-0.5"
                    />
                    <span class="text-base font-bold text-gray-700"
                        >Yesterday</span
                    >
                </div>
                <span class="text-sm text-gray-500">{{
                    dayjs(Date.now() - 24 * 60 * 60 * 1000).format(
                        'MMMM D, YYYY'
                    )
                }}</span>
            </div>

            <QueryHistoryList
                v-if="expandedYesterday"
                :lowerLimit="
                    dayjs(new Date(Date.now() - 24 * 60 * 60 * 1000))
                        .endOf('day')
                        .format()
                "
                :upperLimit="
                    dayjs(new Date(Date.now() - 24 * 60 * 60 * 1000))
                        .startOf('day')
                        .format()
                "
            />

            <div
                class="flex items-center justify-between w-full px-4 py-4 cursor-pointer item-border"
                @click="expandedOld = !expandedOld"
            >
                <div class="flex items-center">
                    <AtlanIcon
                        :icon="expandedOld ? 'CaretDown' : 'CaretRight'"
                        class="w-4 h-4 mr-1 mb-0.5"
                    />
                    <span class="text-base font-bold text-gray-700">Older</span>
                </div>
            </div>
            <QueryHistoryList
                v-if="expandedOld"
                :lowerLimit="
                    dayjs(new Date(Date.now() - 48 * 60 * 60 * 1000))
                        .endOf('day')
                        .format()
                "
                :upperLimit="
                    dayjs(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
                        .startOf('day')
                        .format()
                "
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
    import QueryHistoryList from './queryHistoryList.vue'
    import dayjs from 'dayjs'

    export default defineComponent({
        components: { AtlanIcon, QueryHistoryList },
        props: {},
        setup(props) {
            const searchQuery = ref('')

            const expandedToday = ref(false)
            const expandedYesterday = ref(false)
            const expandedOld = ref(false)

            return {
                searchQuery,
                dayjs,
                expandedToday,
                expandedYesterday,
                expandedOld,
            }
        },
    })
</script>
<style lang="less" module>
    .inputSearch {
        box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05) !important;
        background-color: #fff !important;
        border: 1px solid #e9ebf1 !important;
        color: #6f7590 !important;
        border-radius: 8px !important;
    }
</style>
<style lang="less" scoped>
    .history-container {
        background-color: #fbfbfb;
    }
    .filterButton {
        background: #ffffff;
        border: 1px solid #e6e6eb;
        box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
        border-radius: 8px;
    }
    .item-border {
        border-bottom: 1px solid #f3f3f3;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
