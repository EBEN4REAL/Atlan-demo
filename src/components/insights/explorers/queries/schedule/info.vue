<template>
    <div class="w-full h-full p-6 bg-white" style="min-height: 430px">
        <div class="relative mb-12">
            <p class="mb-1 font-bold text-gray-500 required">Name</p>
            <a-input
                @blur="onNameBlur"
                :ref="
                    (el) => {
                        nameRef = el
                    }
                "
                v-model:value="infoTabeState.name"
                class="input"
                placeholder="Enter a name for your report"
            />
            <p
                class="mt-0.5 text-red-500 absolute -bottom-8"
                v-if="rules.name.show"
            >
                {{ rules.name.text }}
            </p>
        </div>
        <div class="flex flex-wrap mb-12">
            <div class="mr-4 item-1">
                <p class="mb-1 font-bold text-gray-500 required">
                    Refresh frequency
                </p>
                <Frequency
                    v-model="infoTabeState.frequency"
                    placeholder="None"
                    @change="handleChangeFrequency"
                    :allowClear="false"
                ></Frequency>
            </div>
            <div
                class="mr-4 item-2"
                v-if="
                    !['hourly'].includes(infoTabeState.frequency) &&
                    infoTabeState.frequency
                "
            >
                <p class="mb-1 font-bold text-gray-500 required">Run Time</p>
                <a-time-picker
                    class="w-full"
                    format="HH:mm"
                    :showNow="false"
                    placeholder=""
                    valueFormat="HH:mm"
                    :allowClear="false"
                    :minuteStep="15"
                    v-model:value="infoTabeState.time"
                    @change="buildCron"
                />
            </div>
            <div class="item-3">
                <p class="mb-1 font-bold text-gray-500 required">Timezone</p>
                <Timezone
                    v-model="infoTabeState.timezone"
                    placeholder=""
                    @change="buildCron"
                    :allowClear="false"
                ></Timezone>
            </div>
            <div
                class="mt-4 item-5"
                v-if="['monthly'].includes(infoTabeState.frequency)"
            >
                <p class="mb-1 font-bold text-gray-500 required">Date</p>
                <Date
                    v-model="infoTabeState.date"
                    placeholder=""
                    @change="buildCron"
                    :allowClear="false"
                >
                </Date>
            </div>
            <div
                class="mt-4 item-5"
                v-if="['weekly'].includes(infoTabeState.frequency)"
            >
                <p class="mb-1 font-bold text-gray-500 required">Day</p>
                <Day
                    v-model="infoTabeState.dayOfWeek"
                    placeholder=""
                    @change="buildCron"
                    :allowClear="false"
                ></Day>
            </div>
        </div>
        <div class="flex items-center justify-between mb-5 text-sm">
            <div class="w-full">
                <p class="mb-1 font-bold text-gray-500 required">
                    Share Results
                </p>
                <p class="pb-2 text-gray-400 border-b border-gray-200">
                    Data will be sent as an attachment email
                </p>
            </div>
            <!-- <div>
                <AtlanIcon icon="Mail" />
            </div> -->
        </div>
        <div class="text-sm text-gray-700">
            <div class="flex flex-wrap items-center gap-y-2 gap-x-1">
                <a-button
                    shape="circle"
                    size="small"
                    class="mr-2 text-center shadow"
                    :class="{
                        editPermission:
                            'hover:bg-primary-light hover:border-primary',
                    }"
                    @click="() => (isUserEdit = true)"
                >
                    <span><AtlanIcon icon="Add" class="h-3.5"></AtlanIcon></span
                ></a-button>
                <a-popover
                    v-model:visible="isUserEdit"
                    :overlay-class-name="$style.ownerPopover"
                    :trigger="['click']"
                    placement="right"
                    :destroy-tooltip-on-hide="true"
                    @visibleChange="handleVisibleChange"
                >
                    <template #content>
                        <div class="">
                            <OwnerFacets
                                ref="ownerInputRef"
                                v-model="usersData"
                                :show-none="false"
                                :enableTabs="'users'"
                                :hideDisabledTabs="true"
                            ></OwnerFacets>
                        </div>
                    </template>
                </a-popover>
                <template
                    v-for="username in usersData?.ownerUsers"
                    :key="username"
                >
                    <PopOverUser :item="username">
                        <UserPill
                            :username="username"
                            :allow-delete="true"
                            :enable-hover="true"
                            @delete="handleDeleteUser"
                            @click="handleClickUser(username)"
                        ></UserPill>
                    </PopOverUser>
                </template>
                <p
                    class="mt-0.5"
                    v-if="totalUsersCount === 0 && !rules.users.show"
                >
                    Add users
                </p>
                <p
                    class="mt-0.5 text-red-500"
                    v-if="totalUsersCount === 0 && rules.users.show"
                >
                    {{ rules.users.text }}
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        onMounted,
        nextTick,
        computed,
        PropType,
    } from 'vue'
    import Frequency from '~/components/common/select/frequency.vue'
    import Timezone from '~/components/common/select/timezone.vue'
    import OwnerFacets from '@/common/facet/owners/index.vue'
    import { useUserPreview } from '~/composables/user/showUserPreview'
    import { useGroupPreview } from '~/composables/group/showGroupPreview'
    import { useVModels } from '@vueuse/core'

    import PopOverUser from '@/common/popover/user/user.vue'
    import UserPill from '@/common/pills/user.vue'
    import GroupPill from '@/common/pills/group.vue'
    import Day from '~/components/common/select/day.vue'
    import Date from '~/components/common/select/date.vue'
    import parser from 'cron-parser'
    import cronstrue from 'cronstrue'

    export default defineComponent({
        name: 'Schedule Query Body',
        components: {
            Frequency,
            Timezone,
            OwnerFacets,
            PopOverUser,
            UserPill,
            GroupPill,
            Day,
            Date,
        },
        props: {
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
            cronStringReadable: {
                type: String,
                required: true,
            },
            rules: {
                type: Object as PropType<{
                    [key: string]: { text: string; show: boolean }
                }>,
                required: true,
            },
        },
        setup(props) {
            const {
                infoTabeState,
                usersData,
                cronData,
                cronStringReadable,
                rules,
            } = useVModels(props)
            const nameRef = ref()
            const isUserEdit = ref(false)

            const totalUsersCount = computed(
                () =>
                    usersData.value.ownerUsers?.length ??
                    0 + usersData.value.ownerGroups?.length ??
                    0
            )

            const onNameBlur = () => {
                if (!infoTabeState.value.name) rules.value.name.show = true
                else rules.value.name.show = false
            }

            onMounted(async () => {
                await nextTick()
                nameRef.value?.focus()
            })

            const handleVisibleChange = () => {}
            const { showUserPreview, setUserUniqueAttribute } = useUserPreview()
            const { showGroupPreview, setGroupUniqueAttribute } =
                useGroupPreview()

            const handleClickUser = (username: string) => {
                setUserUniqueAttribute(username, 'username')
                showUserPreview({
                    allowed: ['about', 'assets', 'groups', 'Integrations'],
                })
            }
            const handleClickGroup = (groupAlias: string) => {
                setGroupUniqueAttribute(groupAlias, 'groupAlias')
                showGroupPreview({ allowed: ['about', 'assets', 'members'] })
            }

            const handleDeleteUser = (username) => {
                usersData.value.ownerUsers = usersData.value?.ownerUsers.filter(
                    (item) => item !== username
                )
            }
            const handleDeleteGroup = (name) => {
                usersData.value.ownerGroups =
                    usersData.value?.ownerGroups.filter((item) => item !== name)
            }

            const buildCron = () => {
                debugger
                const interval = parser.parseExpression('* * * * *')
                const fields = JSON.parse(JSON.stringify(interval.fields))

                if (
                    infoTabeState.value.time &&
                    !['hourly'].includes(infoTabeState.value.frequency) &&
                    infoTabeState.value.frequency
                ) {
                    fields.hour = [
                        parseInt(infoTabeState.value.time.split(':')[0]),
                    ]
                    fields.minute = [
                        parseInt(infoTabeState.value.time.split(':')[1]),
                    ]
                }

                if (
                    infoTabeState.value.dayOfWeek &&
                    ['weekly'].includes(infoTabeState.value.frequency)
                ) {
                    fields.dayOfWeek = [parseInt(infoTabeState.value.dayOfWeek)]
                }
                if (
                    infoTabeState.value.date &&
                    ['monthly'].includes(infoTabeState.value.frequency)
                ) {
                    fields.dayOfMonth = [parseInt(infoTabeState.value.date)]
                }

                if (infoTabeState.value.frequency === 'weekdays') {
                    fields.dayOfWeek = [1, 2, 3, 4, 5]
                    if (fields.hour.length === 24) {
                        fields.hour = [0]
                    }
                    if (fields.minute.length === 60) {
                        fields.minute = [0]
                    }
                } else if (infoTabeState.value.frequency === 'weekends') {
                    fields.dayOfWeek = [6, 7]

                    if (fields.hour.length === 24) {
                        fields.hour = [0]
                    }
                    if (fields.minute.length === 60) {
                        fields.minute = [0]
                    }
                } else if (infoTabeState.value.frequency === 'hourly') {
                    fields.hour = [
                        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
                        16, 17, 18, 19, 20, 21, 22, 23,
                    ]
                    fields.minute = [0]
                }

                let modifiedInterval = parser.fieldsToExpression(fields)
                cronData.value.cron = modifiedInterval.stringify()
                cronStringReadable.value = cronstrue.toString(
                    cronData.value.cron
                )
                console.log(cronData.value.cron, cronStringReadable.value)
            }

            const handleChangeFrequency = () => {
                if (infoTabeState.value.frequency === 'hourly') {
                    infoTabeState.value.time = ''

                    infoTabeState.value.date = ''
                    infoTabeState.value.dayOfWeek = ''
                }
                if (infoTabeState.value.frequency === 'daily') {
                    if (!infoTabeState.value.time) {
                        infoTabeState.value.time = '00:30'
                    }
                    infoTabeState.value.date = ''
                    infoTabeState.value.dayOfWeek = ''
                }
                if (infoTabeState.value.frequency === 'weekdays') {
                    if (!infoTabeState.value.time) {
                        infoTabeState.value.time = '00:30'
                    }
                    infoTabeState.value.date = ''
                    infoTabeState.value.dayOfWeek = ''
                }
                if (infoTabeState.value.frequency === 'weekends') {
                    infoTabeState.value.time = '00:30'
                    infoTabeState.value.date = ''
                    infoTabeState.value.dayOfWeek = ''
                }
                if (infoTabeState.value.frequency === 'weekly') {
                    infoTabeState.value.time = '00:30'
                    infoTabeState.value.date = ''
                    if (!infoTabeState.value.dayOfWeek) {
                        infoTabeState.value.dayOfWeek = '1'
                    }
                }
                if (infoTabeState.value.frequency === 'monthly') {
                    infoTabeState.value.time = '00:30'
                    if (!infoTabeState.value.date) {
                        infoTabeState.value.date = '1'
                    }
                    infoTabeState.value.dayOfWeek = ''
                }
                buildCron()
            }
            buildCron()

            return {
                rules,
                buildCron,
                handleChangeFrequency,
                totalUsersCount,
                isUserEdit,
                infoTabeState,
                onNameBlur,
                nameRef,
                handleVisibleChange,
                handleClickGroup,
                handleClickUser,
                usersData,
                handleDeleteUser,
                handleDeleteGroup,
            }
        },
    })
</script>
<style lang="less" scoped>
    .required:after {
        content: ' *';
        color: red;
    }
    .input::placeholder {
        @apply text-gray-400 !important;
    }
    .item-1 {
        min-width: 230px;
    }
    .item-2 {
        min-width: 158px;
    }
    .item-3 {
        min-width: 230px;
    }
    .item-4 {
        min-width: 158px;
    }
    .item-5 {
        min-width: 230px;
    }
</style>
<style module lang="less">
    .ownerPopover {
        :global(.ant-popover-inner-content) {
            @apply px-0 py-3 !important;
            width: 250px !important;
        }
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
