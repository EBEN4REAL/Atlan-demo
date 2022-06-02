<template>
    <AssetDrawer
        :data="selectedConnection"
        :show-drawer="isDrawerVisible && selectedConnection?.guid"
        :show-mask="false"
        :show-close-btn="true"
        @close-drawer="isDrawerVisible = false"
        @update="handleDrawerUpdate"
    />
    <div v-if="isEdit" class="flex flex-col">
        <div class="flex flex-col gap-y-2">
            <div v-if="selectedConnection?.guid" class="flex flex-col flex-1">
                <div class="flex flex-col">
                    <div class="flex items-center mr-1">
                        <span class="text-base font-medium text-new-gray-600"
                            >Connection: &nbsp;</span
                        >
                        <span class="text-base font-bold text-new-gray-800">{{
                            title(selectedConnection)
                        }}</span>
                    </div>

                    <div class="text-gray-500">
                        last updated
                        {{ modifiedAt(selectedConnection) }} ago
                        <template
                            v-if="
                                modifiedBy(selectedConnection)?.startsWith(
                                    'service-account-apikey-'
                                )
                            "
                        >
                            using <AtlanIcon icon="Key" class="h-3" /> API key
                        </template>
                        <template v-else>
                            by
                            <UserWrapper
                                :username="modifiedBy(selectedConnection)"
                            />
                        </template>
                    </div>
                </div>
                <a-divider class="mt-3 mb-4" />

                <div class="flex flex-col gap-y-2">
                    <div class="grid grid-cols-2 text-sm font-medium gap-y-4">
                        <div class="space-y-1.5">
                            <p class="text-new-gray-600">Connection Name</p>
                            <p
                                class="font-bold cursor-pointer text-primary hover:underline"
                                @click="isDrawerVisible = true"
                            >
                                {{ title(selectedConnection) }}
                            </p>
                        </div>
                        <div class="space-y-1.5">
                            <p class="text-new-gray-600">Qualified Name</p>
                            <p class="text-new-gray-800">
                                {{
                                    selectedConnection.attributes.qualifiedName
                                }}
                            </p>
                        </div>
                        <div class="col-span-2 space-y-1.5">
                            <p class="text-gray-500">Guid</p>
                            <p class="text-new-gray-800">
                                {{ selectedConnection.guid }}
                            </p>
                        </div>
                    </div>

                    <a-divider
                        orientation="left"
                        orientationMargin="0px"
                        class="m-0 mt-2"
                    >
                        <span class="text-sm text-new-gray-600">
                            QUERYING
                        </span>
                    </a-divider>

                    <div
                        class="flex flex-col mt-2 gap-y-3"
                        v-if="
                            selectedConnection?.attributes?.category?.toLowerCase() !=
                            'bi'
                        "
                    >
                        <div
                            class="flex items-center text-sm font-medium gap-x-9"
                        >
                            <div>
                                <p class="mb-1 text-new-gray-600">
                                    Allow Query
                                </p>

                                <a-switch
                                    :checked="allowQuery(selectedConnection)"
                                    disabled
                                />
                            </div>

                            <div>
                                <p class="mb-1 text-new-gray-600">
                                    Allow Preview
                                </p>

                                <a-switch
                                    :checked="
                                        allowQueryPreview(selectedConnection)
                                    "
                                    disabled
                                />
                            </div>

                            <div>
                                <p class="mb-1 text-new-gray-600">Credential</p>
                                <p class="uppercase">
                                    {{
                                        selectedConnection.attributes
                                            ?.credentialStrategy
                                    }}
                                </p>
                            </div>

                            <div>
                                <p class="mb-1 text-new-gray-600">Row Limit</p>
                                <p class="uppercase">
                                    {{ connectionRowLimit(selectedConnection) }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- <a-divider class="mt-4 mb-3" /> -->
                <div class="flex mt-6 gap-x-3">
                    <AtlanButton2
                        label="Edit Connection"
                        color="secondary"
                        prefixIcon="SidebarSwitch"
                        @click="isDrawerVisible = true"
                    />
                </div>
            </div>
            <template v-else-if="isLoading">
                <AtlanLoader class="self-center h-10" />
                <span class="self-center">Loading Connection Details</span>
            </template>
            <div
                v-else
                class="flex flex-col items-center justify-center px-6 py-4 text-lg leading-snug text-center"
                style="min-height: 150px"
            >
                <AtlanIcon icon="Error" class="h-6 mb-2 mr-2" />
                <b class="mb-1">No connection found</b>
                <span>
                    Wait for a while if you have setup a new connection or
                    delete the worklow and try setting up a new one
                </span>
            </div>
        </div>
    </div>

    <div v-else>
        <FormItem :configMap="configMap" :baseKey="property.id"></FormItem>
        <div class="flex" v-if="list.length > 0 && !isEdit">
            <div class="flex flex-col p-3 bg-gray-100 rounded">
                <p class="mb-2 font-bold">
                    <AtlanIcon icon="Connection"></AtlanIcon>
                    Existing
                    <span class="capitalize">{{ connector }}</span> Connections
                    ({{ approximateCount }})
                </p>
                <div
                    v-for="(connection, index) in list"
                    :key="connection.guid"
                    class="flex gap-x-3"
                >
                    <span>
                        {{ connection.attributes?.name }}

                        <span>
                            ({{
                                getMap(aggregationMap('group_by_connection'))[
                                    connection.attributes.qualifiedName
                                ]
                            }}
                            Assets)</span
                        ></span
                    >
                    <span class="text-gray-500"
                        >created by {{ createdBy(connection) }}</span
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        defineComponent,
        toRefs,
        computed,
        watch,
        defineAsyncComponent,
        ref,
        inject,
    } from 'vue'
    import bodybuilder from 'bodybuilder'

    import { useConnectionStore } from '~/store/connection'
    import useIndexSearch from '~/composables/discovery/useIndexSearch'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import AssetDrawer from '@/common/assets/preview/drawer.vue'
    import UserWrapper from '~/workflowsv2/components/common/user.vue'

    export default defineComponent({
        name: 'ConnectionInput',
        components: {
            FormItem: defineAsyncComponent(() =>
                import('~/workflows/components/dynamicForm2/formItem.vue')
            ),
            AssetDrawer,
            UserWrapper,
        },
        props: {
            property: {
                required: false,
                type: Object,
                default() {
                    return {}
                },
            },
            modelValue: {
                required: false,
                type: Object,
                default() {
                    return {}
                },
            },
            isEdit: {
                required: false,
            },
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const { property, isEdit } = toRefs(props)

            const formState = inject('formState')
            const validateForm = inject('validateForm')
            const workflowTemplate = inject('workflowTemplate')

            const { name, createdBy, createdAt } = useAssetInfo()
            const { getList, setList } = useConnectionStore()

            const isDrawerVisible = ref(false)

            const connector = computed(
                () =>
                    workflowTemplate.value?.metadata.labels[
                        'orchestration.atlan.com/source'
                    ]
            )

            const connectorImage = computed(
                () =>
                    workflowTemplate.value?.metadata.annotations[
                        'orchestration.atlan.com/icon'
                    ]
            )

            const sourceCategory = computed(
                () =>
                    workflowTemplate.value?.metadata.labels[
                        'orchestration.atlan.com/sourceCategory'
                    ]
            )

            const connectionQFName = computed(() => {
                if (formState[property.value.id]) {
                    try {
                        const conn = JSON.parse(formState[property.value.id])
                        return conn?.attributes?.qualifiedName || ''
                    } catch (e) {
                        return ''
                    }
                }
                return ''
            })

            const {
                data,
                approximateCount,
                aggregationMap,
                getMap,
                isLoading,
            } = useIndexSearch({
                attributes: [
                    'name',
                    'description',
                    '__guid',
                    '__createdBy',
                    '__modifiedBy',
                    '__modificationTimestamp',
                    'rowLimit',
                    'credentialStrategy',
                    'ownerUsers',
                    'ownerGroups',
                    'adminUsers',
                    'adminGroups',
                    'allowQuery',
                    'allowQueryPreview',
                    'certificateStatus',
                    'certificateUpdatedAt',
                    'certificateUpdatedBy',
                ],
                dsl: bodybuilder()
                    .aggregation(
                        'terms',
                        'connectionQualifiedName',
                        'group_by_connection',
                        { size: 100 }
                    )
                    .filter('term', 'connectorName', connector.value)
                    // TODO: Need to remove this to show existing connections
                    .filter('term', 'qualifiedName', connectionQFName.value)
                    .filter('term', '__state', 'ACTIVE')
                    .size(10)
                    .rawOption(
                        'post_filter',
                        bodybuilder()
                            .filter('term', '__typeName.keyword', 'Connection')
                            .build().query
                    )
                    .build(),
            })

            const list = computed(() => data.value?.entities || [])

            const seconds = Math.round(new Date().getTime() / 1000)

            const selectedConnection = ref({})

            watch(list, () => {
                if (list.value.length)
                    selectedConnection.value = list.value?.[0]
            })

            const {
                title,
                modifiedAt,
                modifiedBy,
                connectionRowLimit,
                allowQuery,
                allowQueryPreview,
            } = useAssetInfo()

            const configMap = ref({
                properties: {
                    name: {
                        type: 'string',
                        ui: {
                            widget: 'alias',
                            label: 'Connection Name',
                            placeholder: 'environment',
                            help: "Name of your connection which represents your source environment. Example - 'production', 'development', 'gold', 'analytics' ",
                            required: true,
                            grid: 6,
                            prefixImage: connectorImage.value,
                            prefixText: `${connector.value}-`,
                            rules: [
                                {
                                    required: true,
                                    message: 'Please enter a connection name',
                                },
                            ],
                        },
                    },
                    qualifiedName: {
                        type: 'string',
                        required: true,
                        default: `default/${connector.value}/${seconds}`,
                        ui: {
                            widget: 'alias',
                            label: 'Qualified Name',
                            placeholder: '',
                            disabled: true,
                            hidden: true,
                            grid: 4,
                            rules: [
                                {
                                    required: true,
                                    message:
                                        'Please enter a connection qualified name',
                                },
                            ],
                        },
                    },
                    admins: {
                        type: 'multiple',
                        ui: {
                            help: 'These users will have ability to modify the connection and read/update/query all the related assets for this connection',
                            widget: 'CombinedUserSelector',
                            label: 'Connection Admins',
                            mappings: {
                                users: 'adminUsers',
                                groups: 'adminGroups',
                                allAdmins: 'adminRoles',
                            },
                            start: 1,
                            grid: 12,
                        },
                    },
                    // adminRoles: {
                    //     type: 'boolean',
                    //     default: true,
                    //     ui: {
                    //         help: 'Assign all Atlan Admins as the admin for the current connection',
                    //         label: 'Connection Admins',
                    //         start: 1,
                    //         grid: 6,
                    //     },
                    // },
                    // adminUsers: {
                    //     type: 'string',
                    //     ui: {
                    //         help: 'These users will have ability to modify the connection and read/update/query all the related assets for this connection',
                    //         widget: 'userMultiple',
                    //         label: 'Admin Users',
                    //         start: 1,
                    //         grid: 6,
                    //     },
                    // },
                    // adminGroups: {
                    //     type: 'string',
                    //     ui: {
                    //         help: 'These group of users will have ability to modify the connection and read/update/query all the related assets for this connection',
                    //         widget: 'groupMultiple',
                    //         label: 'Admin Groups',

                    //         grid: 6,
                    //     },
                    // },
                    allowQuery: {
                        type: 'boolean',
                        default: true,
                        required: true,
                        ui: {
                            label: 'Allow SQL Query',
                            start: 1,
                            help: 'Users will be run SQL query on the assets',
                            grid: 3,
                            hidden: true,
                            rules: [
                                {
                                    required: true,
                                    message: 'Please select a valid option',
                                },
                            ],
                        },
                    },
                    allowQueryPreview: {
                        type: 'boolean',
                        default: true,
                        required: true,
                        ui: {
                            label: 'Allow Data Preview',
                            help: 'Users will be view sample preview of the assets',
                            grid: 4,
                            hidden: true,
                            rules: [
                                {
                                    required: true,
                                    message: 'Please select a valid option',
                                },
                            ],
                        },
                    },
                    rowLimit: {
                        type: 'number',
                        default: 10000,
                        ui: {
                            hidden: true,
                            label: 'Max Row Limit',
                            help: 'Maximum number of rows that can be returned by a query. This is to prevent users from running large queries.',
                            grid: 3,
                        },
                    },
                    defaultCredentialGuid: {
                        type: 'string',
                        ui: {
                            hidden: true,
                        },
                    },
                    connectorName: {
                        type: 'string',
                        default: connector.value,
                        ui: {
                            hidden: true,
                        },
                    },
                    sourceLogo: {
                        type: 'string',
                        default: connectorImage.value,
                        ui: {
                            hidden: true,
                        },
                    },
                    isDiscoverable: {
                        type: 'boolean',
                        default: true,
                        ui: {
                            hidden: true,
                        },
                    },
                    isEditable: {
                        type: 'boolean',
                        default: false,
                        ui: {
                            hidden: true,
                        },
                    },
                    category: {
                        type: 'string',
                        default: sourceCategory.value,
                        ui: {
                            hidden: true,
                        },
                    },
                },
                anyOf: [
                    {
                        properties: {
                            category: {
                                const: 'warehouse',
                            },
                        },
                        required: ['allowQuery', 'allowQueryPreview'],
                    },
                    {
                        properties: {
                            category: {
                                const: 'rdbms',
                            },
                        },
                        required: ['allowQuery', 'allowQueryPreview'],
                    },
                    {
                        properties: {
                            category: {
                                const: 'queryengine',
                            },
                        },
                        required: ['allowQuery', 'allowQueryPreview'],
                    },
                    {
                        properties: {
                            category: {
                                const: 'lake',
                            },
                        },
                        required: [
                            'allowQuery',
                            'allowQueryPreview',
                            'rowLimit',
                        ],
                    },
                ],
            })

            const handleDrawerUpdate = (conn) => {
                const idx = getList.findIndex(
                    (i) => i.guid === selectedConnection.value.guid
                )
                if (idx > -1) {
                    const tempList = [...getList]
                    tempList[idx] = conn
                    setList(tempList)
                    selectedConnection.value = conn
                }
            }

            return {
                configMap,
                validateForm,
                formState,
                workflowTemplate,
                connectorImage,
                connector,
                sourceCategory,
                approximateCount,
                data,
                list,
                aggregationMap,
                getMap,
                selectedConnection,
                handleDrawerUpdate,
                isDrawerVisible,
                modifiedAt,
                modifiedBy,
                getList,
                isLoading,
                title,
                connectionRowLimit,
                allowQuery,
                allowQueryPreview,
                name,
                createdBy,
                createdAt,
            }
        },
    })
</script>
