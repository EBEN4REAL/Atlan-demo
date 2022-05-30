<template>
    <APITreeSelect
        v-model="localValue"
        :credential="credentialBody"
        :credentialID="credentialID"
        :templateConfig="templateConfig"
        @change="handleChange"
    ></APITreeSelect>
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

    import APITreeSelect from '@common/treeselect/api/index.vue'
    import { useWorkflowHelper } from '~/workflows/composables/package/useWorkflowHelper'
    import { useVModels } from '@vueuse/core'

    import { mergeDeep } from '~/utils/array'

    export default defineComponent({
        name: 'APITreeForm',
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
                type: Object,
                required: false,
                default: () => {},
            },
            configMap: {
                required: false,
                type: Object,
                default: () => {},
            },
            isEdit: {
                type: Boolean,
                required: false,
                default: () => false,
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { property, baseKey, configMap, isEdit } = toRefs(props)
            const formState = inject('formState')
            const componentProps = computed(() => property.value.ui)

            const { modelValue } = useVModels(props, emit)

            const initArray = []

            const objectToPath = (val, prefix) => {
                // If any other type of data is input, return []
                if (typeof val !== 'object') return []
                // Base case, return prefix or empty array
                if (!Object.keys(val)?.length) return prefix ? [prefix] : []

                // Else return the keys as an array with prefix prepended
                const ta = []
                Object.keys(val).forEach((key) => {
                    const fv = objectToPath(val[key], key)
                    fv.forEach((fvl) => {
                        if (prefix) ta.push(`${prefix}:${fvl}`)
                        else ta.push(fvl)
                    })
                })
                return ta
            }

            if (modelValue.value) {
                try {
                    // Setup flow
                    if (!isEdit.value) {
                        const tempModel = modelValue.value
                        initArray.push(...objectToPath(tempModel))
                    }
                    // edit flow
                    else {
                        const tempModel = JSON.parse(modelValue.value)
                        initArray.push(...objectToPath(tempModel))
                    }
                } catch (err) {
                    console.error(err)
                }
            }

            const localValue = ref(initArray)

            const pathToObject = (path: string) => {
                if (!path) return {}
                const splits = path.split(':')

                if (splits.length === 1) return { [path]: {} }

                return { [splits[0]]: pathToObject(splits.slice(1).join(':')) }
            }

            const handleChange = () => {
                const objArray = localValue.value.map((item) =>
                    pathToObject(item)
                )
                modelValue.value = mergeDeep({}, ...objArray)
                emit('change', modelValue.value)
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

            const templateConfig = computed(() => {
                const config = {}
                if (property.value?.ui?.metadataTransformerTemplateKey)
                    config.metadataTransformerTemplateKey =
                        property.value.ui.metadataTransformerTemplateKey
                if (property.value?.ui?.metadataTemplateKey)
                    config.metadataTemplateKey =
                        property.value.ui.metadataTemplateKey
                return config
            })

            return {
                componentProps,
                formState,
                credentialBody,
                baseKey,
                localValue,
                handleChange,
                credentialID,
                templateConfig,
            }
        },
    })
</script>

<style lang="scss" scoped></style>
