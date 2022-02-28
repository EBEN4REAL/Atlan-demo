<template>
    <a-select
        v-model:value="modelValue"
        class=""
        :class="$style.selector"
        :dropdown-class-name="$style.projectsDropdown"
        :options="options"
        :placeholder="placeholder"
        :loading="isLoading"
        @change="handleChange"
    >
        <template #suffixIcon>
            <AtlanIcon icon="CaretDown" class="text-gray-500" />
        </template>
    </a-select>
</template>

<script setup lang="ts">
    import { useVModels } from '@vueuse/core'
    import { computed, onMounted, watch } from 'vue'
    import { listProjects } from '~/composables/integrations/jira/useJira'
    import booleanVue from '../../dynamicForm2/widget/boolean.vue'

    const { projects, isLoading, error } = listProjects()

    const props = defineProps({
        modelValue: { type: String, required: true },
        placeholder: { type: String, default: 'Select default project' },
        defaultSelectFirst: { type: Boolean, default: false },
    })
    const emit = defineEmits(['change'])

    const { modelValue } = useVModels(props, emit)

    const options = computed(() => {
        if (projects.value?.length) {
            return projects.value.map((p) => ({
                label: p.name,
                value: p.id,
            }))
        }
        return []
    })

    onMounted(() => {
        watch(projects, (v) => {
            if (v?.length && !modelValue.value && props.defaultSelectFirst)
                modelValue.value = options.value[0].value
        })
    })

    const handleChange = (value, option) => {
        emit('change', value, option)
    }
</script>

<style module lang="less">
    .selector {
        :global(.ant-select-selector) {
            @apply border border-gray-300 !important;
        }
    }
    .projectsDropdown {
        :global(.rc-virtual-list) {
            @apply px-1;
        }
        :global(.ant-select-item) {
            @apply p-2 rounded;
        }
        :global(.ant-select-item-option-selected) {
            @apply bg-primary-light;
        }
    }
</style>
