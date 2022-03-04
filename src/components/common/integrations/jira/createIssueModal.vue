<template>
    <a-modal
        v-model:visible="visible"
        :destroy-on-close="true"
        :closable="false"
        :footer="null"
        :mask-closable="false"
        :width="500"
        class="createModal"
    >
        <header
            class="flex items-center pl-6 border-b rounded-t-lg bg-primary-light"
            style="height: 68px"
        >
            <AtlanIcon :icon="'Jira'" class="h-6 mr-2" />
            <h1 class="text-xl font-bold">Create issue</h1>
        </header>
        <div class="w-full p-4 rounded">
            <a-form
                ref="formRef"
                layout="vertical"
                :class="$style.formComponent"
                :rules="CREATE_TICKET_FORM_RULES"
                :model="form"
                :validate-trigger="['click', 'submit']"
            >
                <div class="flex justify-between gap-x-4">
                    <a-form-item
                        :name="['projectId']"
                        label="Project"
                        class="w-full mb-6"
                    >
                        <ProjectSelector
                            v-model="form.projectId"
                            class="w-full"
                            placeholder="Select a project"
                            default-select
                            @change="handleProjectSelect"
                        />
                    </a-form-item>

                    <a-form-item
                        :name="['issueType']"
                        class="w-full mb-6"
                        label="Issue type"
                    >
                        <CustomSelect
                            v-model:value="form.issueType"
                            :disabled="!form.projectId"
                            dropdown-class-name="max-h-72 overflow-y-scroll"
                            placeholder="Select issue type"
                            :options="issueTypeOptions"
                        />
                    </a-form-item>
                </div>
                <a-form-item :name="['summary']" class="mb-6" label="Title">
                    <a-input
                        v-model:value="form.summary"
                        placeholder="Enter a name for this issue"
                    />
                </a-form-item>
                <a-form-item
                    :name="['description']"
                    class="mb-6"
                    label="Description"
                >
                    <a-textarea v-model:value="form.description" />
                </a-form-item>
                <!-- <div class="flex justify-between gap-x-4">
                    <a-form-item
                        :name="['Priority']"
                        class="w-full mb-6"
                        label="Priority"
                    >
                        <CustomSelect
                            v-model:value="form.priority"
                            dropdown-class-name="max-h-72 overflow-y-scroll"
                            placeholder="Select issue priority"
                            :options="[]"
                        />
                    </a-form-item>
                    <a-form-item
                        :name="['Reporter']"
                        class="w-full mb-6"
                        label="Reporter"
                    >
                        <CustomSelect
                            v-model:value="form.reporter"
                            dropdown-class-name="max-h-72 overflow-y-scroll"
                            placeholder="Select issue reporter"
                            :options="[]"
                        />
                    </a-form-item>
                </div> -->
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
    import { computed, onMounted, PropType, ref, toRefs } from 'vue'
    import { message } from 'ant-design-vue'
    import ProjectSelector from '@/common/integrations/jira/jiraProjectsSelect.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import {
        createIssue,
        listIssueTypes,
    } from '~/composables/integrations/jira/useJiraTickets'

    import { CREATE_TICKET_FORM_RULES } from '~/constant/integrations/jira.constant'
    import CustomSelect from '@/common/integrations/jira/customizedSelect.vue'

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
        issueType: undefined,
        projectId: undefined,
        summary: undefined,
        labels: ['Atlan'],
        description: '',
        priority: '',
        reporter: '',
        guid: asset.value.guid,
        name: asset.value.displayText,
        qualifiedName: asset.value.attributes.qualifiedName,
        integrationType: asset.value.attributes.connectorName,
        typeName: asset.value.typeName,
        assetUrl: `${origin}/assets/${asset.value.guid}/overview`,
    })

    const disableCreate = computed(() =>
        Object.entries(CREATE_TICKET_FORM_RULES).some(([k, p]) => {
            if (p[0].required && !form.value[k]) return true
            return false
        })
    )

    const reset = () => {
        form.value = {
            ...form.value,
            ...{
                issueType: undefined,
                projectId: undefined,
                summary: undefined,
                description: undefined,
            },
        }
    }

    const issueTypeOptions = ref<any[]>([])

    const handleProjectSelect = (v, option) => {
        const {
            meta: { issueTypes },
        } = option
        issueTypeOptions.value = [
            ...issueTypes.map((type) => ({
                label: type.name,
                value: type.id,
                meta: type,
            })),
        ]
        form.value.issueType = issueTypeOptions.value[0].value
    }

    const { data, isLoading, error, mutate, isReady } = createIssue(form)

    const handleCancel = () => {
        reset()
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
            emit('success', data.value)
            visible.value = false
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

<style lang="less">
    .createModal {
        .ant-form-undo-flex-direction.ant-form-item {
            flex-direction: unset !important;
        }
        .ant-row {
            display: block;
        }

        .ant-input,
        .ant-select-selector {
            @apply border border-gray-300 rounded-lg !important;
        }

        .ant-form-item-label > label {
            @apply text-gray-500;
        }
    }
</style>

<style module lang="less">
    .formComponent {
        :global(.ant-form-item-label) {
            @apply font-bold;
        }
    }
</style>
