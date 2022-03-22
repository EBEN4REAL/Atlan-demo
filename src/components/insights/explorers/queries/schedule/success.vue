<template>
    <div class="w-full h-full p-6 bg-white" style="min-height: 430px">
        <div class="mb-1">
            <span class="" style="font-size: 40px">👏</span>
        </div>
        <div class="mb-4">
            <p class="mb-1 text-xl font-bold text-gray-700">
                Query successfully scheduled
            </p>
            <p class="text-gray-500" style="font-size: 16px">
                The output will be shared as a CSV attachment
            </p>
        </div>
        <div class="p-3 mb-4 border border-gray-300 rounded light-shadow">
            <div class="flex items-center justify-between mb-3">
                <p class="font-bold text-gray-700" style="font-size: 16px">
                    Schedule
                </p>

                <AtlanButton
                    color="light"
                    @click="runWorkFlow"
                    class="h-8 px-5 py-0 bg-white border-none text-primary"
                    :disabled="
                        !isWorkflowTemplateFetched || isScheduleWorkFlowLoading
                    "
                >
                    <div class="text-primary">
                        <AtlanIcon icon="Play" class="w-4 h-4 mr-1.5 -mt-0.5" />
                        <span class="text-sm">Run Now</span>
                    </div>
                </AtlanButton>
            </div>
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
                    {{ _date?.format('hh:MM A') }}
                    {{ getAbbreviation(timeZoneAbbreviation) }}
                    <span class="capitalize">{{
                        infoTabeState.frequency
                    }}</span>
                </p>
            </div>
        </div>
        <div
            class="p-3 border border-gray-300 rounded light-shadow"
            v-if="variablesData?.length > 0"
        >
            <div class="flex items-center mb-3">
                <p class="font-bold text-gray-700" style="font-size: 16px">
                    Variables
                </p>
            </div>
            <div
                class="flex flex-wrap items-center mb-2 overflow-y-auto text-gray-500 gap-y-2"
                style="height: 52px"
            >
                <template v-for="item in variablesData" :key="item.key">
                    <div
                        style="flex: 0.5; min-width: 280px"
                        class="flex items-center"
                    >
                        <AtlanIcon
                            :icon="getVariableIcon(item.type)"
                            class="h-4 mr-2 w-4 -mt-0.5"
                        />
                        <span>{{ item.name }} -</span>
                        <p class="text-sm text-gray-500">
                            <span
                                class="font-bold"
                                v-if="typeof item.value === 'object'"
                                >&nbsp; {{ item.value.join(',') }}
                            </span>
                            <span class="font-bold" v-else
                                >&nbsp;
                                {{ getVariableValue(item.value, item.type) }}
                            </span>
                        </p>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs } from 'vue'
    import parser from 'cron-parser'
    import dayjs from 'dayjs'

    export default defineComponent({
        components: {},
        props: {
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
            isWorkflowTemplateFetched: {
                type: Boolean,
                required: true,
            },
            isScheduleWorkFlowLoading: {
                type: Boolean,
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
        emits: ['runWorkFlow'],
        setup(props, { emit }) {
            const {
                variablesData,
                usersData,
                cronData,
                infoTabeState,
                isScheduleWorkFlowLoading,
                isWorkflowTemplateFetched,
            } = toRefs(props)
            debugger
            const interval = parser.parseExpression(cronData.value.cron)

            const _date = dayjs(interval.next().toString())
            console.log(_date.toString())
            const parsedDate = new Date(_date.toString())
            const timeZoneAbbreviation = String(
                String(parsedDate).split('(')[1]
            ).split(')')[0]

            function getAbbreviation(str: string = '') {
                return str.match(/\b([A-Z])/g).join('')
            }

            const getVariableIcon = (type: string) => {
                switch (type) {
                    case 'number': {
                        return 'Number'
                    }
                    case 'date': {
                        return 'DateTime'
                    }
                    default: {
                        return 'String'
                    }
                }
            }
            const getVariableValue = (value: any, type: string) => {
                switch (type) {
                    case 'number': {
                        return value
                    }
                    case 'date': {
                        return dayjs(value).format('YYYY/DD/MM')
                    }
                    default: {
                        return value
                    }
                }
            }

            const runWorkFlow = () => {
                emit('runWorkFlow')
            }

            const format = 'MMM DD, dddd, hh:mm A'
            return {
                format,
                _date,
                usersData,
                variablesData,
                timeZoneAbbreviation,
                getAbbreviation,
                infoTabeState,
                getVariableIcon,
                getVariableValue,
                isScheduleWorkFlowLoading,
                isWorkflowTemplateFetched,
                runWorkFlow,
                parsedDate,
            }
        },
    })
</script>
<style lang="less" scoped>
    .placeholder {
        background-color: #f4f4f4;
    }
    .light-shadow {
        box-shadow: 0px 1px 0px 0px #0000000d;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
