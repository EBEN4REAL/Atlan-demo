<template>
    <DynamicForm
        :config="configMap"
        v-model="localValue"
        layout="horizontal"
        labelAlign="left"
        :labelCol="{ span: 6 }"
        :wrapperCol="{ span: 14 }"
    ></DynamicForm>
</template>

<script>
    import {
        defineComponent,
        toRefs,
        computed,
        reactive,
        watch,
        defineAsyncComponent,
    } from 'vue'
    import { useVModels } from '@vueuse/core'
    // import DynamicForm from '@/common/dynamicForm2/index.vue'

    export default defineComponent({
        name: 'CredentialInput',
        components: {
            DynamicForm: defineAsyncComponent(() =>
                import('@/common/dynamicForm2/index.vue')
            ),
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
            configMap: {
                type: Object,
                required: false,
                default() {
                    return {
                        title: 'Config Map',
                        description: 'Config Map for input parameters',
                        properties: {
                            name: {
                                type: 'string',
                                required: true,
                                ui: {
                                    label: 'Name',
                                    hidden: true,
                                    placeholder: 'Host Name',
                                },
                            },
                            connector: {
                                type: 'string',
                                required: true,
                                ui: {
                                    label: 'Connector',
                                    hidden: true,
                                    placeholder: 'Connector',
                                },
                            },
                            connectorType: {
                                type: 'string',
                                required: true,
                                ui: {
                                    label: 'connectorType',
                                    placeholder: 'connectorType',
                                    hidden: true,
                                },
                            },
                            host: {
                                type: 'string',
                                required: true,
                                default:
                                    'jv22371.ap-south-1.aws.snowflakecomputing.com',
                                ui: {
                                    label: 'Host',
                                    placeholder: 'Host Name',
                                },
                            },
                            port: {
                                type: 'number',
                                default: 443,
                                ui: {
                                    label: 'Port',
                                    placeholder: 'Port',
                                },
                            },
                            'auth-type': {
                                type: 'string',
                                enum: ['basic', 'private'],
                                default: 'basic',
                                enumNames: ['Basic', 'Private'],
                                ui: {
                                    widget: 'radio',
                                    label: 'Authentication',
                                    placeholder: 'Credential Type',
                                },
                            },
                            basic: {
                                type: 'object',
                                properties: {
                                    username: {
                                        type: 'string',
                                        default: 'atlanadmin',
                                        ui: {
                                            label: 'Username',
                                            placeholder: 'Username',
                                        },
                                    },
                                    password: {
                                        type: 'string',
                                        default: 'Atlan#2020',
                                        ui: {
                                            widget: 'password',
                                            label: 'Password',
                                            placeholder: 'Password',
                                        },
                                    },
                                },
                                ui: {
                                    widget: 'section',
                                    label: 'Basic',
                                    placeholder: 'Credential Type',
                                    nestedValue: false,
                                    hidden: true,
                                },
                            },
                            private: {
                                type: 'object',
                                properties: {
                                    username: {
                                        type: 'string',
                                        ui: {
                                            label: 'private',
                                            placeholder: 'Username',
                                        },
                                    },
                                    password: {
                                        type: 'string',
                                        ui: {
                                            label: 'private',
                                            placeholder: 'Password',
                                        },
                                    },
                                },
                                ui: {
                                    widget: 'section',
                                    label: 'Private Key',
                                    nestedValue: false,
                                    placeholder: 'Credential Type',
                                    hidden: true,
                                },
                            },
                            extra: {
                                type: 'object',
                                properties: {
                                    role: {
                                        type: 'string',
                                        ui: {
                                            widget: 'sql',
                                            label: 'Role',
                                            placeholder: 'Role',
                                            query: 'show roles',
                                        },
                                    },
                                    warehouse: {
                                        type: 'string',
                                        ui: {
                                            widget: 'sql',
                                            label: 'Warehouse',
                                            placeholder: 'Warehouse',
                                            query: 'show warehouses',
                                        },
                                    },
                                },
                                ui: {
                                    widget: 'form',
                                    label: 'Advanced',
                                    header: 'Advanced',
                                    hidden: false,
                                },
                            },
                        },
                        anyOf: [
                            {
                                properties: {
                                    'auth-type': {
                                        const: 'basic',
                                    },
                                },
                                required: ['basic'],
                            },
                            {
                                properties: {
                                    'auth-type': {
                                        const: 'private',
                                    },
                                },
                                required: ['private'],
                            },
                        ],
                    }
                },
            },
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const { property, configMap } = toRefs(props)
            const componentProps = computed(() => property.value.ui)
            const { modelValue } = useVModels(props, emit)
            const localValue = reactive(modelValue.value)

            watch(localValue, () => {
                modelValue.value = localValue
                emit('change')
            })

            return {
                property,
                componentProps,
                localValue,
                configMap,
                modelValue,
            }
        },
    })
</script>

<style lang="scss" scoped></style>
