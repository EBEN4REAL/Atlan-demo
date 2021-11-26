<template>
    <a-modal
        :visible="visible"
        :footer="null"
        width="45vw"
        style="z-index: 600"
        @cancel="emit('cancel')"
    >
        <!--  -->
        <!-- List workflow schedules -->
        <!--  -->
        <div v-if="mode === 'list'" class="w-full p-4 bg-white rounded">
            <!-- Header -->
            <div class="mb-8">
                <span class="block w-full mb-1 text-lg font-bold">
                    Workflow Schedules
                </span>
                <span class="text-sm">List of schedules for this workflow</span>
            </div>
            <!-- Loader -->
            <a-spin
                v-if="isLoading"
                class="flex justify-center w-full my-10"
            ></a-spin>

            <!-- Empty state -->
            <div
                v-if="!isLoading && !data?.items?.length"
                class="mb-6 text-base"
            >
                <EmptyView
                    desc="No schedules found"
                    empty-screen="WFEmptyTab"
                    desc-class="w-56 text-center"
                    button-icon="ArrowRight"
                />
            </div>

            <!-- Search and Filter -->
            <SearchAndFilter
                v-if="!isLoading && data?.items?.length"
                class="mx-3 mt-2 mb-6"
                placeholder="Search schedules"
                :autofocus="true"
            >
                <template #filter> [ filter goes here ] </template>
            </SearchAndFilter>

            <!-- Schedules List -->
            <div
                v-if="!isLoading && data?.items?.length"
                class="mb-6 text-base"
            >
                <div
                    v-for="(s, index) in data.items"
                    :key="index"
                    class="flex items-center px-2 py-3 text-base cursor-pointer  hover:bg-primary-light"
                >
                    <div class="w-full mr-3">
                        <!-- Name -->
                        <div class="font-semibold">
                            {{ s.metadata.name }}
                        </div>
                        <!-- Info -->
                        <div class="flex items-center text-sm text-gray-500">
                            <a-tooltip placement="top">
                                <template #title>
                                    {{ getDays(s.spec.schedule) }}
                                </template>
                                <span class="capitalize">
                                    {{ s.metadata.labels.frequency }}
                                </span>
                            </a-tooltip>

                            <AtlanIcon
                                icon="Dot"
                                class="h-auto mx-2"
                            ></AtlanIcon>
                            <span
                                style="width: 22rem"
                                class="inline-block truncate"
                            >
                                Runs at {{ get12hr(s.spec.schedule) }} -
                                {{ getTimezone(s.spec.timezone) }}
                            </span>
                        </div>
                    </div>
                    <!-- Label -->
                    <div
                        class="flex items-center px-3 py-1 mr-3 border rounded-full "
                    >
                        <AtlanIcon
                            :icon="s.spec.suspend ? 'Pause' : 'RunSuccess'"
                            class="w-4 h-4 mr-2"
                        ></AtlanIcon>
                        <span class="inline-block mt-1 text-sm">
                            {{ s.spec.suspend ? 'Paused' : 'Active' }}
                        </span>
                    </div>
                    <!-- Popover controls -->
                    <div class="py-2 rounded outline-none hover:bg-gray-200">
                        <a-popover
                            placement="rightTop"
                            trigger="click"
                            class="outline-none"
                        >
                            <template #content>
                                <div
                                    class="px-4 py-2 cursor-pointer  hover:bg-primary-light"
                                    @click="setSuspend(s)"
                                >
                                    {{
                                        s.spec.suspend
                                            ? 'Activate schedule'
                                            : 'Pause schedule'
                                    }}
                                </div>
                                <div
                                    v-auth="access.UPDATE_WORKFLOW_SCHEDULES"
                                    class="px-4 py-2 cursor-pointer  hover:bg-primary-light"
                                    @click="setUpdate(s)"
                                >
                                    Edit
                                </div>
                                <div
                                    v-auth="access.DELETE_WORKFLOW_SCHEDULES"
                                    class="px-4 py-2 cursor-pointer  text-error hover:bg-primary-light"
                                    @click="onDeleteSchedule(s.metadata.name)"
                                >
                                    Delete
                                </div>
                            </template>
                            <AtlanIcon icon="KebabMenu"></AtlanIcon>
                        </a-popover>
                    </div>
                </div>
            </div>
            <!-- Footer CTA -->
            <div class="flex justify-end w-full">
                <a-button @click="emit('cancel')">Cancel</a-button>
                <a-button
                    v-auth="access.CREATE_WORKFLOW_SCHEDULES"
                    type="primary"
                    class="flex items-center justify-between ml-4"
                    @click="go('add')"
                >
                    Create New Schedule
                </a-button>
            </div>
        </div>

        <!--  -->
        <!-- Create workflow schedule -->
        <!--  -->
        <div v-else class="w-full p-4 bg-white rounded">
            <!-- Header -->
            <div class="mb-8 text-lg font-bold">
                {{
                    !selectedSchedule
                        ? 'Create workflow schedule'
                        : 'Edit workflow schedule'
                }}
            </div>

            <!-- Form -->
            <a-form
                ref="scheduleFormRef"
                :model="formState"
                :rules="formRules"
                layout="vertical"
            >
                <!-- Schedule name -->
                <div class="mb-6">
                    <a-form-item
                        ref="scheduleName"
                        label="Schedule Name"
                        name="scheduleName"
                    >
                        <a-input
                            v-model:value="formState.scheduleName"
                            placeholder="name-of-schedule"
                            :disabled="mode === 'update'"
                        />
                    </a-form-item>
                </div>

                <!-- Schedule Options -->
                <div class="flex">
                    <!-- Frequency -->
                    <div class="w-full mr-3">
                        <a-form-item label="Frequency">
                            <a-select
                                v-model:value="frequency"
                                class="w-full"
                                :options="frequencyOptions"
                                @change="onFrequencyChange"
                            >
                            </a-select>
                        </a-form-item>
                    </div>
                    <!-- Time -->
                    <div class="w-full mr-3">
                        <a-form-item
                            ref="time"
                            label="Run Start Time"
                            name="time"
                        >
                            <a-time-picker
                                v-model:value="formState.time"
                                use12-hours
                                class="w-full"
                                format="h:mm A"
                                value-format="HH:mm"
                            />
                        </a-form-item>
                    </div>
                    <!-- Timezone -->
                    <div class="w-full">
                        <a-form-item label="Time Zone">
                            <a-select
                                v-model:value="timezone"
                                class="w-full"
                                :options="timezonesOptions"
                                :show-search="true"
                            >
                            </a-select>
                        </a-form-item>
                    </div>
                </div>

                <!-- Schedule Days - if not daily -->
                <div v-if="frequency !== 'daily'" class="mb-6">
                    <label class="mb-2">Run on</label>
                    <div class="flex">
                        <div
                            v-for="(day, index) in daysOptions"
                            :key="index"
                            :class="{
                                selected: day.selected,
                            }"
                            class="day"
                            @click="selectDays([index], false)"
                        >
                            {{ day.value }}
                        </div>
                    </div>
                </div>

                <!-- Footer CTA -->
                <div class="flex items-center justify-between w-full">
                    <div>
                        <a-button
                            type="text"
                            class="text-gray-500"
                            @click="go('list')"
                            >Go back</a-button
                        >
                    </div>
                    <div class="flex">
                        <a-button @click="emit('cancel')">Cancel</a-button>
                        <a-button
                            v-auth="[
                                access.UPDATE_WORKFLOW_SCHEDULES,
                                access.CREATE_WORKFLOW_SCHEDULES,
                            ]"
                            type="primary"
                            class="flex items-center justify-between ml-4"
                            :loading="loadingSubmit"
                            @click="
                                !selectedSchedule
                                    ? onAddSchedule()
                                    : onUpdateSchedule()
                            "
                        >
                            {{
                                !selectedSchedule
                                    ? 'Schedule Workflow'
                                    : 'Update Schedule'
                            }}
                        </a-button>
                    </div>
                </div>
            </a-form>
        </div>
    </a-modal>
</template>

<script lang="ts">
    /** VUE */
    import {
        defineComponent,
        ref,
        computed,
        toRefs,
        UnwrapRef,
        reactive,
        watch,
    } from 'vue'

    /** MODULES */
    import dayjs from 'dayjs'
    import { message } from 'ant-design-vue'

    /** COMPONENTS */
    import EmptyView from '@common/empty/index.vue'
    import timezoneDayJs from 'dayjs/plugin/timezone'
    import utc from 'dayjs/plugin/utc'
    import SearchAndFilter from '@/common/input/searchAndFilter.vue'
    /** ASSETS */

    /** COMPOSABLES */
    import {
        useGetSchedules,
        useSchedule,
        useDeleteSchedule,
    } from '~/composables/workflow/useWorkflowList'

    /**  UTILS */
    import { timezones, formRules, frequencyOptions } from './scheduleUtils.js'

    import access from '~/constant/accessControl/map'

    dayjs.extend(utc)
    dayjs.extend(timezoneDayJs)

    /** TYPE DEF */
    interface FormState {
        scheduleName: string
        time: string
    }

    export default defineComponent({
        name: 'ScheduleModal',
        components: { SearchAndFilter, EmptyView },
        props: {
            visible: {
                type: Boolean,
                required: true,
            },
            workflowName: {
                type: String,
                required: true,
            },
        },
        emits: ['cancel'],
        setup(props, { emit }) {
            /** DATA */
            const { workflowName, visible } = toRefs(props)
            const mode = ref('list')
            const scheduleFormRef = ref()
            const selectedSchedule = ref()
            const loadingSubmit = ref(false)
            const suspend = ref(false)
            const frequency = ref('daily')
            const timezone = ref('Africa/Lagos')
            const timezonesOptions = computed(() => timezones)
            const formState: UnwrapRef<FormState> = reactive({
                scheduleName: '',
                time: '23:00',
            })
            const daysOptions = ref([
                { value: 'Mon', numValue: 1, selected: true },
                { value: 'Tue', numValue: 2, selected: true },
                { value: 'Wed', numValue: 3, selected: true },
                { value: 'Thur', numValue: 4, selected: true },
                { value: 'Fri', numValue: 5, selected: true },
                { value: 'Sat', numValue: 6, selected: true },
                { value: 'Sun', numValue: 0, selected: true },
            ])
            const schedule = computed(() => {
                const timeValue = formState?.time || '00:00'
                const [hour, minute] = timeValue.split(':')
                const daysOfWeek = daysOptions.value
                    .filter((x) => x.selected)
                    .map((x) => x.numValue)
                    .join(',')
                return `${minute} ${hour} * * ${daysOfWeek}`
            })
            const bodyParams = computed(() => ({
                scheduleName: formState.scheduleName,
                scheduleNameForUpdate: selectedSchedule?.value?.metadata?.name,
                workflowName: workflowName.value,
                schedule: schedule.value,
                timezone: timezone.value,
                suspend: suspend.value,
                frequency: frequency.value,
                resourceVersion:
                    selectedSchedule?.value?.metadata?.resourceVersion,
            }))

            /** Methods */
            // useGetSchedules
            const { data, isLoading, mutate } = useGetSchedules(workflowName)

            // selectDays
            const selectDays = (
                indexes = [0, 1, 2, 3, 4, 5, 6],
                batch = true
            ) => {
                if (batch || (frequency.value === 'weekly' && !batch))
                    daysOptions.value.forEach((x, index) => {
                        daysOptions.value[index].selected = false
                    })
                else if (
                    ['weekdays', 'weekends'].includes(frequency.value) &&
                    !batch
                )
                    frequency.value = 'custom'

                indexes.forEach((x) => {
                    daysOptions.value[x].selected = batch
                        ? true
                        : !daysOptions.value[x].selected
                })
            }

            // get12hr
            const get12hr = (x) => {
                const [minute, hour] = x.split(' ')
                const t12 = dayjs(`1/1/1 ${hour}:${minute}`).format('h:mm A')
                return t12
            }

            // get24hr
            const get24hr = (x) => {
                const t12 = get12hr(x)
                const t24 = dayjs(`1/1/1 ${t12}`)
                return `${t24.hour()}:${t24.minute()}`
            }

            // getTimezone
            const getTimezone = (x) => {
                const tz = timezonesOptions.value.filter(
                    (y) => y.value === x
                )[0].label
                return tz
            }

            // getDays
            const getDays = (x) => {
                const days = x.split(' ')[4].split(',')
                const daysArr = []
                days.forEach((y) => {
                    daysOptions.value.forEach((z) => {
                        if (Number(y) === z.numValue) daysArr.push(z.value)
                    })
                })
                return daysArr.join(', ')
            }

            // go
            const go = (m, s = '') => {
                mode.value = m
                if (['add', 'list'].includes(m)) {
                    const timeZoneUser = dayjs.tz.guess()
                    suspend.value = false
                    formState.scheduleName = ''
                    formState.time = '23:00'
                    frequency.value = 'daily'
                    timezone.value = timeZoneUser
                    selectedSchedule.value = ''
                    selectDays()
                } else if (m === 'update') selectedSchedule.value = s
            }

            // setState
            const setState = (item, setSuspend = false) => {
                suspend.value = setSuspend
                    ? !item.spec.suspend
                    : item.spec.suspend || false
                formState.scheduleName = item.metadata.name
                formState.time = get24hr(item.spec.schedule)
                frequency.value = item.metadata.labels.frequency
                timezone.value = item.spec.timezone

                const days = item.spec.schedule.split(' ')[4]
                const daysArr = days.split(',')
                const daysArrFix = daysArr.map((x) => {
                    if (x !== '0') return Number(x) - 1
                    return 6
                })
                selectDays(daysArrFix, true)
            }

            // setUpdate
            const setUpdate = (item) => {
                go('update', item)
                setState(item)
            }

            // setSuspend
            const setSuspend = (item) => {
                selectedSchedule.value = item
                message.loading({
                    content: 'Loading',
                    duration: 100,
                    key: 'setSuspend',
                })
                setState(item, true)
                // eslint-disable-next-line no-use-before-define
                onUpdateSchedule(true)
            }

            // onFrequencyChange
            const onFrequencyChange = (value) => {
                if (value === 'daily') selectDays()
                else if (value === 'weekly') selectDays([2])
                else if (value === 'weekdays') selectDays([0, 1, 2, 3, 4])
                else if (value === 'weekends') selectDays([5, 6])
                else if (value === 'custom') selectDays([1, 3])
            }

            // onDeleteSchedule
            const onDeleteSchedule = (scheduleName) => {
                message.loading({
                    content: 'Deleting Schedule',
                    duration: 100,
                    key: 'onDeleteSchedule',
                })
                const { isReady: i, error: e } = useDeleteSchedule(scheduleName)
                watch([i, e], ([x, y]) => {
                    if (x) {
                        message.success({
                            content: 'Schedule Deleted',
                            duration: 2,
                            key: 'onDeleteSchedule',
                        })
                        mutate()
                    }

                    if (y)
                        message.error({
                            content: 'An error occured',
                            duration: 2,
                            key: 'onDeleteSchedule',
                        })
                })
            }

            // onAddSchedule
            const onAddSchedule = async () => {
                loadingSubmit.value = true
                await scheduleFormRef.value.validate()
                const { isReady: i, error: e } = useSchedule('add', bodyParams)
                watch([i, e], ([x, y]) => {
                    if (x) {
                        loadingSubmit.value = false
                        message.success({
                            content: 'Schedule added',
                            duration: 3,
                        })
                        mutate()
                        mode.value = 'list'
                    }
                    if (y) {
                        loadingSubmit.value = false
                        message.error({
                            content: 'An error occurred',
                            duration: 3,
                        })
                    }
                })
            }

            // onUpdateSchedule
            const onUpdateSchedule = async (isSetSuspend = false) => {
                if (!isSetSuspend) {
                    loadingSubmit.value = true
                    await scheduleFormRef.value.validate()
                }

                const { isReady: i, error: e } = useSchedule(
                    'update',
                    bodyParams
                )
                watch([i, e], ([x, y]) => {
                    if (x) {
                        if (!isSetSuspend) loadingSubmit.value = false
                        message.destroy()
                        message.success({
                            content: 'Schedule updated',
                            duration: 3,
                        })

                        mutate()
                        mode.value = 'list'
                    }
                    if (y) {
                        if (!isSetSuspend) loadingSubmit.value = false
                        message.destroy()
                        message.error({
                            content: 'An error occurred',
                            duration: 3,
                        })
                    }
                })
            }

            /** Watchers */
            watch(mode, (x) => {
                if (x === 'list') selectedSchedule.value = ''
            })

            return {
                access,
                emit,
                selectDays,
                onFrequencyChange,
                onAddSchedule,
                onUpdateSchedule,
                onDeleteSchedule,
                getDays,
                get12hr,
                getTimezone,
                go,
                setSuspend,
                setUpdate,
                data,
                isLoading,
                // isReady,
                mode,
                formState,
                formRules,
                scheduleFormRef,
                daysOptions,
                frequency,
                frequencyOptions,
                timezone,
                timezonesOptions,
                bodyParams,
                loadingSubmit,
                selectedSchedule,
            }
        },
    })
</script>

<style lang="less" scoped>
    .day {
        @apply flex-1 w-full px-4 py-1 text-center cursor-pointer border border-l-0 overflow-hidden;

        &:first-child {
            @apply rounded-l border-l !important;
        }

        &:last-child {
            @apply rounded-r border-r !important;
        }

        &.selected {
            @apply bg-primary text-white border-primary border-r !important;
            border-right-color: #c8d3f3 !important;

            &:last-child {
                @apply border-r-0 !important;
            }
        }
    }
</style>
