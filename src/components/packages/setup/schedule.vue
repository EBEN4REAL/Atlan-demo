<template>
    <a-form layout="vertical">
        <div class="grid grid-cols-12 gap-x-4">
            <div class="col-span-4">
                <a-form-item label="Schedule" class="mb-2">
                    <Frequency
                        v-model="schedule.frequency"
                        placeholder="None"
                    ></Frequency>
                </a-form-item>
            </div>
            <div class="col-span-8" v-if="schedule.frequency">
                <a-form-item label="Time Zone" class="mb-2">
                    <Timezone
                        v-model="schedule.timezone"
                        placeholder=""
                    ></Timezone>
                </a-form-item>
            </div>
        </div>
        <div class="grid grid-cols-12 gap-x-4">
            <div
                class="col-span-4"
                v-if="['monthly'].includes(schedule.frequency)"
            >
                <a-form-item label="Date" class="mb-2">
                    <Date v-model="schedule.date" placeholder=""> </Date>
                </a-form-item>
            </div>
            <div
                class="col-span-3"
                v-if="['weekly'].includes(schedule.frequency)"
            >
                <a-form-item label="Day" class="mb-2">
                    <Day v-model="schedule.dayOfWeek" placeholder=""></Day>
                </a-form-item>
            </div>
            <div class="col-span-4" v-if="schedule.frequency">
                <a-form-item label="Time" class="mb-2">
                    <a-time-picker
                        class="w-full"
                        format="HH:mm"
                        :showNow="false"
                        placeholder=""
                        valueFormat="HH:mm"
                        :minuteStep="15"
                        v-model:value="schedule.time"
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
                    {{ cron }}
                </div>

                <div class="text-gray-500">
                    {{ cronString }}
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
                default: () => ({ cron: '', timezone: '' }),
            },
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)

            const workflowTemplate = inject('workflowTemplate')

            const decodeCron = (interval) => {
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
            }

            const cron = ref('')
            let frequency = 'daily'
            let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
            const time = '00:30'

            if (
                workflowTemplate.metadata?.annotations[
                    'orchestration.atlan.com/schedule'
                ]
            ) {
                cron.value =
                    workflowTemplate.metadata?.annotations[
                        'orchestration.atlan.com/schedule'
                    ]
                const interval = parser.parseExpression(cron.value)
                frequency = decodeCron(interval)
                time = `${interval.fields.hour[0].toString()}:${interval.fields.minute[0].toString()}`
            }

            if (
                workflowTemplate?.metadata?.annotations[
                    'orchestration.atlan.com/timezone'
                ]
            ) {
                timezone =
                    workflowTemplate?.metadata?.annotations[
                        'orchestration.atlan.com/timezone'
                    ]
            }

            const schedule = reactive({
                frequency,
                timezone,
                time,
            })

            const cronString = ref('')
            // const graphRef = inject('graphRef')
            const buildCron = () => {
                cron.value = '* * * * *'
                const interval = parser.parseExpression(cron.value)
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
                } else if (schedule.frequency === 'daily') {
                    if (fields.hour.length === 24) {
                        fields.hour = [0]
                    }
                    if (fields.minute.length === 60) {
                        fields.minute = [0]
                    }
                    fields.dayOfWeek = [0, 1, 2, 3, 4, 5, 6, 7]
                } else if (schedule.frequency === 'weekly') {
                    if (fields.dayOfWeek.length === 8) {
                        fields.dayOfWeek = [1]
                    }
                    if (fields.hour.length === 24) {
                        fields.hour = [0]
                    }
                    if (fields.minute.length === 60) {
                        fields.minute = [0]
                    }
                } else if (schedule.frequency === 'monthly') {
                    if (fields.dayOfMonth.length === 31) {
                        fields.dayOfMonth = [1]
                    }
                    if (fields.hour.length === 24) {
                        fields.hour = [0]
                    }
                    if (fields.minute.length === 60) {
                        fields.minute = [0]
                    }
                }
                let modifiedInterval = parser.fieldsToExpression(fields)
                cron.value = modifiedInterval.stringify()
                cronString.value = cronstrue.toString(cron.value)
            }

            buildCron()

            watch(schedule, () => {
                buildCron()
                modelValue.value = {
                    timezone: schedule.timezone,
                    cron: cron.value,
                }
                emit('change')
            })

            return {
                schedule,
                cron,
                buildCron,
                cronString,
            }
        },
    })
</script>
