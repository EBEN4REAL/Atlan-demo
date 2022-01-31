<template>
    <a-input
        v-if="type === 'text'"
        v-model:value="localeValue"
        :disabled="readOnly && !subpanel?.filter?.isVariable"
        placeholder="Enter Value"
        class="flex-1 w-full border-gray-200 rounded focus:border-primary-focus focus:border-2 focus:outline-none"
        style="height: 32px !important"
        @change="(event) => onChange(event, type)"
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
        v-else-if="type === 'number'"
        v-model:value="localeValue"
        :disabled="readOnly && !subpanel?.filter?.isVariable"
        placeholder="Enter Numeric Value"
        class="flex-1 border-gray-300 rounded box-shadow focus:border-primary-focus focus:border-2 focus:outline-none"
        style="height: 32px !important"
        @change="(event) => onChange(event, type)"
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

    <div v-else-if="type === 'date'" class="relative flex flex-1">
        <a-date-picker
            placeholder="Select Date"
            :show-time="{ format: 'HH:mm' }"
            v-model:value="localeValue"
            :disabled="readOnly && !subpanel?.filter?.isVariable"
            class="flex-1 w-full border-gray-300 rounded box-shadow focus:border-primary-focus focus:border-2 focus:outline-none"
            style="height: 32px !important"
            @change="(event) => onChange(event, type)"
        >
            <template #suffixIcon>
                <div class="w-6 h-4"></div>
            </template>
        </a-date-picker>
        <div class="absolute right-2.5 top-1">
            <CustomVariableTrigger
                :subpanel="subpanel"
                v-if="!(readOnly && !subpanel?.filter?.isVariable)"
                :index="index"
                v-model:subpanels="subpanels"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        watch,
        toRefs,
        Ref,
        PropType,
        computed,
        inject,
        toRaw,
        ComputedRef,
        onUnmounted,
    } from 'vue'
    import { useVModels } from '@vueuse/core'
    import dayjs from 'dayjs'
    import CustomVariableTrigger from './customVariableTrigger.vue'
    import { SubpanelFilter } from '~/types/insights/VQBPanelFilter.interface'
    import { useVQB } from '~/components/insights/playground/editor/vqb/composables/useVQB'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

    export default defineComponent({
        name: 'Sub panel',
        components: { CustomVariableTrigger },
        props: {
            type: {
                type: String,
                required: true,
                default: 'text',
            },
            inputValue: {
                type: String,
                required: true,
            },
            selectedFilter: {
                type: Object,
                required: true,
            },
            index: {
                type: Number,
                required: true,
            },
            subpanel: {
                type: Object as PropType<SubpanelFilter>,
                required: true,
                default: () => {},
            },
            subpanels: {
                type: Object as PropType<SubpanelFilter[]>,
                required: true,
                default: [],
            },
        },

        setup(props, { emit }) {
            const { type, selectedFilter, subpanel, index } = toRefs(props)
            const { inputValue, subpanels } = useVModels(props)
            const dateFormat = 'YYYY-MM-DD HH:mm:ss'
            const localeValue: Ref<any> = ref(inputValue.value)
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>

            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as ComputedRef<activeInlineTabInterface>

            const inlineTabs = inject(
                'inlineTabs'
            ) as ComputedRef<activeInlineTabInterface>

            const { updateVQB } = useVQB()

            watch(
                [selectedFilter],
                () => {
                    if (type.value === 'date') {
                        if (inputValue.value)
                            localeValue.value = dayjs(inputValue.value)
                        /* Else is IMP here otherwise it will break */ else
                            localeValue.value = ''
                    } else localeValue.value = inputValue.value
                },
                { immediate: true }
            )

            if (type.value === 'date' && inputValue.value) {
                if (Array.isArray(inputValue.value)) {
                    if (inputValue.value[0])
                        localeValue.value = dayjs(inputValue.value[0])
                } else {
                    localeValue.value = dayjs(inputValue.value)
                }
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

            const onChange = (event, type) => {
                if (type === 'text') {
                    inputValue.value = localeValue.value
                } else if (type == 'date') {
                    // event -> date in YYYY-MM-DD HH:mm:ss format in string
                    inputValue.value = localeValue.value?.format(dateFormat)
                } else if (type == 'number') {
                    inputValue.value = localeValue.value
                }

                createDebounce()(() => {
                    updateVQB(activeInlineTab, inlineTabs)
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
                readOnly,
                index,
                type,
                localeValue,
                onChange,
                inputValue,
                isNumberKey,
                subpanel,
                subpanels,
            }
        },
    })
</script>
<style lang="less" scoped>
    .box-shadow {
        box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.05);
    }
</style>
