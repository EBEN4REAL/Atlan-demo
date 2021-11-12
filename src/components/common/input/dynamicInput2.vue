<template>
    <a-input
        v-if="dataType === 'string'"
        v-model:value="localValue"
        @change="handleInputChange"
        :maxlength="max || 50"
    ></a-input>
    <a-input-number
        v-if="['int', 'long'].includes(dataType.toLowerCase())"
        v-model:value="localValue"
        @change="handleInputChange"
        :precision="0"
    ></a-input-number>
    <a-input-number
        v-if="['double', 'float'].includes(dataType.toLowerCase())"
        v-model:value="localValue"
    ></a-input-number>
    <UserSelector
        v-if="['__user'].includes(dataType.toLowerCase())"
        v-model:value="localValue"
        @change="handleInputChange"
    ></UserSelector>

    <a-date-picker
        v-if="['datetime'].includes(dataType.toLowerCase())"
        v-model:value="localValue"
        format="YYYY-MM-DD HH:mm:ss"
        :allowClear="true"
        :disabled-date="disabledDate"
        @change="handleInputChange"
        :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }"
    />

    <a-radio-group
        button-style="solid"
        class="flex"
        v-if="['boolean'].includes(dataType.toLowerCase())"
        v-model:value="localValue"
        @change="handleInputChange"
    >
        <a-radio-button value="true" class="flex-1 text-center">
            Yes
        </a-radio-button>
        <a-radio-button value="false" class="flex-1 text-center">
            No
        </a-radio-button>
    </a-radio-group>
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
    import AtlanIcon from '../icon/atlanIcon.vue'
    import dayjs, { Dayjs } from 'dayjs'

    import utc from 'dayjs/plugin/utc'
    dayjs.extend(utc)
    // import useAsyncSelector from './useAsyncSelector'
    // import useAsyncTreeSelect from './useAsyncTreeSelect'
    // import useFileUploader from './useFileUploader'

    export default defineComponent({
        components: { UserSelector, AtlanIcon },
        props: {
            modelValue: {},
            dataType: { default: 'string' },
            max: { type: Number },
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)

            let val = modelValue.value

            if (
                props.dataType.toLowerCase() === 'datetime' &&
                modelValue.value
            ) {
                val = dayjs(modelValue.value)
            }
            const localValue = ref(val)

            const handleInputChange = () => {
                if (props.dataType.toLowerCase() === 'datetime') {
                    const date = localValue.value
                    modelValue.value = date?.valueOf()
                } else {
                    modelValue.value = localValue.value
                }
                emit('change')
            }

            const disabledDate = (current: Dayjs) => {
                // Can not select days before today and today
                return current > dayjs().endOf('day')
            }

            return { localValue, handleInputChange, dayjs, disabledDate }
        },
    })
</script>

<style lang="less" scoped></style>
