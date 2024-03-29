<template>
    <div :class="fullWidth ? 'w-full' : ''">
        <a-tabs
            v-if="dataList.length > 0"
            v-model:activeKey="selectedTab"
            class="w-full"
            :class="$style.assetbar"
            :tab-bar-gutter="2"
            @change="onTabChange"
        >
            <a-tab-pane
                v-for="(item, index) in dataList"
                :key="item.id"
                :disabled="item.disabled"
            >
                <template #tab>
                    <Shortcut
                        :shortcut-key="getKeyboardShortcutData(index)?.key"
                        :action="getKeyboardShortcutData(index)?.action"
                        placement="bottom"
                        :edit-permission="
                            shortcutEnabled && index != currentIndex
                        "
                        :delay="1"
                    >
                        <div
                            :class="{ active: item.id === selectedTab }"
                            class="flex items-center gap-x-1"
                        >
                            <div v-if="icon" class="w-4">
                                <AtlanIcon
                                    :icon="icon"
                                    class="self-center mr-1"
                                ></AtlanIcon>
                            </div>
                            <div
                                v-if="item.label == 'All' && !item.hideIcon"
                                class="w-4"
                            >
                                <AtlanIcon
                                    icon="Globe"
                                    class="self-center mr-1 mb-0.5"
                                ></AtlanIcon>
                            </div>
                            <div
                                v-else-if="
                                    item.image && !item.hideIcon && useImagePath
                                "
                                class="w-4"
                            >
                                <img
                                    :src="item.image"
                                    class="mr-1 mb-0.5 h-4 w-4"
                                />
                            </div>
                            <div
                                v-else-if="item.image && !item.hideIcon"
                                class="w-4"
                            >
                                <AtlanIcon
                                    :icon="item.image"
                                    class="self-center mr-1 mb-0.5"
                                ></AtlanIcon>
                            </div>

                            <div class="self-center text-sm">
                                {{ item.label }}
                            </div>
                            <div
                                :class="$style.chip"
                                class="self-center text-xs font-bold tracking-wide text-gray-400 mt-0.5"
                            >
                                {{ getCountString(item.count, item.showZero) }}
                            </div>
                        </div>
                    </Shortcut>
                </template>
            </a-tab-pane>
            <template #leftExtra>
                <slot></slot>
            </template>

            <template #moreIcon>
                <div class="flex">
                    <AtlanIcon
                        icon="KebabMenuHorizontal"
                        class="text-primary"
                    ></AtlanIcon>
                </div>
            </template>
        </a-tabs>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref, toRefs, watch } from 'vue'
    import { useVModels } from '@vueuse/core'
    import { getCountString } from '~/utils/number'
    import Shortcut from '@/common/popover/shortcut.vue'

    export default defineComponent({
        name: 'AssetTypeTabs',
        components: {
            Shortcut,
        },
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
            isReset: {
                type: Boolean,
                required: false,
                default() {
                    return false
                },
            },
            fullWidth: {
                type: Boolean,
                required: false,
                default() {
                    return true
                },
            },
            shortcutEnabled: {
                type: Boolean,
                required: false,
                default() {
                    return false
                },
            },
            useImagePath: {
                type: Boolean,
                required: false,
                default() {
                    return false
                },
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { list, icon, noAll, isReset } = toRefs(props)
            const { modelValue } = useVModels(props, emit)
            const selectedTab = ref(modelValue.value)
            const dataList = ref(list.value)
            const currentIndex = computed(() =>
                dataList.value.findIndex(
                    (item) => item.id === selectedTab.value
                )
            )

            const onTabChange = () => {
                console.log('change data type')
                modelValue.value = selectedTab.value
                emit('change', selectedTab.value)
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
                    console.log('not found', modelValue.value)

                    if (currentType) {
                        currentType.count = 0

                        if (isReset.value) {
                            modelValue.value = '__all'
                        } else {
                            dataList.value.push(currentType)
                        }
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
                } else if (dataList.value.length !== 1 && !noAll.value) {
                    dataList.value.unshift({
                        id: '__all',
                        label: 'All',
                        count: sum,
                    })
                }
            }

            const getKeyboardShortcutData = (index) => {
                if (currentIndex.value === index) {
                    return null
                }
                if (index > currentIndex.value) {
                    return {
                        key: 'tab',
                        action: 'Next',
                    }
                }
                return {
                    key: 'shift+tab',
                    action: 'Previous',
                }
            }

            if (list.value.length) addAllToList()

            watch(list, (cur, prev) => {
                addAllToList()
            })

            watch(modelValue, (cur) => {
                if (selectedTab.value !== cur) {
                    selectedTab.value = cur
                    onTabChange()
                }
            })

            return {
                dataList,
                selectedTab,
                getCountString,
                onTabChange,
                getKeyboardShortcutData,
                currentIndex,
                isReset,
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
            border-radius: 24px !important;
            border: 1px solid #e6e6eb !important;

            padding: 3px 8px !important;
            box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.02) !important;

            transition: all 0.3s ease-out;

            &:hover {
                @apply bg-primary-menu !important;
                @apply text-primary !important;
                @apply border-primary-menu !important;
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
            @apply ml-0 mt-0 !important;
        }

        :global(.ant-tabs-nav-container-scrolling) {
            padding-left: 24px;
            padding-right: 24px;
        }

        :global(.ant-tabs-tab-active) {
            @apply bg-primary-menu !important;
            @apply text-primary !important;
            @apply border-primary !important;
            -webkit-text-stroke: 0px !important;
            -moz-text-stroke: 0px !important;
            &:hover {
                @apply border-primary !important;
            }

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
            @apply pb-0 pr-0   !important;
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
            @apply bg-primary-menu !important;
            @apply text-primary !important;
            @apply border-primary-menu !important;
            .chip {
                @apply text-primary !important;
            }
        }
    }
</style>
