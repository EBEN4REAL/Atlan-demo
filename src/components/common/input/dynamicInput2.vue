<template>
    <UserSelector
        v-if="dataType === 'user'"
        v-model:value="localValue"
        @change="handleInputChange"
    ></UserSelector>
    <GroupSelector
        v-else-if="dataType === 'groups'"
        v-model:value="localValue"
        @change="handleInputChange"
    ></GroupSelector>
    <a-input
        v-else-if="dataType === 'url'"
        v-model:value="localValue"
        @change="handleInputChange"
        :maxlength="max || 50"
    ></a-input>
    <a-input
        v-else-if="dataType === 'string'"
        v-model:value="localValue"
        @change="handleInputChange"
        :maxlength="max || 50"
    ></a-input>
    <a-input-number
        v-else-if="['int', 'long'].includes(dataType.toLowerCase())"
        v-model:value="localValue"
        @change="handleInputChange"
        :precision="0"
    ></a-input-number>
    <a-input-number
        v-else-if="['double', 'float'].includes(dataType.toLowerCase())"
        v-model:value="localValue"
    ></a-input-number>

    <a-date-picker
        v-else-if="['date'].includes(dataType.toLowerCase())"
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
        v-else-if="['boolean'].includes(dataType.toLowerCase())"
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
    <EnumSelector v-else :enum="dataType"></EnumSelector>
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
    import AtlanIcon from '../icon/atlanIcon.vue'
    import dayjs, { Dayjs } from 'dayjs'

    import utc from 'dayjs/plugin/utc'
    dayjs.extend(utc)
    // import useAsyncSelector from './useAsyncSelector'
    // import useAsyncTreeSelect from './useAsyncTreeSelect'
    // import useFileUploader from './useFileUploader'

    export default defineComponent({
        components: { UserSelector, GroupSelector, EnumSelector },
        props: {
            modelValue: {},
            dataType: {
                type: String,
                required: false,
                default: () => '',
            },
            max: { type: Number },
        },
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const { modelValue } = useVModels(props, emit)

            const { dataType } = toRefs(props)

            let val = modelValue.value

            if (props.dataType.toLowerCase() === 'date' && modelValue.value) {
                val = dayjs(modelValue.value)
            }
            const localValue = ref(val)

            const handleInputChange = () => {
                if (props.dataType.toLowerCase() === 'date') {
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

            return {
                localValue,
                handleInputChange,
                dayjs,
                disabledDate,
                dataType,
            }
        },
    })
</script>

<style lang="less" scoped></style>
