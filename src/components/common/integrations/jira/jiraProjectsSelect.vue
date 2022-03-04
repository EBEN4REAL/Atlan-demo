<template>
    <a-select
        v-model:value="modelValue"
        class=""
        :class="$style.selector"
        :placeholder="placeholder"
        :loading="isLoading"
        allow-clear
        show-search
        option-filter-prop="label"
        dropdown-class-name="max-h-72 overflow-y-scroll"
    >
        <a-select-option
            v-for="o in options"
            :key="o.value"
            :label="o.label"
            class="p-2 mx-1 rounded cursor-pointer hover:bg-gray-100"
            :class="o.value === modelValue ? 'bg-primary-light' : ''"
            @click="handleChange(o.value, o)"
        >
            <span class="flex items-center gap-x-2">
                <AtlanIcon
                    v-if="errorAvatarOptions.includes(o.value)"
                    icon="Jira"
                />
                <img
                    v-else
                    :src="o.meta.avatarUrls['24x24']"
                    class="h-5 rounded-full"
                    @error="() => errorAvatarOptions.push(o.value)"
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
    import { computed, onMounted, watch, h, toRefs, ref } from 'vue'
    import { listProjects } from '~/composables/integrations/jira/useJira'
    import integrationStore from '~/store/integrations/index'

    const { projects, isLoading, error } = listProjects()

    const props = defineProps({
        modelValue: { type: String, required: true },
        placeholder: { type: String, default: 'Select default project' },
        defaultSelect: { type: Boolean, default: false },
    })
    const emit = defineEmits(['change'])

    const { modelValue } = useVModels(props, emit)
    const errorAvatarOptions = ref([])

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

    const store = integrationStore()

    const { tenantJiraStatus } = toRefs(store)

    onMounted(() => {
        watch(projects, (v) => {
            errorAvatarOptions.value = []
            if (v?.length && !modelValue.value && props.defaultSelect) {
                const { defaultProject } = tenantJiraStatus.value.config
                if (defaultProject) {
                    const project = options.value.find(
                        (p) => p.value === defaultProject.id
                    )
                    if (project) modelValue.value = project.value
                    handleChange(project.value, project)
                }
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
