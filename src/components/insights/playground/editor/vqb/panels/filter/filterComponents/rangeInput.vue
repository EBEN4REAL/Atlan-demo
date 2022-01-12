<template>
    <div class="flex items-center">
        <a-input
            v-if="type === 'text'"
            v-model:value="firstvalue"
            :disabled="readOnly && !subpanel?.filter?.isVariable"
            placeholder="Enter  value"
            class="flex-1 w-full border-gray-300 rounded box-shadow focus:border-primary-focus"
            style="height: 32px !important"
            @change="(event) => onChange(event, 'first', type)"
        >
            <template #suffix>
                <CustomVariableTrigger
                    v-if="!(readOnly && !subpanel?.filter?.isVariable)"
                    :subpanel="subpanel"
                    :index="index"
                    v-model:subpanels="subpanels"
                />
            </template>
        </a-input>
        <div v-else-if="type === 'date'" class="relative flex flex-1">
            <a-date-picker
                v-model:value="firstvalue"
                :disabled="readOnly && !subpanel?.filter?.isVariable"
                class="flex-1 w-full border-gray-300 rounded box-shadow focus:border-primary-focus"
                @change="(event) => onChange(event, 'first', type)"
                :show-time="{ format: 'HH:mm' }"
                style="height: 32px !important"
                place
            >
                <template #suffixIcon>
                    <CustomVariableTrigger
                        v-if="!(readOnly && !subpanel?.filter?.isVariable)"
                        :subpanel="subpanel"
                        :index="index"
                        v-model:subpanels="subpanels"
                    />
                </template>
            </a-date-picker>
            <div class="absolute right-2.5 top-1">
                <CustomVariableTrigger
                    v-if="!(readOnly && !subpanel?.filter?.isVariable)"
                    :subpanel="subpanel"
                    :index="index"
                    v-model:subpanels="subpanels"
                />
            </div>
        </div>
        <a-input
            v-model:value="firstvalue"
            :disabled="readOnly && !subpanel?.filter?.isVariable"
            v-else-if="type === 'number'"
            placeholder="Enter numeric value"
            class="flex-1 w-full border-gray-300 rounded box-shadow focus:border-primary-focus"
            style="height: 32px !important"
            @change="(event) => onChange(event, 'first', type)"
            type="number"
        >
            <template #suffix>
                <CustomVariableTrigger
                    v-if="!(readOnly && !subpanel?.filter?.isVariable)"
                    :subpanel="subpanel"
                    :index="index"
                    v-model:subpanels="subpanels"
                />
            </template>
        </a-input>
        <a-input
            v-if="type === 'text'"
            v-model:value="secondValue"
            :disabled="readOnly && !subpanel?.filter?.isVariable"
            placeholder="Enter value"
            class="flex-1 w-full ml-3 border-gray-300 rounded box-shadow focus:border-primary-focus"
            style="height: 32px !important"
            @change="(event) => onChange(event, 'second', type)"
        >
            <template #suffix>
                <CustomVariableTrigger
                    v-if="!(readOnly && !subpanel?.filter?.isVariable)"
                    :subpanel="subpanel"
                    :index="index"
                    v-model:subpanels="subpanels"
                />
            </template>
        </a-input>
        <div v-else-if="type === 'date'" class="relative flex flex-1">
            <a-date-picker
                v-model:value="secondValue"
                :disabled="readOnly && !subpanel?.filter?.isVariable"
                class="flex-1 w-full ml-3 border-gray-300 rounded box-shadow focus:border-primary-focus"
                style="height: 32px !important"
                :show-time="{ format: 'HH:mm' }"
                @change="(event) => onChange(event, 'second', type)"
            >
                <template #suffixIcon>
                    <CustomVariableTrigger
                        v-if="!(readOnly && !subpanel?.filter?.isVariable)"
                        :subpanel="subpanel"
                        :index="index"
                        v-model:subpanels="subpanels"
                    />
                </template>
            </a-date-picker>
            <div class="absolute right-2.5 top-1">
                <CustomVariableTrigger
                    v-if="!(readOnly && !subpanel?.filter?.isVariable)"
                    :subpanel="subpanel"
                    :index="index"
                    v-model:subpanels="subpanels"
                />
            </div>
        </div>
        <a-input
            v-else-if="type === 'number'"
            v-model:value="secondValue"
            :disabled="readOnly && !subpanel?.filter?.isVariable"
            placeholder="Enter numeric value"
            class="flex-1 w-full ml-3 border-gray-300 rounded box-shadow focus:border-primary-focus"
            style="height: 32px !important"
            @change="(event) => onChange(event, 'second', type)"
            type="number"
        >
            <template #suffix>
                <CustomVariableTrigger
                    v-if="!(readOnly && !subpanel?.filter?.isVariable)"
                    :subpanel="subpanel"
                    :index="index"
                    v-model:subpanels="subpanels"
                />
            </template>
        </a-input>
    </div>
</template>

<script lang="ts">
    import {
        toRefs,
        defineComponent,
        ref,
        watch,
        PropType,
        toRaw,
        inject,
        ComputedRef,
        computed,
    } from 'vue'
    import { useVModels } from '@vueuse/core'
    import dayjs, { Dayjs } from 'dayjs'
    import CustomVariableTrigger from './customVariableTrigger.vue'
    import { useVQB } from '~/components/insights/playground/editor/vqb/composables/useVQB'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { SubpanelFilter } from '~/types/insights/VQBPanelFilter.interface'

    export default defineComponent({
        name: 'Sub panel',
        components: { CustomVariableTrigger },
        props: {
            inputValue: {
                type: Array,
                required: true,
            },
            type: {
                type: String,
                required: true,
                default: 'text',
            },
            subpanel: {
                type: Object as PropType<SubpanelFilter>,
                required: true,
                default: () => {},
            },
            index: {
                type: Number,
                required: true,
            },
            subpanels: {
                type: Object as PropType<SubpanelFilter[]>,
                required: true,
                default: [],
            },
        },

        setup(props, { emit }) {
            const { inputValue, type, subpanels } = useVModels(props)
            const { subpanel, index } = toRefs(props)
            const dateFormat = 'YYYY-MM-DD HH:mm:ss'

            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as ComputedRef<activeInlineTabInterface>

            const inlineTabs = inject(
                'inlineTabs'
            ) as ComputedRef<activeInlineTabInterface>
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>

            const { updateVQB } = useVQB()

            let firstvalue = ref(undefined)
            let secondValue = ref(undefined)
            if (inputValue.value?.length > 0) {
                firstvalue.value = inputValue.value[0]
            }
            if (inputValue.value?.length > 0 && inputValue.value?.length == 2) {
                secondValue.value = inputValue.value[1]
            }

            if (
                type.value === 'date' &&
                inputValue.value &&
                inputValue.value?.length > 0
            ) {
                firstvalue.value = inputValue.value
                    ? dayjs(inputValue.value[0])
                    : undefined
                secondValue.value = inputValue.value
                    ? dayjs(inputValue.value[1])
                    : undefined
                inputValue.value[0] = firstvalue.value
                inputValue.value[1] = secondValue.value
            }

            let timeout = null

            function createDebounce() {
                return function (fnc, delayMs) {
                    clearTimeout(timeout)
                    timeout = setTimeout(() => {
                        fnc()
                    }, delayMs || 500)
                }
            }

            const onChange = (event, _pos, type) => {
                if (type === 'text') {
                    if (_pos === 'first') {
                        inputValue.value = [firstvalue.value, secondValue.value]
                    } else {
                        inputValue.value = [firstvalue.value, firstvalue.value]
                    }
                } else if (type === 'number') {
                    if (_pos === 'first') {
                        inputValue.value = [firstvalue.value, secondValue.value]
                    } else {
                        inputValue.value = [firstvalue.value, secondValue.value]
                    }
                } else if (type === 'date') {
                    // event -> date in YYYY-MM-DD HH:mm:ss format in string
                    inputValue.value = [
                        firstvalue.value?.format(dateFormat),
                        secondValue.value?.format(dateFormat),
                    ]
                }
                // updateVQB(activeInlineTabKey, inlineTabs)

                createDebounce()(() => {
                    updateVQB(activeInlineTabKey, inlineTabs)
                }, 2000)
            }
            function isNumberKey(evt) {
                const charCode = evt.which ? evt.which : evt.keyCode
                if (charCode > 31 && (charCode < 48 || charCode > 57))
                    return false
                return true
            }

            /* Accesss */
            const isQueryCreatedByCurrentUser = inject(
                'isQueryCreatedByCurrentUser'
            ) as ComputedRef
            const hasQueryWritePermission = inject(
                'hasQueryWritePermission'
            ) as ComputedRef

            const readOnly = computed(() =>
                activeInlineTab?.value?.qualifiedName?.length === 0
                    ? false
                    : isQueryCreatedByCurrentUser.value
                    ? false
                    : hasQueryWritePermission.value
                    ? false
                    : true
            )
            return {
                subpanels,
                index,
                subpanel,
                readOnly,
                isNumberKey,
                firstvalue,
                secondValue,
                onChange,
            }
        },
    })
</script>
<style lang="less" scoped>
    .box-shadow {
        box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.05);
    }
</style>
