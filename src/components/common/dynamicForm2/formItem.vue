<template>
    <div class="grid grid-cols-12 gap-x-4">
        <template v-for="property in list" :key="`${property.id}`">
            <div
                :class="
                    getCol(property.ui.grid, property.ui.start, property.ui.end)
                "
                v-if="!property.ui?.hidden"
            >
                <Component
                    v-if="
                        componentName(property) === 'credential' ||
                        componentName(property) === 'nested' ||
                        componentName(property) === 'connection'
                    "
                    :is="componentName(property)"
                    v-model="formState[property.id]"
                    :property="property"
                ></Component>

                <a-form-item
                    :name="property.name"
                    :help="property.ui?.help"
                    :required="property.required"
                    :rules="property.ui.rules"
                    v-else
                >
                    <template #label>
                        {{ property.ui?.label }}
                        <a-tooltip
                            :title="property.ui.help"
                            v-if="property.ui.help"
                            placement="topRight"
                        >
                            <AtlanIcon icon="Info" class="ml-1"></AtlanIcon>
                        </a-tooltip>
                    </template>
                    <Component
                        :is="componentName(property)"
                        v-model="formState[property.id]"
                        :baseKey="baseKey"
                        :property="property"
                    ></Component>
                </a-form-item>
            </div>
        </template>
    </div>
</template>

<script>
    import {
        defineComponent,
        toRefs,
        reactive,
        watch,
        inject,
        ref,
        onBeforeMount,
        onMounted,
    } from 'vue'
    import { useVModels } from '@vueuse/core'

    import Input from './widget/input.vue'
    import Boolean from './widget/boolean.vue'
    import InputNumber from './widget/inputNumber.vue'
    import Select from './widget/select.vue'
    import Radio from './widget/selectRadio.vue'
    import Nested from './widget/nested.vue'
    import Credential from './widget/credential.vue'
    // import Form from './widget/form.vue'
    // import Section from './widget/section.vue'
    import Sql from './widget/sql.vue'
    import Sqltree from './widget/sqltree.vue'
    import Password from './widget/password.vue'
    import Connection from './widget/connection.vue'
    import Users from './widget/users.vue'
    import UserMultiple from './widget/userMultiple.vue'
    import Groups from './widget/groups.vue'
    import GroupMultiple from './widget/groupMultiple.vue'
    import Schedule from './widget/schedule.vue'
    import Alias from './widget/alias.vue'
    import AtlanIcon from '../icon/atlanIcon.vue'

    export default defineComponent({
        name: 'DynamicForm',
        components: {
            Credential,
            Input,
            InputNumber,
            Boolean,
            Select,
            Radio,
            Sql,
            Password,
            Nested,
            Sqltree,
            Connection,
            Users,
            Groups,
            UserMultiple,
            GroupMultiple,
            Schedule,
            Alias,
            AtlanIcon,
        },
        props: {
            configMap: {
                required: false,
                type: Object,
            },
            currentStep: {
                required: false,
                type: Object,
            },
            baseKey: {
                required: false,
                type: String,
            },
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const { configMap, currentStep, baseKey } = toRefs(props)

            const formState = inject('formState')

            const componentName = (property) => {
                if (!property.ui?.widget) {
                    switch (property.type) {
                        case 'string':
                            return 'Input'
                        case 'number':
                            return 'InputNumber'
                        case 'boolean':
                            return 'Boolean'
                        case 'array':
                            return 'Select'
                        case 'object':
                            return 'Form'
                        default:
                            return 'Input'
                    }
                } else {
                    return property.ui.widget
                }
            }

            const getCol = (grid = 12, start, end) => {
                let c = `col-span-${grid}`
                if (start) c += ` col-start-${start}`
                if (end) c += ` col-start-${start}`

                return c
            }

            const setDefaultValue = () => {
                if (configMap.value?.properties) {
                    Object.keys(configMap?.value?.properties).forEach((key) => {
                        if (formState) {
                            if (!formState[getName(key)]) {
                                formState[getName(key)] =
                                    configMap?.value?.properties[
                                        key
                                    ]?.default?.toString()
                            }
                        }
                    })
                }
            }

            watch(formState, () => {
                calculateList()
            })

            onBeforeMount(() => {
                setDefaultValue()
                calculateList()
            })

            const getName = (name) => {
                if (baseKey.value) {
                    return `${baseKey.value}.${name}`
                }
                return name
            }

            const list = ref([])
            const calculateList = () => {
                isImplied()
                const temp = []
                if (configMap.value?.properties) {
                    if (currentStep.value?.properties) {
                        currentStep.value?.properties.forEach((key) => {
                            const found = Object.keys(
                                configMap?.value?.properties
                            ).find((k) => k === key)
                            if (found) {
                                if (
                                    !configMap.value?.properties[key].ui?.hidden
                                ) {
                                    temp.push({
                                        id: `${getName(key)}`,
                                        name: `${getName(key)}`,
                                        ...configMap.value?.properties[key],
                                    })
                                }
                            }
                        })
                    } else {
                        Object.keys(configMap?.value?.properties).forEach(
                            (key) => {
                                if (
                                    !configMap.value?.properties[key].ui?.hidden
                                ) {
                                    temp.push({
                                        id: `${getName(key)}`,
                                        name: `${getName(key)}`,
                                        ...configMap.value?.properties[key],
                                    })
                                }
                            }
                        )
                    }
                }

                list.value = temp
            }

            const isImplied = () => {
                if (configMap.value?.anyOf) {
                    configMap.value.anyOf.forEach((item) => {
                        let loopStop = false
                        Object.keys(item.properties).some((i) => {
                            if (loopStop) {
                                return
                            }
                            if (
                                formState[getName(i)] !==
                                item.properties[i]?.const
                            ) {
                                loopStop = true
                            }
                        })

                        if (!loopStop) {
                            item.required.forEach((i) => {
                                if (configMap.value.properties[i]) {
                                    configMap.value.properties[
                                        i
                                    ].ui.hidden = false
                                }
                            })
                        } else {
                            item.required.forEach((i) => {
                                if (configMap.value.properties[i]) {
                                    configMap.value.properties[
                                        i
                                    ].ui.hidden = true
                                }
                            })
                        }
                    })
                }
            }

            return {
                componentName,
                getName,
                formState,
                setDefaultValue,
                configMap,
                calculateList,
                list,
                baseKey,
                currentStep,
                isImplied,
                getCol,
            }
        },
    })
</script>

<style lang="scss" scoped></style>
