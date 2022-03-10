<template>
    <CustomSelect
        v-if="typeName === 'select'"
        v-model:value="localValue"
        :options="options"
        :multiple="multiple"
        :placeholder="`Select option`"
        @change="handleChange"
    />
    <DynamicInput
        v-else
        v-model="localValue"
        :data-type="typeName"
        class="w-full"
        :multiple="multiple"
        @change="handleChange"
    />
</template>

<script setup lang="ts">
    import { useVModels } from '@vueuse/core'
    import { computed, toRefs, ref } from 'vue'
    import DynamicInput from '~/components/common/input/dynamicInput2.vue'
    import CustomSelect from '@/common/integrations/jira/customizedSelect.vue'

    const props = defineProps({
        field: { type: Object, required: true },
        value: { type: [String, Array], required: true },
    })
    const emit = defineEmits(['change', 'update:modelValue', 'update:value'])

    const { field } = toRefs(props)
    const { value } = useVModels(props, emit)

    const localValue = ref(value.value)

    const multiple = computed(() => field.value?.data.schema.type === 'array')

    //  ?   This is a computed property that returns the appropriate type of the field., one that is supported by our components
    const typeName = computed(() => {
        const originalType =
            field.value?.data.schema?.items || field.value?.data.schema.type
        if (originalType === 'option') return 'select'
        if (originalType === 'priority') return 'select'
        if (originalType === 'user') return 'string'
        if (originalType === 'number') return 'float' // jria number includes float and decimal
        return originalType
    })

    const options = computed(() => {
        const allowedValues = field.value?.data?.allowedValues

        if (allowedValues) {
            return allowedValues.map((v) => ({
                label: v.value ?? v.name,
                value: v.id,
                meta: v,
            }))
        }
        return []
    })

    const handleChange = (_value) => {
        value.value = _value
        if (options.value.length) {
            const emitValue = options.value
                .filter((o) => _value.includes(o.value))
                .map((_v) => ({ ..._v.meta }))
            if (multiple.value) emit('change', emitValue)
            else emit('change', emitValue[0])
            return
        }

        emit('change', _value)
    }
</script>

<style scoped></style>
