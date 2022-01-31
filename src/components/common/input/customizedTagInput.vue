<template>
    <a-select
        v-if="value !== null"
        :id="randomId"
        ref="inputRef"
        v-model:value="localValue"
        mode="tags"
        :placeholder="placeholder"
        :allow-clear="true"
        :open="dropdownOpen"
        style="width: 100%"
        :dropdown-style="{ display: 'none' }"
        @change="change"
        @keyup.enter="dropdownOpen = false"
        @input-key-down="handleNumberKeyPress"
    >
        <template #dropdownRender="{ menuNode: menu }" />
    </a-select>
    <a-select
        v-else
        ref="inputRef"
        v-model:value="modelValue"
        mode="tags"
        :placeholder="placeholder"
        :allow-clear="true"
        :open="dropdownOpen"
        style="width: 100%"
        :dropdown-style="{ display: 'none' }"
        @change="change"
        @keyup.enter="dropdownOpen = false"
        @input-key-down="handleNumberKeyPress"
    >
        <template #dropdownRender="{ menuNode: menu }" />
    </a-select>
</template>

<script setup lang="ts">
    import { defineProps, defineEmits, ref, watch, toRefs, nextTick } from 'vue'
    import { useVModels } from '@vueuse/core'

    const props = defineProps({
        modelValue: { type: Array, default: () => [] },
        value: { type: Array, default: null },
        placeholder: { type: String, default: '' },
        dataType: { type: String, default: '' },
        delimiter: { type: String, default: '' },
    })

    const emit = defineEmits(['change'])

    const { modelValue, value } = useVModels(props, emit)

    const localValue = ref([])

    localValue.value = value.value

    const { dataType, delimiter } = toRefs(props)

    const handleNumber = (v) => {
        localValue.value = v.map((s) => parseInt(s, 10))
        modelValue.value = localValue.value
    }

    const handleDecimal = (v) => {
        localValue.value = v.map((s) => parseFloat(s))
        modelValue.value = localValue.value
    }
    const dropdownOpen = ref(false)

    const inputRef = ref()

    const focus = () => {
        inputRef.value.focus()
    }

    const randomId = ref(`${new Date().getTime()}`)

    const handleNumberKeyPress = (v) => {
        if (v.key === delimiter.value) {
            const element = document.getElementById(randomId.value)
            element.dispatchEvent(
                new KeyboardEvent('keydown', {
                    code: 'Enter',
                    key: 'Enter',
                    charCode: 13,
                    keyCode: 13,
                    view: window,
                    bubbles: true,
                })
            )
            v.preventDefault()
        }

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
            if (v.key !== 'Tab') v.preventDefault()
        }
    }

    const trimArr = (arr) => arr.map((s) => s.trim())

    const change = (v) => {
        let finalValue = trimArr(v)
        if (delimiter.value) {
            finalValue = v.reduce((acc, cur) => {
                acc.push(...cur.split(delimiter.value).filter((w) => !!w))
                return acc
            }, [])
            localValue.value = trimArr(finalValue)
        }
        if (['int', 'long', 'number'].includes(dataType.value.toLowerCase()))
            handleNumber(finalValue)
        else if (['double', 'float'].includes(dataType.value.toLowerCase()))
            handleDecimal(finalValue)

        emit('change', localValue.value)
    }
</script>

<style scoped></style>
