<template>
    <a-select
        v-model:value="modelValue"
        class=""
        :class="$style.selector"
        :placeholder="placeholder"
        :loading="isLoading"
        :allow-clear="clearable"
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

        <!-- <a-select-option
            v-if="!lastPage"
            class="flex items-end bg-white cursor-default"
            :disabled="true"
        >
            <div class="flex items-center justify-end gap-x-1">
                <AtlanLoader v-if="isLoading && !searchLoading" class="w-1" />
                <span
                    class="text-xs cursor-pointer hover:underline text-primary"
                    @click="loadMore"
                    >Load More</span
                >
            </div>
        </a-select-option> -->
        <template #suffixIcon>
            <AtlanLoader v-if="isLoading" icon="Loader" class="" />
            <AtlanIcon v-else icon="CaretDown" class="text-gray-500" />
        </template>
    </a-select>
</template>

<script setup lang="ts">
    import { useVModels } from '@vueuse/core'
    import { computed, onMounted, watch, h, toRefs, ref } from 'vue'
    import { fetchJiraProjects } from '~/composables/integrations/jira/useJira'
    import integrationStore from '~/store/integrations/index'

    const store = integrationStore()
    const { tenantJiraStatus } = toRefs(store)
    const projectList = computed(() => tenantJiraStatus.value.projectList)

    const { isLoading, error, lastPage, mutate, isReady } = fetchJiraProjects()

    const props = defineProps({
        modelValue: { type: String, required: true },
        placeholder: { type: String, default: 'Select default project' },
        defaultSelect: { type: Boolean, default: false },
        clearable: { type: Boolean, default: true },
    })
    const emit = defineEmits(['change'])

    const { modelValue } = useVModels(props, emit)
    const errorAvatarOptions = ref([])

    const options = computed(() => {
        if (projectList.value?.length) {
            return projectList.value.map((p) => ({
                label: p.name,
                value: p.id,
                meta: { ...p },
            }))
        }
        return []
    })

    const handleChange = (value, option, isDefautSet = false) => {
        modelValue.value = value
        emit('change', value, option, isDefautSet)
    }

    const afterLoad = () => {
        errorAvatarOptions.value = []
        if (
            projectList.value?.length &&
            !modelValue.value &&
            props.defaultSelect
        ) {
            const { defaultProject } = tenantJiraStatus.value.config
            if (defaultProject) {
                const project = options.value.find(
                    (p) => p.value === defaultProject.id
                )
                if (project) {
                    modelValue.value = project.value
                    handleChange(project.value, project, true)
                }
            }
        }
    }

    onMounted(() => {
        if (projectList.value?.length) afterLoad()
        else mutate()
    })

    watch(lastPage, (v) => {
        if (v && !modelValue.value) afterLoad()
    })

    // ? hack to fire clear event
    watch(modelValue, (n, o) => {
        if (!n && o) emit('change')
    })
</script>

<style module lang="less">
    .selector {
        :global(.ant-select-selector) {
            @apply border border-gray-300 !important;
        }
    }
</style>
