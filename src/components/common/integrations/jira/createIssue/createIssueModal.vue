<template>
    <a-modal
        v-model:visible="visible"
        :destroy-on-close="true"
        :closable="false"
        :footer="null"
        :mask-closable="false"
        :width="500"
        :class="$style.createModal"
    >
        <header
            class="flex items-center pl-6 border-b rounded-t-lg bg-primary-light"
            style="height: 68px"
        >
            <AtlanIcon :icon="'Jira'" class="h-6 mr-2" />
            <h1 class="text-xl font-bold">Create issue</h1>
        </header>
        <div
            class="w-full p-4 overflow-scroll rounded"
            style="max-height: calc(100vh - 21rem)"
        >
            <a-form
                ref="formRef"
                layout="vertical"
                :class="$style.formComponent"
                :rules="rules"
                :model="form"
                :validate-trigger="['click', 'submit']"
            >
                <div class="flex justify-between gap-x-4">
                    <a-form-item
                        :name="['project']"
                        label="Project"
                        class="w-full mb-6"
                    >
                        <ProjectSelector
                            v-model="form.project"
                            class="w-full"
                            placeholder="Select a project"
                            default-select
                            :clearable="false"
                            @change="handleProjectSelect"
                        />
                    </a-form-item>

                    <a-form-item
                        :name="['issuetype']"
                        class="w-full mb-6"
                        label="Issue type"
                    >
                        <CustomSelect
                            v-model:value="form.issuetype"
                            :disabled="!form.project"
                            dropdown-class-name="max-h-72 overflow-y-scroll"
                            placeholder="Select issue type"
                            :options="issueTypeOptions"
                            @change="initDynamicFields"
                        />
                    </a-form-item>
                </div>
                <a-form-item :name="['summary']" class="mb-6" label="Title">
                    <a-input v-model:value="form.summary" />
                </a-form-item>
                <a-form-item
                    v-if="!configReady || staticFields.description"
                    :name="['description']"
                    class="mb-6"
                    label="Description"
                >
                    <a-textarea v-model:value="form.description" />
                </a-form-item>

                <div class="w-1/2">
                    <a-form-item
                        v-if="!configReady || staticFields.priority"
                        :name="['priority']"
                        class="w-full mb-6"
                        :label="'Priority'"
                    >
                        <CustomSelect
                            v-model:value="form.priority"
                            :disabled="!configReady"
                            :options="staticFields?.priority?.options || []"
                            @change="
                                (v, option) =>
                                    (staticFields.priority.selectedValue =
                                        option)
                            "
                        />
                    </a-form-item>
                </div>

                <div v-if="configLoading" class="grid grid-cols-2 gap-x-4">
                    <a-skeleton :loading="true" :paragraph="false" active />
                    <a-skeleton :loading="true" :paragraph="false" active />
                </div>

                <div v-else class="grid grid-cols-2 gap-x-4">
                    <a-form-item
                        v-for="(field, idx) in requiredFields"
                        :key="field.key"
                        :name="[field.key]"
                        class="w-full mb-6"
                        :label="field.label"
                        :class="field.hideError ? $style.hideErrorMessage : ''"
                    >
                        <JiraDynamicField
                            :key="field.key"
                            v-model:value="form[field.key]"
                            :field="field"
                            @change="
                                (v) => (requiredFields[idx].selectedValue = v)
                            "
                        />
                    </a-form-item>
                </div>
            </a-form>
        </div>
        <div
            class="flex items-center justify-end w-full p-4 space-x-4 rounded-b-lg bg-primary-light"
        >
            <AtlanButton
                color="minimal"
                padding="compact"
                @click="handleCancel"
            >
                Cancel
            </AtlanButton>
            <AtlanButton
                size="sm"
                class="px-6"
                :loading="isLoading"
                :disabled="disableCreate"
                @click="handleCreate"
            >
                Create
            </AtlanButton>
        </div>
    </a-modal>
</template>

<script setup lang="ts">
    import { useVModels } from '@vueuse/core'
    import { computed, onMounted, PropType, Ref, ref, toRefs, watch } from 'vue'
    import { message } from 'ant-design-vue'
    import { truncate } from '@antv/x6/lib/util/string/string'
    import ProjectSelector from '@/common/integrations/jira/jiraProjectsSelect.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import {
        createIssue,
        listIssueTypes,
    } from '~/composables/integrations/jira/useJiraTickets'

    import { CREATE_TICKET_FORM_RULES } from '~/constant/integrations/jira.constant'
    import CustomSelect from '@/common/integrations/jira/customizedSelect.vue'
    import { getProjectConfig } from '~/composables/integrations/jira/useJira'
    import JiraDynamicField from '@/common/integrations/jira/jiraDynamicField.vue'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'
    import {
        requiredDynamicFields,
        staticDynamicFields,
    } from '@/common/integrations/jira/createIssue/handleDynamicFields'

    const props = defineProps({
        visible: { type: Boolean, required: true },
        asset: { type: Object as PropType<assetInterface>, required: true },
    })

    const emit = defineEmits(['success', 'failure'])

    const { asset } = toRefs(props)
    const formRef = ref()
    const { visible } = useVModels(props, emit)

    const { origin } = window.location

    const form = ref({
        issuetype: undefined,
        project: undefined,
        summary: undefined,
        description: undefined,
    })

    const issueTypeOptions = ref<any[]>([])
    const projectKey = ref()

    const {
        config,
        isReady: configReady,
        error: configError,
        isLoading: configLoading,
        fetchConfig,
    } = getProjectConfig(projectKey)

    const { staticFields, initStaticFields, staticFieldsKeyValues } =
        staticDynamicFields(config, form)

    const { requiredFields, initRequiredFields } = requiredDynamicFields(
        config,
        form
    )

    const resetForm = () => {
        form.value = {
            issuetype: undefined,
            project: undefined,
            summary: undefined,
            description: undefined,
        }
        requiredFields.value = []
        staticFields.value = {}
    }

    const rules = ref(JSON.parse(JSON.stringify(CREATE_TICKET_FORM_RULES)))

    const disableCreate = computed(() =>
        Object.entries(rules.value).some(([k, p]) => {
            if (p[0].required) {
                return Array.isArray(form.value[k])
                    ? !form.value[k].length
                    : !form.value[k]
            }
            return false
        })
    )

    const initDynamicFields = () => {
        initStaticFields()
        initRequiredFields()
    }

    const parseType = (field) => {
        const isURL =
            field.data.schema?.custom &&
            field.data.schema?.custom.split(':').slice(-1)[0] === 'url'

        if (isURL) return 'url'
        if (field.unsupported) return 'string'
        const type = field?.data.schema.type
        if (type === 'array') return 'array'
        // if (originalType === 'option') return 'select'
        // if (originalType === 'priority') return 'select'
        // if (originalType === 'user') return 'string'
        // if (originalType === 'number') return 'float' // jria number includes float and decimal
        return null
    }
    // ? This is a watcher will set form rules to be required for the required fields
    watch(
        [requiredFields, staticFields],
        () => {
            rules.value = JSON.parse(JSON.stringify(CREATE_TICKET_FORM_RULES))

            if (requiredFields.value?.length)
                requiredFields.value.forEach((field) => {
                    rules.value[field.key] = [
                        {
                            required: true,
                            trigger: ['submit', 'change'],
                            message:
                                parseType(field) === 'url'
                                    ? 'Must be a valid URL'
                                    : '',
                            ...(parseType(field)
                                ? { type: parseType(field) }
                                : {}),
                        },
                    ]
                })

            if (Object.values(staticFields.value)?.length)
                Object.values(staticFields.value).forEach((field) => {
                    rules.value[field.key] = [
                        {
                            required: field.data.required,
                            trigger: ['submit', 'change'],
                            message:
                                parseType(field) === 'url'
                                    ? 'Must be a valid URL'
                                    : '',
                            ...(parseType(field)
                                ? { type: parseType(field) }
                                : {}),
                        },
                    ]
                })
        },
        { deep: true }
    )

    const handleProjectSelect = async (v, option) => {
        requiredFields.value = []
        staticFields.value = {}
        const {
            meta: { issueTypes, key },
        } = option

        projectKey.value = key
        issueTypeOptions.value = [
            ...issueTypes.map((type) => ({
                label: type.name,
                value: type.id,
                meta: type,
            })),
        ]

        form.value.issuetype = issueTypeOptions.value[0].value
        await fetchConfig()
        initDynamicFields()
    }

    // The above code is creating a computed object that will be used to create the body of the Jira
    // issue. it includes all necessary form values, including static, & dynamic fields with value as per jira standards
    const body = computed(() => ({
        guid: asset.value.guid,
        name: asset.value.displayText,
        qualifiedName: asset.value.attributes.qualifiedName,
        integrationType: asset.value.attributes.connectorName,
        typeName: asset.value.typeName,
        assetUrl: `${origin}/assets/${asset.value.guid}/overview`,
        fields: {
            labels: ['Atlan'],
            summary: form.value.summary,
            description: form.value.description,
            issuetype: { id: form.value.issuetype },
            project: { id: form.value.project },
            ...Object.assign(
                {},
                ...requiredFields.value.map((f) => ({
                    [f.key]: f.selectedValue,
                }))
            ),
            ...staticFieldsKeyValues.value,
        },
    }))

    const trackCreateEvent = () => {
        const issueType = issueTypeOptions.value.find(
            (type) => type.value === form.value.issuetype
        ).label

        useAddEvent('integration', 'jira', 'issue_created', {
            asset_type: asset.value.typeName,
            issue_type: issueType,
        })
    }
    const { data, isLoading, error, mutate, isReady } = createIssue(body)

    const handleCancel = () => {
        resetForm()
        visible.value = false
    }

    const handleCreate = async () => {
        await formRef.value.validate()

        message.loading({
            key: 'create',
            content: `Creating & linking issue "${form.value.summary}"`,
        })

        try {
            await mutate()
            message.success({
                key: 'create',
                content: `Issue "${form.value.summary}" has been created and linked`,
                duration: 2,
            })
            trackCreateEvent()
            emit('success', data.value)
            visible.value = false
            resetForm()
        } catch (_error) {
            const errMsg = _error?.response?.data?.errorMessage || ''
            const generalError = `Failed to create issue: "${form.value.summary}"`
            const e = errMsg || generalError
            message.error({
                content: e,
                key: 'create',
                duration: 2,
            })
        }
        emit('failure', error.value)
    }
</script>

<style module lang="less">
    .createModal {
        :global(.ant-form-undo-flex-direction.ant-form-item) {
            flex-direction: unset !important;
        }
        :global(.ant-row) {
            display: block;
        }

        :global(.ant-input),
        :global(.ant-select-selector) {
            @apply border border-gray-300 rounded-lg !important;
        }

        .ant-form-item-label > label {
            @apply text-gray-500;
        }
    }

    .formComponent {
        :global(.ant-form-item-label) {
            @apply font-bold;
        }
        :global(.ant-skeleton-title) {
            @apply h-7 m-0;
        }
    }
    .hideErrorMessage {
        :global(.ant-form-item-explain) {
            @apply hidden !important;
        }
    }
</style>
