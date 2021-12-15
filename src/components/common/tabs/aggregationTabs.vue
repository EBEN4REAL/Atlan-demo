<template>
    <div class="w-full">
        <a-tabs
            v-if="dataList.length > 0"
            v-model:activeKey="selectedTab"
            class="w-full"
            :class="$style.assetbar"
            :tabBarGutter="2"
            @change="onTabChange"
        >
            <a-tab-pane v-for="item in dataList" :key="item.id">
                <template #tab>
                    <div
                        :class="{ active: item.id === selectedTab }"
                        class="flex items-center"
                    >
                        <AtlanIcon
                            :icon="icon"
                            class="self-center mr-1"
                            v-if="icon"
                        ></AtlanIcon>

                        <AtlanIcon
                            v-if="item.label == 'All'"
                            icon="Globe"
                            class="self-center mr-1 mb-0.5"
                        ></AtlanIcon>

                        <div class="self-center text-sm">
                            {{ item.label }}
                        </div>
                        <div
                            :class="$style.chip"
                            class="self-center text-xs font-bold tracking-wide text-gray-400 mt-0.5 ml-1"
                        >
                            {{ getCountString(item.count) }}
                        </div>
                    </div>
                </template>
            </a-tab-pane>
            <template #leftExtra>
                <slot></slot>
            </template>
        </a-tabs>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs, watch } from 'vue'
    import { useVModels } from '@vueuse/core'
    import { getCountString } from '~/utils/number'

    export default defineComponent({
        name: 'AssetTypeTabs',
        props: {
            modelValue: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
            list: {
                type: Array,
                required: false,
                default() {
                    return []
                },
            },
            icon: {
                type: String,
                required: false,
                default() {
                    return ''
                },
            },
            noAll: {
                type: Boolean,
                required: false,
                default() {
                    return false
                },
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { list, icon, noAll } = toRefs(props)
            const { modelValue } = useVModels(props, emit)
            const selectedTab = ref(modelValue.value)
            const dataList = ref(list.value)

            const onTabChange = () => {
                modelValue.value = selectedTab.value
                emit('change')
            }

            const addAllToList = () => {
                const initialValue = 0
                const sum = list.value.reduce(
                    (accumulator, currentValue) =>
                        accumulator + currentValue.count,
                    initialValue
                )

                const currentType = dataList.value.find(
                    (i) => i.id.toLowerCase() === modelValue.value.toLowerCase()
                )

                const found = list.value.find(
                    (i) => i.id.toLowerCase() === modelValue.value.toLowerCase()
                )

                dataList.value = list.value
                if (!found && modelValue.value !== '__all') {
                    if (currentType) {
                        currentType.count = 0
                        dataList.value.push(currentType)
                    }
                    if (sum !== 0) {
                        if (dataList.value.length !== 1 && !noAll.value) {
                            dataList.value.unshift({
                                id: '__all',
                                label: 'All',
                                count: sum,
                            })
                        }
                    }
                } else if (dataList.value.length !== 1) {
                    dataList.value.unshift({
                        id: '__all',
                        label: 'All',
                        count: sum,
                    })
                }
            }

            if (list.value.length) addAllToList()

            watch(list, (cur, prev) => {
                addAllToList()
            })

            return {
                dataList,
                selectedTab,
                getCountString,
                onTabChange,
                icon,
            }
        },
    })
</script>

<style lang="less" module>
    .assetbar {
        .active {
            .chip {
                @apply text-primary;
            }
        }
        :global(.ant-tabs-tab) {
            @apply bg-white text-sm mr-1 !important;
            border: 1px solid #e6e6eb;
            border-radius: 24px !important;
            border: 1px solid #e6e6eb !important;

            padding: 3px 8px !important;
            box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.05) !important;

            transition: all 0.8s ease-out;

            &:hover {
                @apply bg-primary-light !important;
                @apply text-primary !important;
                @apply border-primary-light !important;
                .chip {
                    @apply text-primary !important;
                }
            }
        }
        :global(.ant-tabs-nav) {
            @apply mb-0 !important;
        }

        :global(.ant-tabs-tab:first-child) {
            border-top-left-radius: 4px !important;
        }

        :global(.ant-tabs-nav-container-scrolling) {
            padding-left: 24px;
            padding-right: 24px;
        }

        :global(.ant-tabs-tab-active) {
            @apply bg-primary-light !important;
            @apply text-primary !important;
            @apply border-primary !important;

            .chip {
                @apply text-primary !important;
            }
        }

        :global(.ant-tabs-ink-bar) {
            @apply hidden !important;
        }

        :global(.ant-tabs-nav-wrap) {
            @apply pb-1;
        }

        :global(.ant-tabs-extra-content) {
            @apply pb-1 pr-2   !important;
        }

        :global(.ant-tabs-tab-arrow-show) {
            margin-top: -3px;
            width: 24px !important;
        }

        :global(.ant-tabs-nav-more) {
            @apply px-2 py-1 !important;
        }

        :global(.ant-tabs-nav::before) {
            @apply border-0 !important;
        }

        :global(.ant-tabs-tab-btn:focus) {
            @apply bg-primary-light !important;
            @apply text-primary !important;
            @apply border-primary !important;
        }
    }
</style>
