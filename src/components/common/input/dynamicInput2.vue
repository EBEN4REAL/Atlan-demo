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
    ></a-input-number>

    <a-date-picker
        v-else-if="['date'].includes(dataType.toLowerCase())"
        v-model:value="localValue"
        format="YYYY-MM-DD HH:mm:ss"
        :allow-clear="true"
        :disabled-date="disabledDate"
        :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }"
        @change="handleInputChange"
    />

    <a-radio-group
        v-else-if="['boolean'].includes(dataType.toLowerCase())"
        v-model:value="localValue"
        button-style="solid"
        class="flex"
        @change="handleInputChange"
    >
        <a-radio-button value="true" class="flex-1 text-center">
            Yes
        </a-radio-button>
        <a-radio-button value="false" class="flex-1 text-center">
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
    import dayjs, { Dayjs } from 'dayjs'
    import utc from 'dayjs/plugin/utc'
    import UserSelector from '@/common/select/users.vue'
    import GroupSelector from '@/common/select/groups.vue'
    import EnumSelector from '@/common/select/enum.vue'
    import MultiInput from './customizedTagInput.vue'

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
            else if (!localValue.value) localValue.value = ''

            const handleInputChange = (v) => {
                if (props.dataType.toLowerCase() === 'date') {
                    const date = localValue.value
                    modelValue.value = date?.valueOf()
                } else {
                    modelValue.value = localValue.value
                }
                emit('change')
            }

            const disabledDate = (current: Dayjs) =>
                // Can not select days before today and today
                current > dayjs().endOf('day')

            return {
                localValue,
                handleInputChange,
                dayjs,
                disabledDate,
            }
        },
    })
</script>

<style lang="less" scoped></style>
