<template>
    <a-select
        v-model:value="modelValue"
        mode="tags"
        :placeholder="placeholder"
        :allow-clear="true"
        :open="dropdownOpen"
        style="width: 100%"
        :dropdown-style="{ display: 'none' }"
        @keydown.tab="(e) => e.preventDefault()"
        @change="change"
        @keyup.enter="dropdownOpen = false"
        @input-key-down="handleNumberKeyPress"
    >
        <template #dropdownRender="{ menuNode: menu }" />
    </a-select>
</template>

<script setup lang="ts">
    import { defineProps, defineEmits, ref, watch, toRefs } from 'vue'
    import { useVModels } from '@vueuse/core'

    const props = defineProps({
        modelValue: { type: Array, default: () => [] },
        placeholder: { type: String, default: '' },
        dataType: { type: String, default: '' },
    })

    const emit = defineEmits(['change'])

    const { modelValue } = useVModels(props, emit)

    const { dataType } = toRefs(props)

    const handleNumber = (v) => {
        modelValue.value = v.map((s) => parseInt(s, 10))
    }

    const handleDecimal = (v) => {
        modelValue.value = v.map((s) => parseFloat(s))
    }
    const dropdownOpen = ref(false)

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
            if (allowDecimal && v.key === '.') return
            v.preventDefault()
        }
    }

    const change = (v) => {
        if (['int', 'long', 'number'].includes(dataType.value.toLowerCase()))
            handleNumber(v)
        else if (['double', 'float'].includes(dataType.value.toLowerCase()))
            handleDecimal(v)
        emit('change')
    }
</script>

<style scoped></style>
