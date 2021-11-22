<template>
    <div>
        <DynamicForm
            :config="configMap"
            layout="vertical"
            v-model="localValue"
        ></DynamicForm>
    </div>
</template>

<script>
    import {
        defineComponent,
        toRefs,
        computed,
        ref,
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
                                ui: {
                                    label: 'Host',
                                    placeholder: 'Host Name',
                                },
                            },
                            port: {
                                type: 'number',
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
                                    label: 'Authentication Method',
                                    placeholder: 'Credential Type',
                                },
                            },
                            basic: {
                                type: 'object',
                                properties: {
                                    username: {
                                        type: 'string',
                                        ui: {
                                            label: 'Username',
                                            placeholder: 'Username',
                                        },
                                    },
                                    password: {
                                        type: 'string',
                                        ui: {
                                            label: 'Password',
                                            placeholder: 'Password',
                                        },
                                    },
                                },
                                ui: {
                                    widget: 'form',
                                    label: '',
                                    placeholder: 'Credential Type',
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
                                    widget: 'form',
                                    label: '',
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
                                            placeholder: 'Username',
                                        },
                                    },
                                    warehouse: {
                                        type: 'string',
                                        ui: {
                                            label: 'Warehouse',
                                            placeholder: 'warehouse',
                                        },
                                    },
                                },
                                ui: {
                                    widget: 'collapse',
                                    label: '',
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
        setup(props, { emit }) {
            const { property, configMap } = toRefs(props)
            const componentProps = computed(() => property.value.ui)
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)

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
