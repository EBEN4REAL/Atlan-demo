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
            <div v-for="(block, index) in historyState" :key="index">
                <div
                    class="flex items-center justify-between w-full px-4 py-4 cursor-pointer item-border"
                    @click="
                        expandState[block.title] = !expandState[block.title]
                    "
                >
                    <div class="flex items-center">
                        <AtlanIcon
                            :icon="
                                expandState[block.title]
                                    ? 'CaretDown'
                                    : 'CaretRight'
                            "
                            class="w-4 h-4 mr-1 mb-0.5"
                        />
                        <span class="text-base font-bold text-gray-700">{{
                            block.title
                        }}</span>
                    </div>
                    <span class="text-sm text-gray-500">
                        {{ block.date }}
                    </span>
                </div>

                <QueryHistoryList
                    v-if="expandState[block.title]"
                    :lowerLimit="block.endDate"
                    :upperLimit="block.startDate"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, onMounted } from 'vue'
    import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
    import QueryHistoryList from './queryHistoryList.vue'
    import dayjs from 'dayjs'
    import { historyState } from './composables/useQueryHistory'

    export default defineComponent({
        components: { AtlanIcon, QueryHistoryList },
        props: {},
        setup(props) {
            const searchQuery = ref('')

            const expandedToday = ref(false)
            const expandedYesterday = ref(false)
            const expandedOld = ref(false)

            const expandState = ref({})

            onMounted(() => {
                historyState.forEach((block) => {
                    expandState.value = {
                        ...expandState.value,
                        [block.title]: false,
                    }
                })
            })

            return {
                searchQuery,
                dayjs,
                expandedToday,
                expandedYesterday,
                expandedOld,
                historyState,
                expandState,
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
