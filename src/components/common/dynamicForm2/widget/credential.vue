<template>
    <FormItem :properties="list"></FormItem>
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
        onMounted,
        onBeforeMount,
    } from 'vue'
    import { useVModels } from '@vueuse/core'
    // import DynamicForm from '@/common/dynamicForm2/index.vue'

    export default defineComponent({
        name: 'CredentialInput',
        components: {
            FormItem: defineAsyncComponent(() =>
                import('@/common/dynamicForm2/formItem.vue')
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
                                required: false,
                                ui: {
                                    label: 'Name',
                                    hidden: true,
                                    placeholder: 'Host Name',
                                },
                            },
                            connector: {
                                type: 'string',
                                required: false,
                                ui: {
                                    label: 'Connector',
                                    hidden: true,
                                    placeholder: 'Connector',
                                },
                            },
                            connectorType: {
                                type: 'string',
                                required: false,
                                ui: {
                                    key: '_host',
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
                                required: false,
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
                                        ui: {
                                            widget: 'password',
                                            label: 'Password',
                                            placeholder: 'Password',
                                        },
                                    },
                                },
                                ui: {
                                    widget: 'nested',
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
                                    widget: 'nested',
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
                                    widget: 'nested',
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

            const list = ref([])

            const calculateList = () => {
                const temp = []
                Object.keys(configMap?.value?.properties).forEach((key) => {
                    if (!configMap.value?.properties[key]?.ui.hidden) {
                        temp.push({
                            id: `${key}`,
                            ...configMap.value?.properties[key],
                        })
                    }
                })

                list.value = temp
            }

            const formState = inject('formState')
            const setDefaultValue = () => {
                Object.keys(configMap.value.properties).forEach((key) => {
                    if (formState) {
                        if (!formState[key]) {
                            formState[key] =
                                configMap.value.properties[
                                    key
                                ]?.default?.toString()
                        }
                    }
                })
            }

            onBeforeMount(() => {
                setDefaultValue()
            })
            onMounted(() => {
                isImplied()
                calculateList()
            })

            const isImplied = () => {
                console.log(configMap.value)
                if (configMap.value?.anyOf) {
                    configMap.value.anyOf.forEach((item) => {
                        let loopStop = false
                        Object.keys(item.properties).some((i) => {
                            if (loopStop) {
                                return
                            }
                            if (formState[i] !== item.properties[i]?.const) {
                                loopStop = true
                            }
                        })
                        if (!loopStop) {
                            item.required.forEach((i) => {
                                console.log(i)
                                if (configMap.value.properties[i]) {
                                    configMap.value.properties[
                                        i
                                    ].ui.hidden = false
                                }
                            })
                        } else {
                            item.required.forEach((i) => {
                                console.log(i)
                                if (configMap.value.properties[i]) {
                                    configMap.value.properties[
                                        i
                                    ].ui.hidden = true
                                }
                            })
                        }
                    })
                }

                console.log(configMap.value)
            }

            watch(formState, () => {
                console.log('isImplied')
                isImplied()
                calculateList()
            })

            return {
                property,
                componentProps,
                localValue,
                configMap,
                modelValue,
                list,
                setDefaultValue,
                isImplied,
                calculateList,
            }
        },
    })
</script>

<style lang="scss" scoped></style>
