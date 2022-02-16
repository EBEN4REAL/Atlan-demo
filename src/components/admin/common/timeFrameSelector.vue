<template>
    <div>
        <a-dropdown :trigger="['click']">
            <a-button
                :style="{ 'min-width: 168px': minimal }"
                :class="{
                    'border-0 pr-0': minimal,
                    'focus:ring-2 focus:border-primary border-gray-300 rounded':
                        !minimal,
                }"
            >
                <div class="flex items-center">
                    <div class="flex flex-1">
                        <div class="mr-1">
                            <AtlanIcon
                                icon="DateTime"
                                class="h-4 -mt-0.5 -ml-0.5 hove"
                            />
                        </div>
                        <span class="text-gray-700" v-if="!rangeChecked">
                            {{
                                timeFrameOptions.find(
                                    (ex) => ex.value === modelValue.value
                                )?.label
                            }}
                        </span>
                        <span class="text-gray-700" v-else>
                            {{ convertUTCRangeToString(modelValue.value) }}
                        </span>
                    </div>
                    <div class="ml-4 text-gray-700">
                        <AtlanIcon
                            icon="ChevronDown"
                            class="h-4 -mt-0.5 -ml-0.5"
                        />
                    </div>
                </div>
            </a-button>
            <template #overlay>
                <a-menu>
                    <a-menu-item
                        key="0"
                        class="hover:bg-white"
                        :class="$style.menu_item"
                    >
                        <a-radio-group
                            v-model:value="modelValue.value"
                            class="w-full"
                            @change="triggerChange"
                        >
                            <div
                                class="flex flex-col w-full px-3 text-sm text-gray-700 hover:text-primary"
                            >
                                <template
                                    v-for="item in filteredTimeFrameOptions"
                                    :key="item.label"
                                >
                                    <div class="w-full px-0 py-1">
                                        <a-radio
                                            :value="item.value"
                                            :class="$style.radio_btn"
                                        >
                                            <div>
                                                {{ item.label }}
                                            </div>
                                        </a-radio>
                                    </div>
                                </template>
                            </div>
                        </a-radio-group>
                        <div
                            @click.stop="() => {}"
                            class="flex flex-col items-center px-3 py-2 pb-0.5 border-t border-300 hover:text-primary"
                            v-if="showCustomTime"
                        >
                            <div>
                                <div
                                    @click="setRangePickerChecked"
                                    class="flex items-center justify-start w-full mb-2"
                                >
                                    <!-- <AtlanIcon icon="Add" class="mr-2" /> -->
                                    <a-radio
                                        @click.stop="() => {}"
                                        v-model:checked="rangeChecked"
                                        @change="rangeCheckedChange"
                                        >Select custom</a-radio
                                    >
                                </div>
                                <a-range-picker
                                    :allowClear="false"
                                    @change="onRangePickerChange"
                                    v-model:value="rangePicked"
                                    :format="dateFormat"
                                />
                            </div>
                        </div>
                    </a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs } from 'vue'
    import { getTimeframeOptions } from '@/governance/queryLogs/constants/getTimeFrameOptions'
    import dayjs, { Dayjs } from 'dayjs'

    export default defineComponent({
        name: 'TimeFrame Selector',
        components: {},
        props: {
            timeFrame: {
                type: String,
                required: false,
                default: '30 days',
            },
            timeFrameWhiteList: {
                type: Array,
                default: () => {
                    return []
                },
            },
            showCustomTime: {
                type: Boolean,
                default: true,
            },
            minimal: {
                type: Boolean,
                default: false,
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { timeFrame } = toRefs(props)
            const modelValue = ref({
                label: `last ${timeFrame.value}`,
                value: timeFrame.value,
            })
            const timeFrameOptions = ref(getTimeframeOptions())
            const filteredTimeFrameOptions = ref(
                timeFrameOptions.value.filter((timeFrame) => {
                    if (!props.timeFrameWhiteList.length) {
                        return true
                    }
                    console.log('timeFrame', timeFrame.id)
                    const enabled = props.timeFrameWhiteList.includes(
                        timeFrame.id
                    )
                    return enabled
                })
            )
            const timeFrameVisible = ref(false)
            const dateFormat = 'DD MMM YYYY'
            const rangePicked = ref<Dayjs[]>([
                dayjs('01 Jan 2015', dateFormat),
                dayjs(dayjs(), dateFormat),
            ])
            const rangeChecked = ref(false)
            const triggerChange = () => {
                emit(
                    'change',
                    timeFrameOptions.value.find(
                        (e) => e.value === modelValue.value.value
                    )?.ISOVal
                )
                rangeChecked.value = false
            }
            const convertUTCRangeToString = (val: any[] = []) => {
                let res = ''
                if (val.length > 1) {
                    res += `${dayjs(val[0]).format('DD MMM YYYY')} - ${dayjs(
                        val[1]
                    ).format('DD MMM YYYY')}`
                } else if (val.length > 0) {
                    res += `${dayjs(val[0]).format('DD MMM YYYY')} - `
                }
                return res
            }

            const returnISOFormat = (val: any[] = []) => {
                let res = []
                if (val.length > 1) {
                    res.push(val[0].format())
                    res.push(val[1].format())
                } else if (val.length > 0) {
                    res.push(val[0].format())
                }
                return res
            }
            const rangeCheckedChange = () => {
                modelValue.value = {
                    label: 'custom select',
                    value: returnISOFormat(rangePicked.value),
                }
                emit('change', modelValue.value.value)
            }
            const setRangePickerChecked = () => {
                rangeChecked.value = true
                modelValue.value = {
                    label: 'custom select',
                    value: returnISOFormat(rangePicked.value),
                }
                emit('change', modelValue.value.value)
            }
            const onRangePickerChange = () => {
                rangeChecked.value = true
                modelValue.value = {
                    label: 'custom select',
                    value: returnISOFormat(rangePicked.value),
                }
                emit('change', modelValue.value.value)
            }
            return {
                setRangePickerChecked,
                onRangePickerChange,
                convertUTCRangeToString,
                rangeCheckedChange,
                rangeChecked,
                dateFormat,
                rangePicked,
                triggerChange,
                modelValue,
                timeFrameOptions,
                timeFrameVisible,
                filteredTimeFrameOptions,
            }
        },
    })
</script>

<style lang="less" module>
    .connector {
    }
    .menu_item {
        @apply px-0 !important;
    }
    .radio_btn {
        @apply w-full hover:text-primary  !important;
    }
</style>
