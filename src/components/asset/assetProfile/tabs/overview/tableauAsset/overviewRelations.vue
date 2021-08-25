<template>
    <div>
        <!-- Search and Filter -->
        <div class="flex items-center mb-4">
            <div class="flex items-center flex-1">
                <a-input-search
                    placeholder="Search related assets..."
                    class="mr-3"
                    size="default"
                    :allow-clear="true"
                ></a-input-search>

                <a-popover trigger="click" placement="right">
                    <template #content>
                        <!-- <preferences /> -->
                    </template>
                    <a-button class="px-2"
                        ><atlan-icon icon="FilterDot" class="w-auto h-5"
                    /></a-button>
                </a-popover>
            </div>
        </div>

        <!-- Relations tabs -->
        <div>
            <a-tabs
                :active-key="activeKey"
                :class="$style.relationstab"
                @change="selectTab($event)"
            >
                <a-tab-pane v-for="tab in tabs" :key="tab.id">
                    <template #tab>
                        <div class="flex items-center">
                            <span> {{ tab.name }} </span
                            ><span class="chip">4</span>
                        </div>
                    </template>

                    <div>
                        <div
                            v-for="i in 5"
                            :key="i"
                            class="py-4 pl-4 border-b border-l-4 border-transparent cursor-pointer  hover:bg-primary-light"
                            style="border-bottom-color: #d9d9d9 !important"
                            :class="{
                                'border-primary bg-primary-light':
                                    currSelectedItem === i + 1,
                            }"
                            @click="
                                currSelectedItem === i + 1
                                    ? (currSelectedItem = 0)
                                    : (currSelectedItem = i + 1)
                            "
                        >
                            <h3 class="flex items-center text-lg font-semibold">
                                instacart_top_beverage_users_orders
                                <atlan-icon
                                    icon="Verified"
                                    class="w-auto h-4 ml-2"
                                />
                            </h3>
                            <p>
                                Transaction table stores all the information
                                required for a trip before an actual trip is
                                created, such as client,
                            </p>
                            <span class="text-xs">Owned by marco_arment</span>
                        </div>
                    </div>
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, ref, provide } from 'vue'

    export default defineComponent({
        setup() {
            /** DATA */
            const activeKey = ref(1)
            const data = ref({})
            const currSelectedItem = ref(0)
            const tabs = [
                {
                    id: 1,
                    name: 'Worksheet',
                    component: 'worksheet',
                },
                {
                    id: 2,
                    name: 'Dashboard',
                    component: 'dashboard',
                },
                {
                    id: 3,
                    name: 'Source',
                    component: 'source',
                },
            ]

            /** METHODS */
            const selectTab = (val: number) => {
                activeKey.value = val
            }

            /** PROVIDER */
            provide('assetData', data.value)

            return {
                activeKey,
                tabs,
                currSelectedItem,
                selectTab,
            }
        },
    })
</script>

<style scoped>
    .chip {
        @apply px-1 pt-1 pb-0.5 mr-1 ml-3 rounded tracking-wide text-xs font-bold text-primary bg-primary-light;
    }
    :global(.ant-tabs .ant-tabs-right-content) {
        @apply pr-0 !important;
    }
</style>

<style lang="less" module>
    .relationstab {
        :global(.ant-tabs-tab) {
            padding-left: 2px;
            padding-right: 2px;
            @apply pb-5 mr-5 text-gray-500 text-sm tracking-wide;
        }
        :global(.ant-tabs-tab:first-child) {
            @apply ml-0;
        }
        :global(.ant-tabs-nav-container-scrolling .ant-tabs-tab:first-child) {
            @apply ml-0;
        }
        :global(.ant-tabs-tab-active) {
            @apply text-gray font-bold;
        }
        :global(.ant-tabs-bar) {
            @apply mb-0 pl-0;
        }

        :global(.ant-tabs-tabpane) {
            height: auto !important;
            overflow: auto !important;
            @apply pr-0;
        }
        :global(.ant-tabs-ink-bar) {
            @apply rounded-t-sm;
            margin-bottom: 1px;
        }
        :global(.ant-tabs-tabpane) {
            @apply px-0 pb-0 !important;
        }
    }
</style>
