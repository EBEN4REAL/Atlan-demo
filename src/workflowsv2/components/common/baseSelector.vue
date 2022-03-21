<template>
    <a-select
        class="w-52"
        :value="value"
        allow-clear
        show-search
        :get-popup-container="(target) => target.parentNode"
        @update:value="$emit('update:value', $event)"
    >
        <template #suffixIcon>
            <AtlanLoader v-if="loading" />
            <AtlanIcon v-else icon="CaretDown" />
        </template>
        <template v-for="item in list" :key="item.id">
            <a-select-option :value="item.id">
                <div class="flex items-center truncate gap-x-2">
                    <img v-if="item.icon" :src="item.icon" class="w-4 h-auto" />
                    {{ item.label }}
                </div>
            </a-select-option>
        </template>
    </a-select>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'

    interface selectorOptions {
        id: string
        label: string
        icon?: string
    }

    export default defineComponent({
        name: 'BaseSelector',
        components: {},
        props: {
            value: { type: String, default: () => undefined },
            list: {
                type: Array as PropType<selectorOptions[]>,
                required: true,
                default: () => [],
            },
            loading: { type: Boolean, default: () => false },
        },
        emits: ['update:value'],
    })
</script>
