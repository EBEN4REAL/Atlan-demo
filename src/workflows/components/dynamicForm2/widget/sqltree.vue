<template>
    <SQLTreeSelect
        :credential="credentialBody"
        :credentialID="credentialID"
        :query="computedSQL"
        :include="property.ui.schemaIncludePattern"
        :exclude="property.ui.schemaExcludePattern"
        v-model="localValue"
        @change="handleChange"
    ></SQLTreeSelect>
</template>

<script lang="ts">
    import {
        defineComponent,
        toRefs,
        computed,
        ref,
        inject,
        reactive,
    } from 'vue'

    import SQLTreeSelect from '@common/treeselect/sql/index.vue'
    import { useWorkflowHelper } from '~/workflows/composables/package/useWorkflowHelper'
    import { useVModels } from '@vueuse/core'
    import { moustacheInterpolator } from '~/workflowsv2/composables/utils'

    export default defineComponent({
        name: 'FormBuilder',
        components: {
            SQLTreeSelect,
        },
        props: {
            property: {
                required: false,
                type: Object,
                default: () => {},
            },
            modelValue: {
                required: false,
            },
            configMap: {
                required: false,
                type: Object,
                default: () => {},
            },
            isEdit: {
                required: false,
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { property, baseKey, configMap, isEdit } = toRefs(props)
            const formState = inject('formState')
            const workflowTemplate = inject('workflowTemplate')

            const componentProps = computed(() => property.value.ui)

            const { modelValue } = useVModels(props, emit)

            const tempArray: string[] = []

            // Remove the ^ and $ character from the string if they are present
            const stripString = (str: string) => {
                let tmpStr = str
                if (tmpStr.startsWith('^')) tmpStr = tmpStr.slice(1)
                if (tmpStr.endsWith('$')) tmpStr = tmpStr.slice(0, -1)
                return tmpStr
            }

            if (modelValue.value) {
                if (!isEdit.value) {
                    Object.keys(modelValue.value)?.forEach((key) => {
                        if (modelValue.value[key]?.length > 0) {
                            modelValue.value[key]?.forEach((item) => {
                                tempArray.push(
                                    `${stripString(key)}:${stripString(item)}`
                                )
                            })
                        } else {
                            tempArray.push(stripString(key))
                        }
                    })
                } else {
                    const tempModel = JSON.parse(modelValue.value)

                    Object.keys(tempModel)?.forEach((key) => {
                        if (tempModel[key].length > 0) {
                            tempModel[key]?.forEach((item) => {
                                tempArray.push(
                                    `${stripString(key)}:${stripString(item)}`
                                )
                            })
                        } else {
                            tempArray.push(stripString(key))
                        }
                    })
                }
            }

            const localValue = ref(tempArray)

            const handleChange = () => {
                const map = {}
                localValue.value.forEach((item) => {
                    if (item.includes(':')) {
                        const first = item.split(':')[0]
                        map[`^${first}$`] = []
                    } else {
                        map[`^${item}$`] = []
                    }
                })
                localValue.value.forEach((item) => {
                    if (item.includes(':')) {
                        const first = item.split(':')[0]
                        const second = item.split(':')[1]
                        map[`^${first}$`].push(`^${second}$`)
                    }
                })
                modelValue.value = map
                emit('change', map)
            }

            const { buildCredentialBody } = useWorkflowHelper()

            const credentialBody = computed(() => {
                const found =
                    configMap.value.properties[property.value.ui.credential]
                return buildCredentialBody(
                    formState,
                    property.value.ui.credential,
                    found?.ui.credentialType
                )
            })
            const credentialID = computed(() => {
                const found =
                    configMap.value.properties[property.value.ui.credential]

                return formState[property.value.ui.credential]
            })

            const computedSQL = computed(() =>
                moustacheInterpolator(componentProps.value.sql, {
                    form: formState,
                    workflowTemplate,
                })
            )

            return {
                property,
                componentProps,
                formState,
                credentialBody,
                baseKey,
                configMap,
                localValue,
                modelValue,
                handleChange,
                isEdit,
                credentialID,
                computedSQL,
            }
        },
    })
</script>

<style lang="scss" scoped></style>
