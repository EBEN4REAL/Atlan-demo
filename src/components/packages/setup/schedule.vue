<template>
    <a-form layout="vertical">
        <div class="grid grid-cols-12 gap-x-4">
            <div class="col-span-4">
                <a-form-item label="Schedule" class="mb-2">
                    <Frequency
                        v-model="schedule.frequency"
                        placeholder="None"
                        @change="handleChangeFrequency"
                    ></Frequency>
                </a-form-item>
            </div>
            <div class="col-span-8" v-if="schedule.frequency">
                <a-form-item label="Time Zone" class="mb-2">
                    <Timezone
                        v-model="localModel.timezone"
                        placeholder=""
                        @change="buildCron"
                    ></Timezone>
                </a-form-item>
            </div>
        </div>
        <div class="grid grid-cols-12 gap-x-4">
            <div
                class="col-span-3"
                v-if="['monthly'].includes(schedule.frequency)"
            >
                <a-form-item label="Date" class="mb-2">
                    <Date
                        v-model="schedule.date"
                        placeholder=""
                        @change="buildCron"
                    >
                    </Date>
                </a-form-item>
            </div>
            <div
                class="col-span-4"
                v-if="['weekly'].includes(schedule.frequency)"
            >
                <a-form-item label="Day" class="mb-2">
                    <Day
                        v-model="schedule.dayOfWeek"
                        placeholder=""
                        @change="buildCron"
                    ></Day>
                </a-form-item>
            </div>
            <div
                class="col-span-4"
                v-if="
                    !['hourly'].includes(schedule.frequency) &&
                    schedule.frequency
                "
            >
                <a-form-item label="Time" class="mb-2">
                    <a-time-picker
                        class="w-full"
                        format="HH:mm"
                        :showNow="false"
                        placeholder=""
                        valueFormat="HH:mm"
                        :minuteStep="15"
                        v-model:value="schedule.time"
                        @change="buildCron"
                    />
                </a-form-item>
            </div>
        </div>
        <div class="flex items-center mt-3">
            <div
                class="flex flex-col w-full p-3 bg-gray-100 border rounded"
                v-if="schedule.frequency"
            >
                <div class="text-gray-500">
                    {{ localModel.cron }}
                </div>

                <div class="text-gray-500">
                    {{ cronStringReadable }}
                </div>
            </div>
            <div
                class="flex flex-col w-full p-3 bg-gray-100 border rounded"
                v-else
            >
                <div class="text-gray-500">No schedule selected</div>
            </div>
        </div>
    </a-form>
</template>

<script lang="ts">
    // Vue
    import {
        computed,
        defineComponent,
        ref,
        watch,
        reactive,
        onMounted,
        inject,
    } from 'vue'
    import parser from 'cron-parser'
    import Timezone from '~/components/common/select/timezone.vue'
    import Frequency from '~/components/common/select/frequency.vue'
    import Day from '~/components/common/select/day.vue'
    import Date from '~/components/common/select/date.vue'
    import cronstrue from 'cronstrue'
    import { useVModels } from '@vueuse/core'

    export default defineComponent({
        name: 'WorkflowSetupTab',
        components: { Timezone, Frequency, Day, Date },
        props: {
            modelValue: {
                type: Object,
                default: () => ({
                    cron: '',
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                }),
            },
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)

            const localModel = reactive(modelValue.value)
            if (!localModel.timezone) {
                localModel.timezone =
                    Intl.DateTimeFormat().resolvedOptions().timeZone
            }
            if (!localModel.cron) {
                localModel.cron = '0 0 * * *'
            }

            const getCronFrequency = (cronString) => {
                const interval = parser.parseExpression(cronString)

                console.log(interval)

                if (
                    interval.fields.hour.length === 24 &&
                    interval.fields.dayOfMonth.length === 31 &&
                    interval.fields.dayOfWeek.length === 8 &&
                    interval.fields.month.length === 12
                ) {
                    return 'hourly'
                }

                if (
                    interval.fields.dayOfMonth.length === 31 &&
                    interval.fields.dayOfWeek.length === 8 &&
                    interval.fields.month.length === 12
                ) {
                    return 'daily'
                }
                if (
                    interval.fields.dayOfMonth.length === 31 &&
                    interval.fields.dayOfWeek.join(',') ===
                        [1, 2, 3, 4, 5].join(',') &&
                    interval.fields.month.length === 12
                ) {
                    return 'weekdays'
                }
                if (
                    interval.fields.dayOfMonth.length === 31 &&
                    interval.fields.dayOfWeek.join(',') === [0, 6].join(',') &&
                    interval.fields.month.length === 12
                ) {
                    return 'weekend'
                }
                if (
                    interval.fields.dayOfMonth.length === 1 &&
                    interval.fields.dayOfWeek.length === 8 &&
                    interval.fields.month.length === 12
                ) {
                    return 'monthly'
                }
                return ''
            }

            const cronStringReadable = ref('')
            let frequency = ''
            let time = ''
            let dayOfWeek = ''
            let date = ''
            if (localModel.cron) {
                frequency = getCronFrequency(localModel.cron)
                const interval = parser.parseExpression(localModel.cron)
                time = `${interval.fields.hour[0].toString()}:${interval.fields.minute[0].toString()}`
                if (interval.fields.dayOfWeek.length === 1) {
                    dayOfWeek = interval.fields.dayOfWeek[0].toString()
                }
                if (interval.fields.dayOfMonth.length === 1) {
                    date = interval.fields.dayOfMonth[0].toString()
                }
                cronStringReadable.value = cronstrue.toString(localModel.cron)
            }

            const schedule = reactive({
                frequency,
                time,
                date,
                dayOfWeek,
            })

            const handleChangeFrequency = () => {
                if (schedule.frequency === 'hourly') {
                    schedule.time = ''

                    schedule.date = ''
                    schedule.dayOfWeek = ''
                }
                if (schedule.frequency === 'daily') {
                    if (!schedule.time) {
                        schedule.time = '00:30'
                    }
                    schedule.date = ''
                    schedule.dayOfWeek = ''
                }
                if (schedule.frequency === 'weekdays') {
                    if (!schedule.time) {
                        schedule.time = '00:30'
                    }
                    schedule.date = ''
                    schedule.dayOfWeek = ''
                }
                if (schedule.frequency === 'weekends') {
                    schedule.time = '00:30'
                    schedule.date = ''
                    schedule.dayOfWeek = ''
                }
                if (schedule.frequency === 'weekly') {
                    schedule.time = '00:30'
                    schedule.date = ''
                    if (!schedule.dayOfWeek) {
                        schedule.dayOfWeek = '1'
                    }
                }
                if (schedule.frequency === 'monthly') {
                    schedule.time = '00:30'
                    if (!schedule.date) {
                        schedule.date = '1'
                    }
                    schedule.dayOfWeek = ''
                }
                buildCron()
            }

            // const graphRef = inject('graphRef')
            const buildCron = () => {
                const interval = parser.parseExpression('* * * * *')
                const fields = JSON.parse(JSON.stringify(interval.fields))

                if (schedule.time) {
                    fields.hour = [parseInt(schedule.time.split(':')[0])]
                    fields.minute = [parseInt(schedule.time.split(':')[1])]
                }

                if (schedule.dayOfWeek) {
                    fields.dayOfWeek = [parseInt(schedule.dayOfWeek)]
                }
                if (schedule.date) {
                    fields.dayOfMonth = [parseInt(schedule.date)]
                }

                if (schedule.frequency === 'weekdays') {
                    fields.dayOfWeek = [1, 2, 3, 4, 5]
                    if (fields.hour.length === 24) {
                        fields.hour = [0]
                    }
                    if (fields.minute.length === 60) {
                        fields.minute = [0]
                    }
                } else if (schedule.frequency === 'weekends') {
                    fields.dayOfWeek = [6, 7]

                    if (fields.hour.length === 24) {
                        fields.hour = [0]
                    }
                    if (fields.minute.length === 60) {
                        fields.minute = [0]
                    }
                } else if (schedule.frequency === 'hourly') {
                    fields.hour = [
                        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
                        16, 17, 18, 19, 20, 21, 22, 23,
                    ]
                    fields.minute = [0]
                }

                let modifiedInterval = parser.fieldsToExpression(fields)
                localModel.cron = modifiedInterval.stringify()
                cronStringReadable.value = cronstrue.toString(localModel.cron)
            }

            // watch(schedule, () => {
            //     // buildCron()
            //     modelValue.value = localModel
            //     emit('change')
            // })

            return {
                schedule,
                buildCron,
                cronStringReadable,
                getCronFrequency,
                localModel,
                handleChangeFrequency,
            }
        },
    })
</script>
