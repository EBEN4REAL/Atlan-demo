<template>
    <a-select
        v-model:value="modelValue"
        class=""
        :class="$style.selector"
        :options="options"
        :placeholder="placeholder"
        :loading="isLoading"
        dropdown-class-name="max-h-72 overflow-y-scroll"
    >
        <template #dropdownRender>
            <div
                v-for="o in options"
                :key="o.value"
                class="p-2 mx-1 rounded cursor-pointer hover:bg-gray-100"
                :class="o.value === modelValue ? 'bg-primary-light' : ''"
                @click="handleChange(o.value, o)"
            >
                <span class="flex items-center gap-x-2">
                    <img
                        :src="o.meta.avatarUrls['24x24']"
                        class="h-5 rounded-full"
                    />
                    {{ o.label }}
                </span>
            </div>
        </template>
        <template #suffixIcon>
            <AtlanIcon icon="CaretDown" class="text-gray-500" />
        </template>
    </a-select>
</template>

<script setup lang="ts">
    import { useVModels } from '@vueuse/core'
    import { computed, onMounted, watch } from 'vue'
    import { listProjects } from '~/composables/integrations/jira/useJira'

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
                meta: { ...p },
            }))
        }
        return []
    })

    const handleChange = (value, option) => {
        modelValue.value = value
        emit('change', value, option)
    }

    onMounted(() => {
        watch(projects, (v) => {
            if (v?.length && !modelValue.value && props.defaultSelectFirst) {
                modelValue.value = options.value[0].value
                handleChange(options.value[0].value, options.value[0])
            }
        })
    })
</script>

<style module lang="less">
    .selector {
        :global(.ant-select-selector) {
            @apply border border-gray-300 !important;
        }
    }
</style>
