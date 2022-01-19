<template>
    <UserSelector
        v-if="dataType === 'users' || dataType === 'user'"
        v-model:value="localValue"
        :multiple="multiple"
        @change="handleInputChange"
    />
    <GroupSelector
        v-else-if="dataType === 'groups'"
        v-model:value="localValue"
        :multiple="multiple"
        @change="handleInputChange"
    ></GroupSelector>
    <MultiInput
        v-else-if="
            [
                'number',
                'int',
                'long',
                'float',
                'url',
                'string',
                'text',
            ].includes(dataType.toLowerCase()) && multiple
        "
        v-model="localValue"
        class="flex-grow shadow-none"
        placeholder="Press Enter to add"
        :data-type="dataType"
        @change="handleInputChange"
    />
    <a-input
        v-else-if="dataType === 'url'"
        v-model:value="localValue"
        :maxlength="max || 50"
        @change="handleInputChange"
    ></a-input>
    <a-input
        v-else-if="['string', 'text'].includes(dataType)"
        v-model:value="localValue"
        :maxlength="max || 50"
        @change="handleInputChange"
    ></a-input>
    <a-input-number
        v-else-if="
            ['int', 'long', 'integer', 'number'].includes(
                dataType.toLowerCase()
            )
        "
        v-model:value="localValue"
        :precision="0"
        @change="handleInputChange"
        @keydown="handleNumberKeyPress"
    ></a-input-number>
    <a-switch
        v-else-if="dataType === 'switch'"
        v-model:checked="localValue"
        @change="handleInputChange"
    />
    <a-input-number
        v-else-if="['double', 'float'].includes(dataType.toLowerCase())"
        v-model:value="localValue"
        @change="handleInputChange"
        @keydown="handleNumberKeyPress"
    ></a-input-number>

    <a-date-picker
        v-else-if="['date', 'datetime'].includes(dataType.toLowerCase())"
        v-model:value="localValue"
        :show-now="false"
        :format="
            dataType.toLowerCase() === 'datetime'
                ? 'DD/MM/YYYY HH:mm:ss'
                : 'DD/MM/YYYY'
        "
        :dropdown-class-name="
            dataType.toLowerCase() === 'date' ? 'hide_time_panel' : ''
        "
        :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }"
        :allow-clear="true"
        value-format="x"
        @change="handleInputChange"
    />

    <a-radio-group
        v-else-if="['boolean'].includes(dataType.toLowerCase())"
        v-model:value="localValue"
        button-style="solid"
        class="flex"
        @change="handleInputChange"
    >
        <a-radio-button :value="true" class="flex-1 text-center">
            Yes
        </a-radio-button>
        <a-radio-button :value="false" class="flex-1 text-center">
            No
        </a-radio-button>
    </a-radio-group>
    <EnumSelector
        v-else
        v-model="localValue"
        :enum="dataType"
        :multiple="multiple"
        @change="handleInputChange"
    />
</template>

<script lang="ts">
    import { useVModels } from '@vueuse/core'
    import {
        defineAsyncComponent,
        toRefs,
        defineComponent,
        ref,
        watch,
        onMounted,
        Ref,
    } from 'vue'

    import UserSelector from '@/common/select/users.vue'
    import GroupSelector from '@/common/select/groups.vue'
    import EnumSelector from '@/common/select/enum.vue'
    import MultiInput from './customizedTagInput.vue'
    import { isFloat } from '~/utils/checkType'

    import dayjs, { Dayjs } from 'dayjs'
    import utc from 'dayjs/plugin/utc'
    dayjs.extend(utc)
    // import useAsyncSelector from './useAsyncSelector'
    // import useAsyncTreeSelect from './useAsyncTreeSelect'
    // import useFileUploader from './useFileUploader'

    export default defineComponent({
        components: { UserSelector, GroupSelector, EnumSelector, MultiInput },
        props: {
            modelValue: {},
            dataType: {
                type: String,
                required: false,
                default: () => '',
            },
            max: { type: Number },
            multiple: { type: Boolean, default: false },
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const { modelValue, multiple } = useVModels(props, emit)

            const { dataType } = toRefs(props)

            let val = modelValue.value

            if (props.dataType.toLowerCase() === 'date' && modelValue.value) {
                val = dayjs(modelValue.value)
            }
            const localValue: any = ref(val)

            // set proper default value
            if (multiple.value && !localValue.value) localValue.value = []
            else if (localValue.value == null) localValue.value = ''

            const handleInputChange = (v) => {
                if (
                    props.dataType.toLowerCase() === 'date' ||
                    props.dataType.toLowerCase() === 'datetime'
                ) {
                    const date = localValue.value
                    // ? reset miliseconds to 000 in case of date
                    modelValue.value = Math.floor(date.valueOf() / 1000) * 1000
                } else {
                    modelValue.value = localValue.value
                }
                emit('change')
            }

            // const disabledDate = (current: Dayjs) =>
            //     // Can not select days before today and today
            //     current > dayjs().endOf('day')

            const handleNumberKeyPress = (v) => {
                if (
                    !['int', 'long', 'number', 'double', 'float'].includes(
                        dataType.value.toLowerCase()
                    )
                )
                    return
                const allowDecimal = ['double', 'float', 'decimal'].includes(
                    dataType.value.toLowerCase()
                )
                const n = parseInt(v.key, 10)
                if (Number.isNaN(n)) {
                    // * if dataType is decimal then allow '.' only one time
                    if (
                        allowDecimal &&
                        typeof localValue.value === 'number' &&
                        v.key === '.' &&
                        !isFloat(localValue.value)
                    )
                        return
                    if (
                        ![
                            'Tab',
                            'Backspace',
                            'ArrowDown',
                            'ArrowUp',
                            'ArrowRight',
                            'ArrowLeft',
                            'Enter',
                        ].includes(v.key) &&
                        !v.metaKey
                    )
                        v.preventDefault()
                }
            }

            return {
                handleNumberKeyPress,
                localValue,
                handleInputChange,
                dayjs,
                // disabledDate,
            }
        },
    })
</script>

<style lang="less">
    .hide_time_panel .ant-picker-time-panel {
        @apply hidden;
    }
</style>
