<template>
    <div class="flex flex-col items-center w-full h-full bg-white">
        <div class="w-full p-4 pb-0 text-lg font-bold text-gray-700">
            Schedule Query
        </div>
        <div class="flex flex-row w-full px-4 mt-3 mb-6">
            <a-input
                v-model:value="searchQuery"
                class="h-8 rounded"
                :class="$style.inputSearch"
                placeholder="Search schedules"
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

        <div class="flex flex-col w-full h-full mt-2 overflow-y-scroll"></div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    export default defineComponent({
        components: {},
        props: {},
        setup(props) {},
    })
</script>
<style lang="less" scoped>
    .placeholder {
        background-color: #f4f4f4;
    }
</style>
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
