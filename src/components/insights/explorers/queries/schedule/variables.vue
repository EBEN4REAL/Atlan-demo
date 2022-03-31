<template>
    <div
        class="flex flex-col w-full h-full overflow-auto bg-white"
        style="min-height: 430px"
    >
        <div class="flex items-center py-6 pb-2 mx-6 border-b border-gray-200">
            <AtlanIcon icon="Flash" class="w-4 h-4 mr-2" />
            <div
                class="flex items-center font-bold text-gray-700"
                style="font-size: 16px"
            >
                <span class="mr-2"> Variables</span>
                <div
                    class="flex items-center justify-center w-4 h-5 text-xs font-bold rounded text-primary bg-primary-light"
                >
                    <span> {{ variablesData?.length ?? 0 }}</span>
                </div>
            </div>
        </div>

        <div class="p-6 overflow-auto custom-grid" style="height: 240px">
            <!-- {{ variablesData }} -->
            <template v-for="item in variablesData" :key="item.key">
                <div class="w-full item">
                    <p class="mb-1 font-bold text-gray-500 required">
                        {{ item.name }}
                    </p>

                    <a-date-picker
                        v-if="item.type === 'date'"
                        :allowClear="false"
                        placeholder="Select Date"
                        :value="getDaysJsWrappedValue(item.value)"
                        @change="
                            (val) => hanldeActiveVariableDateChange(val, item)
                        "
                        class="w-full border-gray-300 rounded box-shadow focus:border-primary-focus focus:border-2 focus:outline-none"
                    />
                    <a-input-number
                        class="w-full border border-gray-300 input"
                        v-else-if="item.type === 'number'"
                        v-model:value="item.value"
                        :placeholder="`Enter a ${item.type} value`"
                    />
                    <a-dropdown
                        v-else-if="item.type === 'dropdown'"
                        :trigger="['click']"
                    >
                        <a-button
                            class="flex items-center justify-between w-full bg-white border border-gray-300 outline-none"
                            style="width: 138px; height: 32px"
                        >
                            <span class="text-gray-500 truncate">{{
                                item.allowMultiple
                                    ? item.value.length
                                        ? Array.isArray(item.value)
                                            ? item?.value?.join(', ')
                                            : item.value
                                        : 'Select a value'
                                    : Array.isArray(item.value)
                                    ? item?.value?.join(', ')
                                    : item.value ?? 'Select a value'
                            }}</span>
                        </a-button>
                        <template #overlay>
                            <div
                                class="z-10 flex flex-col w-full text-gray-700 bg-white rounded shadow"
                                style="max-height: 200px"
                            >
                                <div
                                    v-if="item.allowMultiple"
                                    class="w-full overflow-y-scroll gap-y-2"
                                >
                                    <div
                                        class="absolute top-0 z-10 flex flex-col w-full bg-white hover:bg-primary-light"
                                    >
                                        <a-checkbox
                                            class="inline-flex items-center w-full px-2 py-2"
                                            :class="$style.checkbox_style"
                                            @change="
                                                (checked) => {
                                                    onCheckAllOptions(
                                                        item,
                                                        checked
                                                    )
                                                }
                                            "
                                        >
                                            <span
                                                class="flex w-full h-full ml-1 -mb-1.5"
                                                >Select all</span
                                            >
                                        </a-checkbox>
                                    </div>

                                    <div class="checkbox-border"></div>

                                    <a-checkbox-group
                                        v-model:value="item.value"
                                        class="w-full overflow-x-hidden mt-9"
                                    >
                                        <div
                                            v-for="item2 in item.options"
                                            :key="item2.label"
                                            class="w-full px-2 py-1 hover:bg-primary-light"
                                        >
                                            <a-checkbox
                                                :value="item2.value"
                                                :class="$style.checkbox_style"
                                                class="inline-flex items-center"
                                                @change="
                                                    (checked) => {
                                                        onCheckOption(
                                                            item,
                                                            checked
                                                        )
                                                    }
                                                "
                                                ><span
                                                    class="flex w-full h-full ml-1 -mb-1.5"
                                                >
                                                    <Tooltip
                                                        :tooltip-text="`${item2.label}`"
                                                        clamp-percentage="97%"
                                                    />
                                                </span>
                                            </a-checkbox>
                                        </div>
                                    </a-checkbox-group>
                                </div>
                                <div v-else class="overflow-y-scroll">
                                    <a-menu
                                        v-model:value="item.value"
                                        class="w-full"
                                        @select="
                                            (e) =>
                                                handleSelectVariable(
                                                    e,
                                                    item.key
                                                )
                                        "
                                    >
                                        <div
                                            v-for="item2 in item.options"
                                            :key="item2.label"
                                            class="w-full"
                                        >
                                            <a-menu-item
                                                class="w-full px-2 hover:bg-primary-light"
                                                :key="item2.value"
                                            >
                                                <div
                                                    class="flex items-center justify-between w-full"
                                                >
                                                    <span
                                                        class="flex w-full h-8 mb-0"
                                                        ><Tooltip
                                                            :tooltip-text="`${item2.label}`"
                                                            clamp-percentage="99%"
                                                    /></span>
                                                </div>
                                            </a-menu-item>
                                        </div>
                                    </a-menu>
                                </div>
                            </div>
                        </template>
                    </a-dropdown>
                    <a-input
                        class="border border-gray-300 input"
                        v-else
                        v-model:value="item.value"
                        :placeholder="`Enter a ${item.type} value`"
                    />
                </div>
            </template>
        </div>
        <div class="p-3 mx-6 my-6 border border-gray-300 rounded light-shadow">
            <div class="flex items-center mb-2">
                <div class="w-2 h-2 mr-2.5 bg-green-400 rounded-full"></div>
                <p class="text-sm text-gray-500">
                    Next run
                    <span class="font-bold"
                        >{{ _date?.format(format) }}&nbsp;
                        {{ getAbbreviation(timeZoneAbbreviation) }}</span
                    >
                </p>
            </div>
            <div class="flex items-center">
                <AtlanIcon
                    icon="Mail"
                    class="w-4 h-4 mr-2 -mt-0.5 text-gray-500"
                />
                <p class="text-sm text-gray-500">
                    <span class="font-bold"
                        >{{ usersData?.ownerUsers?.length }} users</span
                    >
                    will be notified over email at
                    {{ _date?.format('hh:mm A') }}
                    {{ getAbbreviation(timeZoneAbbreviation) }}
                    <span class="capitalize">{{
                        infoTabeState.frequency
                    }}</span>
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        toRefs,
        ref,
        watch,
        computed,
    } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import parser from 'cron-parser'
    import dayjs from 'dayjs'
    import Tooltip from '@common/ellipsis/index.vue'
    import { useVModels } from '@vueuse/core'

    export default defineComponent({
        components: { Tooltip },
        props: {
            item: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            variablesData: {
                type: Object as PropType<any[]>,
                required: true,
            },
            usersData: {
                type: Object as PropType<{
                    ownerUsers: Array<string>
                    ownerGroups: Array<string>
                }>,
                required: true,
            },
            cronData: {
                type: Object as PropType<{
                    cron: string
                    timezone: string
                }>,
                required: true,
            },
            infoTabeState: {
                type: Object as PropType<{
                    name: string
                    frequency: string
                    time: string
                    timezone: string
                    dayOfWeek: string
                    date: string
                }>,
                required: true,
            },
        },
        setup(props) {
            debugger
            const { item, usersData, cronData, infoTabeState } = toRefs(props)
            const { variablesData } = useVModels(props)

            const interval = computed(() =>
                parser.parseExpression(cronData.value.cron)
            )

            const _date = computed(() =>
                dayjs(interval.value.next().toString())
            )
            const parsedDate = computed(() => new Date(_date.value.toString()))
            const timeZoneAbbreviation = computed(
                () =>
                    String(String(parsedDate.value).split('(')[1]).split(')')[0]
            )
            function getAbbreviation(str: string = '') {
                return str.match(/\b([A-Z])/g).join('')
            }

            const format = 'MMM DD, dddd, hh:mm A'

            const getDaysJsWrappedValue = (value) => {
                return dayjs(value)
            }

            const hanldeActiveVariableDateChange = (val, item) => {
                const _index = variablesData.value.findIndex(
                    (variable) => variable.key === item.key
                )
                variablesData.value[_index].value = val

                // item.value.value = val
            }
            const handleSelectInputChange = () => {}

            const onCheckAllOptions = (item, e) => {
                // debugger
                const _index = variablesData.value.findIndex(
                    (variable) => variable.key === item.key
                )
                if (!e?.target?.checked) {
                    variablesData.value[_index].value = []
                } else {
                    const allOptions = variablesData.value[_index].options.map(
                        (option) => option.value
                    )
                    variablesData.value[_index].value = allOptions
                }
            }
            const onCheckOption = (item, e) => {
                // debugger
                // const _index = variablesData.value.findIndex(
                //     (variable) => variable.key === item.key
                // )
                // if (!e?.target?.checked) {
                //     variablesData.value[_index].value = []
                // } else {
                //     const allOptions = variablesData.value[_index].options.map(
                //         (option) => option.value
                //     )
                //     variablesData.value[_index].value = allOptions
                // }
            }

            const handleSelectVariable = ({ key }, itemKey) => {
                // for single select dropdown
                const _index = variablesData.value.findIndex(
                    (variable) => variable.key === itemKey
                )
                variablesData.value[_index].value = key
            }

            return {
                variablesData,
                timeZoneAbbreviation,
                getAbbreviation,
                infoTabeState,
                format,
                _date,
                usersData,
                getDaysJsWrappedValue,
                hanldeActiveVariableDateChange,
                handleSelectInputChange,
                onCheckAllOptions,
                handleSelectVariable,
                onCheckOption,
            }
        },
    })
</script>
<style lang="less" scoped>
    .input::placeholder {
        @apply text-gray-400 !important;
    }
    .light-shadow {
        box-shadow: 0px 1px 0px 0px #0000000d;
    }
    .custom-grid {
        display: grid;
        grid-template-columns: repeat(
            auto-fill,
            minmax(300px, 1fr)
        ); /* see notes below */
        grid-gap: 40px;
        grid-row-gap: 20px;
    }
    .item {
        height: fit-content;
    }
</style>
<style lang="less" module>
    .multi_select {
        :global(.ant-select-selector) {
            max-height: 80px !important;
            overflow: scroll !important;
        }
    }
    .error_select {
        :global(.ant-select-selector) {
            // @apply border-red-300;
            border-color: rgb(252, 165, 165) !important;
            max-height: 80px !important;
            overflow: scroll !important;
        }
    }
    .checkbox_style {
        :global(.ant-checkbox-inner::after) {
            width: 4px !important;
            height: 7px !important;
        }
        :global(.ant-checkbox-inner) {
            width: 13px !important;
            height: 13.5px !important;
        }
        :global(.ant-checkbox + span) {
            @apply px-1 !important;
        }
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
