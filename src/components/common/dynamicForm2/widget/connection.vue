<template>
    <FormItem :configMap="configMap" :baseKey="property.id"></FormItem>
    <div class="p-3 bg-gray-100 rounded" v-if="list.length > 0">
        <p class="font-bold">Existing Connections ({{ approximateCount }})</p>
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
    import AtlanIcon from '../../icon/atlanIcon.vue'
    import { shortUUID } from '~/utils/helper/generator'
    import useIndexSearch from '~/composables/discovery/useIndexSearch'

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
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const { property } = toRefs(props)

            const formState = inject('formState')
            const validateForm = inject('validateForm')
            const workflowTemplate = inject('workflowTemplate')

            const testMessage = ref('')
            const testIcon = ref('')
            const testClass = ref('')

            const connector = computed(() => {
                return workflowTemplate.value?.metadata.labels[
                    'com.atlan.orchestration/source'
                ]
            })
            const connectorImage = computed(() => {
                return workflowTemplate.value?.metadata.annotations[
                    'com.atlan.orchestration/icon'
                ]
            })

            const sourceCategory = computed(() => {
                return workflowTemplate.value?.metadata.labels[
                    'com.atlan.orchestration/sourceCategory'
                ]
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
                                                    connectorName: 'athena',
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
                    ownerUsers: {
                        type: 'string',

                        ui: {
                            help: 'These users will have ability to modify the connection and read/update/query all the related assets for this connection',
                            widget: 'userMultiple',
                            label: 'Owner Users',

                            grid: 3,
                        },
                    },
                    ownerGroups: {
                        type: 'string',
                        ui: {
                            help: 'These group of users will have ability to modify the connection and read/update/query all the related assets for this connection',
                            widget: 'groupMultiple',
                            label: 'Owner Groups',
                            grid: 3,
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
                    allowPreview: {
                        type: 'boolean',
                        default: true,
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
                        required: ['allowQuery', 'allowPreview', 'rowLimit'],
                    },
                    {
                        properties: {
                            category: {
                                const: 'rdbms',
                            },
                        },
                        required: ['allowQuery', 'allowPreview', 'rowLimit'],
                    },
                    {
                        properties: {
                            category: {
                                const: 'queryengine',
                            },
                        },
                        required: ['allowQuery', 'allowPreview', 'rowLimit'],
                    },
                    {
                        properties: {
                            category: {
                                const: 'lake',
                            },
                        },
                        required: ['allowQuery', 'allowPreview', 'rowLimit'],
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
            }
        },
    })
</script>

<style lang="scss" scoped></style>
