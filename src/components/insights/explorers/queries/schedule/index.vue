<template>
    <div class="w-full h-full bg-white">
        <Header :item="item" />
        <keep-alive>
            <Info
                v-if="activeTabIndex === 0"
                :item="item"
                :infoTabeState="infoTabeState"
                :usersData="usersData"
                :cronData="cronData"
                :cronStringReadable="cronStringReadable"
                :rules="rules"
            />
        </keep-alive>
        <keep-alive>
            <Variables
                v-if="activeTabIndex === 1"
                :item="item"
                :usersData="usersData"
                :cronData="cronData"
                v-model:variablesData="variablesData"
                :infoTabeState="infoTabeState"
            />
        </keep-alive>
        <keep-alive>
            <Success
                v-if="activeTabIndex === 2"
                :item="item"
                :usersData="usersData"
                :cronData="cronData"
                :variablesData="variablesData"
                :infoTabeState="infoTabeState"
                :isScheduleWorkFlowLoading="isLoading"
                :isWorkflowTemplateFetched="isWorkflowTemplateFetched"
                @runWorkFlow="runWorkFlow"
            />
        </keep-alive>
        <div
            class="flex items-center justify-between p-6 text-sm border-t border-gray-200 rounded-b-lg bg-primary-light"
            style="height: 80px"
        >
            <div>
                <AtlanButton
                    color="light"
                    @click="() => shiftIndex('back')"
                    v-if="activeTabIndex === 1"
                    class="flex justify-center h-8 px-5 py-0 text-gray-700 bg-white border border-gray-300 rounded"
                >
                    <div class="flex items-center">
                        <AtlanIcon icon="ChevronLeft" class="-mt-0.5" />
                        <span class="ml-1 text-sm">Back</span>
                    </div>
                </AtlanButton>
            </div>
            <div class="flex items-center">
                <AtlanButton
                    color="light"
                    @click="closeModal"
                    class="h-8 px-5 py-0 mr-2 text-sm text-gray-700"
                    v-if="activeTabIndex !== 2"
                >
                    <div class="flex items-center">
                        <span class="ml-1 text-sm">Cancel</span>
                    </div>
                </AtlanButton>
                <AtlanButton
                    color="primary"
                    @click="() => shiftIndex('next')"
                    class="h-8 px-5 py-0"
                    :loading="isLoading"
                    :disabled="!isWorkflowTemplateFetched || isLoading"
                >
                    <div class="flex items-center">
                        <span class="mr-1 text-sm">{{
                            activeTabIndex === 2 ? 'Done' : 'Next'
                        }}</span>
                        <AtlanIcon
                            icon="ChevronRight"
                            v-if="activeTabIndex !== 2"
                        />
                    </div>
                </AtlanButton>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        Ref,
        inject,
        defineComponent,
        ref,
        PropType,
        toRefs,
        watch,
        reactive,
        computed,
        provide,
    } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import Header from './header.vue'
    import Info from './info.vue'
    import Variables from './variables.vue'
    import Success from './success.vue'
    import AtlanButton from '@/UI/button.vue'
    import { useVModels } from '@vueuse/core'
    import { usePackageDiscoverList } from '~/workflows/composables/package/usePackageDiscoverList'
    import { invoke, until } from '@vueuse/core'
    import { useSchedule } from './composables/useSchedule'
    import { createWorkflow } from '~/workflows/composables/package/useWorkflow'
    import { useUsers } from '~/composables/user/useUsers'
    import { message } from 'ant-design-vue'
    import useWorkflowSubmit from '~/workflows/composables/package/useWorkflowSubmit'
    import { useTimeoutFn } from '@vueuse/core'
    import useWorkflowInfo from '~/workflows/composables/workflow/useWorkflowInfo'
    import { getCronFrequency } from './composables/useSchedule'
    import parser from 'cron-parser'

    export default defineComponent({
        name: 'Schedule Query',
        components: { Header, Info, AtlanButton, Variables, Success },
        props: {
            scheduleQueryModal: {
                type: Boolean,
                required: true,
            },
            item: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            mode: {
                type: String,
                required: true,
                default: () => 'new',
            },
            cronModel: {
                type: Object as PropType<{ cron: string; timezone: string }>,
                required: false,
            },
            workflowParameters: {
                type: Object as PropType<Record<string, any>>,
                required: false,
            },
        },
        setup(props) {
            const { scheduleQueryModal, item, mode } = useVModels(props)
            const { cronModel, workflowParameters } = toRefs(props)
            const { handleWorkflowSubmit } = useSchedule()
            const refreshSchedulesWorkflowTab = inject(
                'refreshSchedulesWorkflowTab'
            ) as Ref<Function>

            const rules = ref({
                name: {
                    text: 'Enter a report name first!',
                    show: false,
                },
                connection: {
                    text: 'Connection is required!',
                    show: false,
                },
                users: { text: 'Select atleast 1 user!', show: false },
            })

            const variablesData = ref(
                JSON.parse(
                    window.atob(item.value.attributes?.variablesSchemaBase64) ??
                        '[]'
                )
            )
            const activeTabIndex = ref(0)
            const messageKey = ref('run-workflow-insights')
            const isWorkflowTemplateFetched = ref(false)
            const packageList = ref(['@atlan/schedule-query'])
            const facetPackage = ref({})
            const packageLimit = ref(5)
            const workflowTemplate = ref({})
            const isEdit = ref(false)
            const isCron = ref(true)
            const status = ref('')
            const errorMesssage = ref('')
            const inputParameters = ref({
                recipients: [],
                'output-format': 'csv',
                'query-variables': {},
                'email-variables': {},
                'saved-query-id': item.value.guid,
                'report-name': '',
            })
            const usersData = ref({ ownerUsers: [], ownerGroups: [] })

            const totalUsersCount = computed(() => {
                const num =
                    usersData.value.ownerUsers?.length ??
                    0 + usersData.value.ownerGroups?.length ??
                    0

                if (num !== 0) {
                    if (rules.value.users.show) rules.value.users.show = false
                }
                return num
            })

            const usersParams = reactive({
                limit: totalUsersCount.value,
                offset: 0,
                filter: {
                    $or: [],
                },
            })

            // body
            const body = ref({
                metadata: {
                    labels: {},
                },
                spec: {},
                payload: [],
            })

            const { isLoading, execute, error, data, workflow } =
                createWorkflow(body, { submit: false })

            const {
                usersListConcatenated: userList,
                getUserList,
                isLoading: isUserLoading,
                error: userError,
            } = useUsers(usersParams, false)

            // info tab state
            const infoTabeState = ref({
                name: '',
                frequency: 'daily',
                time: '00:00',
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                dayOfWeek: '1',
                date: '',
            })

            if (workflowParameters.value) {
                // query variables
                const queryVariables =
                    JSON.parse(
                        workflowParameters.value.find(
                            (e) => e.name === 'query-variables'
                        ).value
                    ) ?? []
                variablesData.value = queryVariables

                // report name
                const scheduleQueryName =
                    workflowParameters.value.find(
                        (e) => e.name === 'report-name'
                    ).value ?? '-'
                infoTabeState.value.name = scheduleQueryName

                const userEmails =
                    JSON.parse(
                        workflowParameters.value.find(
                            (e) => e.name === 'email-variables'
                        ).value
                    ) ?? []

                usersParams.filter.$or = userEmails.map((email) => {
                    return {
                        email: email,
                    }
                }) as any
                //   getUserList();

                //   try {
                //     invoke(async () => {
                //         await until(isUserLoading).toBe(true)
                //         if (userError.value) {
                //             console.error(
                //                 userError.value,
                //                 'Error in fetching users email'
                //             )
                //         } else if (userList.value) {
                //             watch(userList, () => {
                //                 if (userList.value?.length > 0) {
                //                     let usernames: string[] = []
                //                     userList.value.forEach((user) => {
                //                         usernames.push(user.username);
                //                     })
                //                     // assiging owners
                //                     usersData.value.ownerUsers = usernames as any;
                //                 }
                //             })
                //         }
                //     })
                // } catch (e) {
                //     console.error(e, 'Error in fetching users email')
                // }
            }

            const cronData = ref({
                cron: '',
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            })
            // pre populating the data if it is passed
            if (cronModel.value) {
                cronData.value = {
                    ...cronModel.value,
                }
                infoTabeState.value.frequency = getCronFrequency(
                    cronModel.value.cron
                )
                const interval = parser.parseExpression(cronModel.value.cron)
                infoTabeState.value.time = `${interval.fields.hour[0].toString()}:${interval.fields.minute[0].toString()}`
                if (interval.fields.dayOfWeek.length === 1) {
                    infoTabeState.value.dayOfWeek =
                        interval.fields.dayOfWeek[0].toString()
                }
                if (interval.fields.dayOfMonth.length === 1) {
                    infoTabeState.value.date =
                        interval.fields.dayOfMonth[0].toString()
                }
            }

            const cronStringReadable = ref('')

            facetPackage.value = {
                packageNames: packageList.value,
            }

            const {
                isLoading: isLoadingPackage,
                refresh,
                error: errorPackage,
                list,
            } = usePackageDiscoverList({
                facets: facetPackage,
                limit: packageLimit,
            })
            refresh()

            try {
                invoke(async () => {
                    await until(isLoadingPackage).toBe(true)
                    if (errorPackage.value) {
                        console.error(
                            errorPackage.value,
                            'Error in fetching schedule query template'
                        )
                    } else if (list.value) {
                        watch(list, () => {
                            if (list.value?.length > 0) {
                                isWorkflowTemplateFetched.value = true
                                workflowTemplate.value = list.value[0]
                                console.log(list.value[0], 'template')
                            }
                        })
                    }
                })
            } catch (e) {
                console.error(e)
            }

            const closeModal = () => {
                scheduleQueryModal.value = false
                activeTabIndex.value = 0
            }

            const validateFileds = () => {
                if (infoTabeState.value.name === '') {
                    rules.value.users.show = true
                    return Promise.reject()
                }
                // select atleast 1 user
                if (totalUsersCount.value === 0) {
                    rules.value.users.show = true
                    return Promise.reject()
                }
                return Promise.resolve()
            }

            const getValueByType = (value: any, type: string) => {
                if (type === 'number') return Number(value)
                return String(value)
            }

            const scheduleWorkFlow = () => {
                usersParams.filter.$or = usersData.value.ownerUsers.map(
                    (name) => {
                        return {
                            username: name,
                        }
                    }
                ) as any

                getUserList()
                try {
                    invoke(async () => {
                        await until(isUserLoading).toBe(true)
                        if (userError.value) {
                            console.error(
                                userError.value,
                                'Error in fetching users email'
                            )
                        } else if (userList.value) {
                            watch(userList, () => {
                                if (userList.value?.length > 0) {
                                    let userEmails: string[] = []
                                    userList.value.forEach((user) => {
                                        userEmails.push(user.email)
                                    })
                                    // setting up emails of selected user
                                    inputParameters.value.recipients =
                                        userEmails as any

                                    // setting up the custom variables
                                    variablesData.value.forEach((variable) => {
                                        inputParameters.value[
                                            'query-variables'
                                        ][variable.name] =
                                            typeof variable.value === 'object'
                                                ? variable.value?.join(',')
                                                : getValueByType(
                                                      variable.value,
                                                      variable.type
                                                  )
                                    })
                                    // setting up report name
                                    inputParameters.value['report-name'] =
                                        infoTabeState.value.name

                                    handleWorkflowSubmit({
                                        body,
                                        isEdit,
                                        workflowTemplate,
                                        savedQueryId: item.value?.guid,
                                        isCron: isCron.value,
                                        cron: cronData,
                                        modelValue: inputParameters,
                                        status,
                                        errorMesssage: errorMesssage,
                                        execute,
                                    })
                                }
                            })
                        }
                    })
                } catch (e) {
                    console.error(e, 'Error in fetching users email')
                }
            }

            const shiftIndex = (type: 'next' | 'back') => {
                if (activeTabIndex.value === 2) {
                    closeModal()
                    return
                }
                if (type === 'next') {
                    if (activeTabIndex.value < 2) {
                        debugger
                        if (variablesData.value.length === 0) {
                            validateFileds()
                                .then(() => {
                                    scheduleWorkFlow()
                                    ;(async () => {
                                        await until(isLoading).toBe(true)
                                        if (error.value) {
                                            message.error(
                                                'Failed to submit schedule query!'
                                            )
                                        }
                                        if (data.value) {
                                            activeTabIndex.value = 2
                                            setTimeout(() => {
                                                // refetch schedule workflows
                                                refreshSchedulesWorkflowTab.value(
                                                    true
                                                )
                                            }, 1000)
                                        }
                                    })()
                                })
                                .catch(() => {})
                        } else {
                            validateFileds()
                                .then(() => {
                                    if (activeTabIndex.value + 1 === 2) {
                                        scheduleWorkFlow()
                                        ;(async () => {
                                            await until(isLoading).toBe(true)
                                            if (error.value) {
                                                message.error(
                                                    'Failed to submit schedule query!'
                                                )
                                            }
                                            if (data.value) {
                                                activeTabIndex.value =
                                                    activeTabIndex.value + 1
                                                setTimeout(() => {
                                                    // refetch schedule workflows
                                                    refreshSchedulesWorkflowTab.value(
                                                        true
                                                    )
                                                }, 1000)
                                            }
                                        })()
                                    } else {
                                        activeTabIndex.value =
                                            activeTabIndex.value + 1
                                    }
                                })
                                .catch(() => {})
                        }
                    }
                } else if (type === 'back') {
                    if (activeTabIndex.value > 0) {
                        if (variablesData.value.length === 0) {
                            activeTabIndex.value = 0
                        } else {
                            activeTabIndex.value = activeTabIndex.value - 1
                        }
                    }
                }
            }

            watch(
                () => infoTabeState.value.name,
                () => {
                    if (
                        rules.value.name.show &&
                        infoTabeState.value.name !== ''
                    ) {
                        rules.value.name.show = false
                    }
                }
            )

            const runWorkFlow = () => {
                const { name } = useWorkflowInfo()

                const bodyArg = {
                    namespace: 'default',
                    resourceKind: 'WorkflowTemplate',
                    resourceName: name(body.value),
                }
                const {
                    data: workflowSubmitData,
                    error: workflowSubmitError,
                    mutate,
                    isLoading: workflowSubmitLoading,
                } = useWorkflowSubmit(bodyArg, true)

                message.loading({
                    content: 'Starting a new run',
                    key: messageKey.value,
                })

                try {
                    invoke(async () => {
                        await until(workflowSubmitLoading).toBe(true)
                        if (workflowSubmitData.value) {
                            const {} = useTimeoutFn(() => {
                                message.success({
                                    content: 'Run started',
                                    key: messageKey.value,
                                    duration: 4,
                                })
                            }, 2000)
                        }
                        if (workflowSubmitError.value) {
                            message.error({
                                content: 'Failed to run!',
                                key: messageKey.value,
                                duration: 4,
                            })
                        }
                    })
                } catch (e) {
                    console.error(e)
                }
            }

            provide('mode', mode)

            // watch(activeTabIndex, (newActiveIndex) => {
            //     if (newActiveIndex === 0) {
            //         variablesData.value = JSON.parse(
            //             window.atob(
            //                 item.value.attributes?.variablesSchemaBase64
            //             ) ?? '[]'
            //         )
            //     }
            // })

            return {
                rules,
                item,
                shiftIndex,
                activeTabIndex,
                closeModal,
                infoTabeState,
                usersData,
                cronData,
                cronStringReadable,
                isWorkflowTemplateFetched,
                variablesData,
                getValueByType,
                isLoading,
                runWorkFlow,
            }
        },
    })
</script>
<style lang="less" scoped></style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
