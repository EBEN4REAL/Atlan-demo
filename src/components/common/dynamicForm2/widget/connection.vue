<template>
    <div v-if="isEdit" class="flex flex-col w-2/3">
        <div class="flex flex-col px-3 py-2 border rounded gap-y-2">
            <div class="flex flex-col" v-if="selectedConnection?.guid">
                <div class="flex items-center justify-between">
                    <div class="flex flex-col">
                        <div class="flex items-center font-semibold">
                            <div class="flex items-center mr-1">
                                <AtlanIcon
                                    :icon="getImage(connector)"
                                    class="w-auto h-4 mr-1"
                                />

                                <span class="ml-1 capitalize">{{
                                    connector
                                }}</span>
                            </div>
                            Connection
                        </div>
                        <div class="text-gray-500">
                            last updated
                            {{ modifiedAt(selectedConnection) }} ago by
                            {{ modifiedBy(selectedConnection) }}
                        </div>
                    </div>
                    <div class="flex gap-x-2">
                        <a-button
                            ><span
                                ><AtlanIcon
                                    icon="SidebarSwitch"
                                    class="mr-1"
                                ></AtlanIcon
                                >Edit</span
                            ></a-button
                        >
                    </div>
                </div>
                <div class="flex flex-col gap-y-2">
                    <div class="flex gap-x-3">
                        <div class="flex flex-col">
                            <div class="text-gray-500">Name</div>
                            <div class="text-gray-700">
                                {{ title(selectedConnection) }}
                            </div>
                        </div>
                        <div class="flex flex-col">
                            <div class="text-gray-500">Qualified Name</div>
                            <div class="text-gray-700">
                                {{
                                    selectedConnection.attributes.qualifiedName
                                }}
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col">
                        <div class="text-gray-500">Guid</div>
                        <div class="text-gray-700">
                            {{ selectedConnection.guid }}
                        </div>
                    </div>
                    <div
                        class="flex flex-col mt-2"
                        v-if="
                            selectedConnection?.attributes?.category?.toLowerCase() !=
                            'bi'
                        "
                    >
                        <div class="flex items-center mb-3 gap-x-6">
                            <p class="flex items-center text-gray-500">
                                <AtlanIcon
                                    icon="RunSuccess"
                                    class="mr-1"
                                    v-if="allowQuery(selectedConnection)"
                                ></AtlanIcon>
                                <AtlanIcon
                                    icon="Error"
                                    class="mr-1"
                                    v-else
                                ></AtlanIcon>
                                Allow Query
                            </p>

                            <p class="flex items-center text-gray-500">
                                <AtlanIcon
                                    icon="RunSuccess"
                                    class="mr-1"
                                    v-if="allowQueryPreview(selectedConnection)"
                                ></AtlanIcon>
                                <AtlanIcon
                                    icon="Error"
                                    class="mr-1"
                                    v-else
                                ></AtlanIcon>
                                Allow Preview
                            </p>
                        </div>

                        <div class="flex items-center mb-3 gap-x-6">
                            <div class="flex flex-col">
                                <p
                                    class="flex items-center justify-between mb-1 text-sm text-gray-500"
                                >
                                    Credential
                                </p>
                                <div class="uppercase">
                                    {{
                                        selectedConnection.attributes
                                            ?.credentialStrategy
                                    }}
                                </div>
                            </div>
                            <div class="flex flex-col">
                                <p
                                    class="flex items-center justify-between mb-1 text-sm text-gray-500"
                                >
                                    Row Limit
                                </p>
                                <div class="uppercase">
                                    {{ connectionRowLimit(selectedConnection) }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                v-else
                class="flex flex-col items-center justify-center p-6 py-4 text-xl text-center"
                style="min-height: 150px"
            >
                <AtlanIcon icon="Error" class="h-6 mr-2"></AtlanIcon>
                No connection found - delete the worklow and try setting up a
                new connection
            </div>
        </div>
    </div>

    <div v-else>
        <FormItem :configMap="configMap" :baseKey="property.id"></FormItem>
        <div class="p-3 bg-gray-100 rounded" v-if="list.length > 0 && !isEdit">
            <p class="font-bold">
                Existing Connections ({{ approximateCount }})
            </p>
            <div class="flex flex-col">
                <div v-for="(connection, index) in list" :key="connection.guid">
                    {{ connection.attributes.name }}

                    <span>
                        ({{
                            getMap(aggregationMap('group_by_connection'))[
                                connection.attributes.qualifiedName
                            ]
                        }}
                        Assets)</span
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
        reactive,
        watch,
        defineAsyncComponent,
        ref,
        inject,
        provide,
        onMounted,
        onBeforeMount,
    } from 'vue'
    import { useVModels } from '@vueuse/core'
    import { useTestCredential } from '~/composables/credential/useTestCredential'
    import { useConfigMapList } from '~/composables/package/useConfigMapList'
    import ErrorView from '@common/error/index.vue'
    import { useConnectionStore } from '~/store/connection'
    import AtlanIcon from '../../icon/atlanIcon.vue'
    import { shortUUID } from '~/utils/helper/generator'
    import useIndexSearch from '~/composables/discovery/useIndexSearch'

    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    // import DynamicForm from '@/common/dynamicForm2/index.vue'

    export default defineComponent({
        name: 'CredentialInput',
        components: {
            FormItem: defineAsyncComponent(() =>
                import('@/common/dynamicForm2/formItem.vue')
            ),
            ErrorView,
            AtlanIcon,
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

            const testMessage = ref('')
            const testIcon = ref('')
            const testClass = ref('')

            const connector = computed(() => {
                return workflowTemplate.value?.metadata.labels[
                    'orchestration.atlan.com/source'
                ]
            })

            const connectorImage = computed(() => {
                return workflowTemplate.value?.metadata.annotations[
                    'orchestration.atlan.com/icon'
                ]
            })

            const sourceCategory = computed(() => {
                return workflowTemplate.value?.metadata.labels[
                    'orchestration.atlan.com/sourceCategory'
                ]
            })

            const selectedConnection = computed(() => {
                if (formState[property.value.id]) {
                    try {
                        const temp = JSON.parse(formState[property.value.id])
                        const found = getList.find(
                            (i) =>
                                i.attributes.qualifiedName ===
                                temp?.attributes?.qualifiedName
                        )
                        return found
                    } catch (e) {
                        return {}
                    }
                }
                return {}
            })

            const { data, approximateCount, aggregationMap, getMap } =
                useIndexSearch({
                    attributes: [
                        'name',
                        'description',
                        '__guid',
                        '__createdBy',
                        'ownerUsers',
                        'ownerGroups',
                        'adminUsers',
                        'adminGroups',
                        'allowQuery',
                        'allowPreview',
                    ],
                    dsl: {
                        from: 0,
                        size: 10,
                        aggs: {
                            group_by_connection: {
                                terms: {
                                    field: 'connectionQualifiedName',
                                    size: 100,
                                },
                            },
                        },
                        query: {
                            bool: {
                                filter: {
                                    bool: {
                                        must: [
                                            {
                                                term: {
                                                    connectorName:
                                                        connector.value,
                                                },
                                            },
                                            {
                                                term: {
                                                    __state: 'ACTIVE',
                                                },
                                            },
                                        ],
                                    },
                                },
                            },
                        },

                        post_filter: {
                            bool: {
                                filter: {
                                    bool: {
                                        must: [
                                            {
                                                term: {
                                                    '__typeName.keyword':
                                                        'Connection',
                                                },
                                            },
                                        ],
                                    },
                                },
                            },
                        },
                    },
                })

            const list = ref([])

            watch(data, () => {
                if (data.value.entities) {
                    list.value = data.value.entities
                }
            })

            const seconds = Math.round(new Date().getTime() / 1000)

            const {
                title,
                modifiedAt,
                modifiedBy,
                connectionRowLimit,
                allowQuery,
                allowQueryPreview,
            } = useAssetInfo()

            const { getImage, getList } = useConnectionStore()

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
                            grid: 3,
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
                    adminUsers: {
                        type: 'string',

                        ui: {
                            help: 'These users will have ability to modify the connection and read/update/query all the related assets for this connection',
                            widget: 'userMultiple',
                            label: 'Admin Users',
                            start: 1,
                            grid: 5,
                        },
                    },
                    adminGroups: {
                        type: 'string',
                        ui: {
                            help: 'These group of users will have ability to modify the connection and read/update/query all the related assets for this connection',
                            widget: 'groupMultiple',
                            label: 'Admin Groups',

                            grid: 4,
                        },
                    },
                    allowQuery: {
                        type: 'boolean',
                        default: true,
                        required: true,
                        ui: {
                            label: 'Allow SQL Query',
                            start: 1,
                            help: 'Users will be run SQL query on the assets',
                            grid: 3,
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
                            grid: 3,
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
                        required: [
                            'allowQuery',
                            'allowQueryPreview',
                            'rowLimit',
                        ],
                    },
                    {
                        properties: {
                            category: {
                                const: 'rdbms',
                            },
                        },
                        required: [
                            'allowQuery',
                            'allowQueryPreview',
                            'rowLimit',
                        ],
                    },
                    {
                        properties: {
                            category: {
                                const: 'queryengine',
                            },
                        },
                        required: [
                            'allowQuery',
                            'allowQueryPreview',
                            'rowLimit',
                        ],
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
                isEdit,
                getImage,
                modifiedAt,
                modifiedBy,
                getList,

                title,
                connectionRowLimit,
                allowQuery,
                allowQueryPreview,
            }
        },
    })
</script>

<style lang="scss" scoped></style>
