<template>
    <a-select
        v-model:value="value"
        :disabled="disabled"
        :dropdown-class-name="dropdownClassName"
        :placeholder="placeholder"
        class="w-full rounded-xl"
        @change="$emit('change', value)"
    >
        <a-select-option
            v-for="o in options"
            :key="o.value"
            class="p-2 mx-1 rounded cursor-pointer hover:bg-gray-100"
            :class="o.value === value ? 'bg-primary-light' : ''"
            @click="value = o.value"
        >
            <span class="flex items-center gap-x-2">
                <img :src="o.meta.iconUrl" class="h-5 rounded-full" />
                {{ o.label }}
            </span>
        </a-select-option>
        <template #suffixIcon>
            <AtlanIcon icon="CaretDown" class="text-gray-500" />
        </template>
    </a-select>
</template>

<script setup lang="ts">
    import { useVModels } from '@vueuse/core'

    const props = defineProps({
        value: { type: String, required: true },
        disabled: { type: Boolean, default: false },
        dropdownClassName: { type: String, default: '' },
        placeholder: { type: String, default: '' },
        options: { type: Array, default: [] },
    })

    const emit = defineEmits(['change'])

    const { value } = useVModels(props, emit)
</script>

<style scoped></style>
