<template>
    <FormItem :configMap="configMap" :baseKey="property.id"></FormItem>
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

            const seconds = Math.round(new Date().getTime() / 1000)

            const configMap = ref({
                properties: {
                    name: {
                        type: 'string',
                        ui: {
                            widget: 'alias',
                            label: 'Connection Name',
                            placeholder: 'Connection Name',
                            required: true,
                            grid: 5,
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
                            widget: 'userMultiple',
                            label: 'Owner Users',
                            start: 1,
                            grid: 5,
                        },
                    },
                    ownerGroups: {
                        type: 'string',
                        ui: {
                            widget: 'groupMultiple',
                            label: 'Owner Groups',
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
                            grid: 3,
                        },
                    },
                },
            })

            return {
                configMap,
                validateForm,
                formState,
                workflowTemplate,
                connectorImage,
                connector,
            }
        },
    })
</script>

<style lang="scss" scoped></style>
