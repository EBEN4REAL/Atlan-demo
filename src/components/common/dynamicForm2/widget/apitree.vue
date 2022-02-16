<template>
    <APITreeSelect
        :credential="credentialBody"
        :credentialID="credentialID"
        :query="property.ui.sql"
        :include="property.ui.schemaIncludePattern"
        :exclude="property.ui.schemaExcludePattern"
        v-model="localValue"
        @change="handleChange"
    ></APITreeSelect>
</template>

<script>
    import {
        defineComponent,
        toRefs,
        computed,
        ref,
        inject,
        reactive,
    } from 'vue'

    import APITreeSelect from '@common/treeselect/api/index.vue'
    import { useWorkflowHelper } from '~/composables/package/useWorkflowHelper'
    import { useVModels } from '@vueuse/core'

    export default defineComponent({
        name: 'FormBuilder',
        components: {
            APITreeSelect,
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
            const componentProps = computed(() => property.value.ui)

            const { modelValue } = useVModels(props, emit)

            const tempArray = []

            // if (modelValue.value) {
            //     if (!isEdit.value) {
            //         Object.keys(modelValue.value)?.forEach((key) => {
            //             if (modelValue.value[key].length > 0) {
            //                 modelValue.value[key]?.forEach((item) => {
            //                     tempArray.push(`${key}:${item}`)
            //                 })
            //             } else {
            //                 tempArray.push(key)
            //             }
            //         })
            //     } else {
            //         const tempModel = JSON.parse(modelValue.value)

            //         Object.keys(tempModel)?.forEach((key) => {
            //             if (tempModel[key].length > 0) {
            //                 tempModel[key]?.forEach((item) => {
            //                     tempArray.push(`${key}:${item}`)
            //                 })
            //             } else {
            //                 tempArray.push(key)
            //             }
            //         })
            //     }
            // }

            const localValue = ref(tempArray)

            const handleChange = () => {
                const map = {}
                localValue.value.forEach((item) => {
                    if (item.includes(':')) {
                        const first = item.split(':')[0]
                        map[first] = []
                    } else {
                        map[item] = []
                    }
                })
                localValue.value.forEach((item) => {
                    if (item.includes(':')) {
                        const first = item.split(':')[0]
                        const second = item.split(':')[1]
                        map[first].push(second)
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
            }
        },
    })
</script>

<style lang="scss" scoped></style>
