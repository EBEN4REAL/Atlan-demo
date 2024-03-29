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
                    v-if="compoundWidgets.includes(componentName(property))"
                    :is="componentName(property)"
                    v-model="formState[property.id]"
                    :property="property"
                    :is-edit="isEdit"
                />

                <Component
                    v-else-if="staticWidgets.includes(property.ui?.widget)"
                    :is="componentName(property)"
                    :class="property.ui?.class"
                    :style="property.ui?.style"
                    >{{ property.ui?.label }}</Component
                >

                <a-form-item
                    v-else
                    :name="property.name"
                    :required="property.required"
                    :rules="property.ui.rules"
                >
                    <template v-if="property.ui?.label" #label>
                        <AtlanIcon
                            icon="Lock2"
                            class="h-3 mr-1 text-yellow-500 mb-0.5"
                            v-if="
                                (property.ui.widget === 'password' ||
                                    isUsername(property)) &&
                                isEdit
                            "
                        ></AtlanIcon>
                        {{ property.ui?.label }}

                        <a-tooltip
                            tabindex="-1"
                            :title="property.ui.help"
                            v-if="property.ui.help"
                            placement="topRight"
                        >
                            <span
                                ><AtlanIcon icon="Info" class="ml-1"></AtlanIcon
                            ></span>
                        </a-tooltip>
                    </template>

                    <Component
                        :is="componentName(property)"
                        v-model="formState[property.id]"
                        :base-key="baseKey"
                        :property="property"
                        :config-map="configMap"
                        :is-edit="isEdit"
                    />
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
    import { useRoute } from 'vue-router'

    import Input from './widget/input.vue'
    import TextInput from './widget/textarea.vue'
    import Boolean from './widget/boolean.vue'
    import InputNumber from './widget/inputNumber.vue'
    import Select from './widget/select.vue'
    import Radio from './widget/selectRadio.vue'
    import Nested from './widget/nested.vue'
    import Credential from './widget/credential.vue'
    // import Form from './widget/form.vue'
    // import Section from './widget/section.vue'
    import Sql from './widget/sql.vue'
    import Date from './widget/date.vue'
    import Datetime from './widget/datetime.vue'
    import Sqltree from './widget/sqltree.vue'
    import Apitree from './widget/apitree.vue'
    import Password from './widget/password.vue'
    import Connection from './widget/connection.vue'
    import Users from './widget/users.vue'
    import UserMultiple from './widget/userMultiple.vue'
    import Groups from './widget/groups.vue'
    import GroupMultiple from './widget/groupMultiple.vue'
    import Schedule from './widget/schedule.vue'
    import ConnectionSelector from './widget/connectionSelector.vue'
    import CombinedUserSelector from './widget/combinedUserSelector.vue'
    import Alias from './widget/alias.vue'
    import AtlanIcon from '@/common/icon/atlanIcon.vue'
    import Sage from './widget/authCheck.vue'

    export default defineComponent({
        name: 'DynamicForm',
        components: {
            Credential,
            Input,
            TextInput,
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
            ConnectionSelector,
            Datetime,
            Apitree,
            Date,
            Sage,
            CombinedUserSelector,
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
            isEdit: {
                required: false,
            },
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const { configMap, currentStep, baseKey, isEdit } = toRefs(props)

            const formState = inject('formState')

            const staticWidgets = ['header', 'divider']
            const compoundWidgets = ['credential', 'nested', 'connection']
            const route = useRoute()

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
                    switch (property.ui?.widget) {
                        case 'divider':
                            return 'a-divider'
                        case 'header':
                            return 'h5'
                        default:
                            return property.ui.widget
                    }
                }
            }

            const isUsername = (property) => {
                if (property.id.endsWith('.username')) return true
                return false
            }

            const getCol = (grid = 12, start, end) => {
                let c = `col-span-${grid}`
                if (start) c += ` col-start-${start}`
                if (end) c += ` col-start-${start}`

                return c
            }

            const setDefaultValue = () => {
                if (!isEdit.value) {
                    if (configMap.value?.properties) {
                        Object.keys(configMap?.value?.properties).forEach(
                            (key) => {
                                if (formState) {
                                    if (!formState[getName(key)]) {
                                        if (
                                            configMap?.value?.properties[key]
                                                .type === 'boolean'
                                        ) {
                                            formState[getName(key)] =
                                                configMap?.value?.properties[
                                                    key
                                                ]?.default
                                        } else {
                                            formState[getName(key)] =
                                                configMap?.value?.properties[
                                                    key
                                                ]?.default?.toString()
                                        }
                                    }
                                }
                            }
                        )

                        Object.keys(route.query).forEach((key) => {
                            if (getName(key) in formState)
                                formState[getName(key)] = route.query[key]
                        })
                    }
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

            const isImplied = () => {
                if (configMap.value?.anyOf) {
                    configMap.value.anyOf.forEach((item) => {
                        item.required.forEach((i) => {
                            console.log('configMap', i)
                            if (
                                configMap.value.properties &&
                                configMap.value.properties[i]
                            ) {
                                configMap.value.properties[i].ui.hidden = true
                            }
                        })
                    })

                    console.log('configMap', configMap.value)

                    const findMatch = []
                    configMap.value.anyOf.forEach((item) => {
                        const loopStop = Object.keys(item.properties).every(
                            (i) => {
                                if (
                                    formState[getName(i)] ===
                                    item.properties[i]?.const
                                ) {
                                    return true
                                }
                            }
                        )
                        if (loopStop) {
                            findMatch.push(item)
                        }
                    })

                    if (findMatch.length > 0) {
                        findMatch.forEach((i) => {
                            i.required.forEach((i) => {
                                if (
                                    configMap.value.properties &&
                                    configMap.value.properties[i]
                                ) {
                                    configMap.value.properties[
                                        i
                                    ].ui.hidden = false
                                }
                            })
                        })
                    }
                }
            }

            const list = ref([])

            const getPropertyfromConfigMap = (key) => {
                const property = configMap.value?.properties[key]

                let baseObj = {
                    id: `${getName(key)}`,
                    name: `${getName(key)}`,
                }

                if (property.type === 'conditional') {
                    const { conditions, ...rest } = property
                    const firstFind = property.conditions?.find(
                        (p) => formState[p.property] === p.value
                    )
                    baseObj = { ...baseObj, ...rest, ...firstFind }
                } else {
                    baseObj = { ...baseObj, ...property }
                }

                return baseObj
            }

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
                                    temp.push(getPropertyfromConfigMap(key))
                                }
                            }
                        })
                    } else {
                        Object.keys(configMap?.value?.properties).forEach(
                            (key) => {
                                if (
                                    !configMap.value?.properties[key].ui?.hidden
                                ) {
                                    temp.push(getPropertyfromConfigMap(key))
                                }
                            }
                        )
                    }
                }

                list.value = temp
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
                isEdit,
                isUsername,
                staticWidgets,
                compoundWidgets,
            }
        },
    })
</script>

<style lang="scss" scoped></style>
