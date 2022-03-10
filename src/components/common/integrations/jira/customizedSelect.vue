<template>
    <a-select
        v-model:value="value"
        :disabled="disabled"
        :dropdown-class-name="dropdownClassName"
        :placeholder="placeholder"
        :mode="multiple ? 'multiple' : ''"
        class="w-full rounded-xl"
        @change="handleChange"
        show-arrow
    >
        <a-select-option
            v-for="o in options"
            :key="o.value"
            class="p-2 mx-1 rounded cursor-pointer hover:bg-gray-100"
            :class="o.value === value ? 'bg-primary-light' : ''"
            @click="handleClick(o.value)"
        >
            <span class="flex items-center gap-x-2">
                <img
                    v-if="o.meta?.iconUrl"
                    :src="o.meta.iconUrl"
                    class="h-5 rounded-full"
                />
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
        value: { type: [String, Array], required: true },
        disabled: { type: Boolean, default: false },
        multiple: { type: Boolean, default: false },
        dropdownClassName: { type: String, default: '' },
        placeholder: { type: String, default: '' },
        options: { type: Array, default: [] },
    })

    const emit = defineEmits(['change', 'update:value'])

    const { value } = useVModels(props, emit)

    const handleChange = (a) => {
        console.log('handleChange', a)
        emit('change', a)
    }

    const handleClick = (v) => {
        if (props.multiple) {
            if (Array.isArray(value.value)) {
                const index = value.value.indexOf(v)
                if (index > -1) value.value.splice(index, 1)
                else value.value.push(v)
            } else value.value = [v]
        }
    }
</script>

<style scoped></style>
