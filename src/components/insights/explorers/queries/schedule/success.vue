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
                <div class="text-primary">
                    <AtlanIcon icon="Play" class="w-4 h-4 mr-1.5" />
                    <span class="text-sm">Run Now</span>
                </div>
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
            v-if="variablesData?.length > 0 && false"
        >
            <div class="flex items-center mb-3">
                <p class="font-bold text-gray-700" style="font-size: 16px">
                    Variables
                </p>
            </div>
            <div class="flex items-center mb-2 text-gray-500">
                <AtlanIcon icon="String" class="h-4 mr-2 w-4 -mt-0.5" />
                <span>Customer name - </span>
                <p class="text-sm text-gray-500">
                    <span class="font-bold">&nbsp; Xyz Inc, Acme Inc</span>
                </p>
            </div>
            <div class="flex items-center text-gray-500">
                <AtlanIcon icon="DateTime" class="h-4 mr-2 w-4 -mt-0.5" />
                <span>Date - </span>
                <p class="text-sm text-gray-500">
                    <span class="font-bold">&nbsp; 2019/20/11</span>
                </p>
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
            const { variablesData, usersData, cronData, infoTabeState } =
                toRefs(props)
            const interval = parser.parseExpression(cronData.value.cron)

            const _date = dayjs(interval.next().toString())
            const parsedDate = new Date(_date.toString())
            const timeZoneAbbreviation = String(
                String(parsedDate).split('(')[1]
            ).split(')')[0]

            function getAbbreviation(str: string = '') {
                return str.match(/\b([A-Z])/g).join('')
            }

            const format = 'MMM DD, dddd, hh:MM A'
            return {
                format,
                _date,
                usersData,
                variablesData,
                timeZoneAbbreviation,
                getAbbreviation,
                infoTabeState,
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
