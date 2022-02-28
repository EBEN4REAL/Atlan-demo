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
        <header class="flex items-center pl-6 border-b" style="height: 68px">
            <AtlanIcon :icon="'Jira'" class="h-6 mr-2" />
            <h1 class="text-xl font-bold">Create Jira issue</h1>
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
                <a-form-item :name="['summary']" class="mb-4" label="Title">
                    <a-input
                        v-model:value="form.summary"
                        placeholder="Add a title"
                    />
                </a-form-item>
                <a-form-item
                    :name="['description']"
                    class="mb-4"
                    label="Description"
                >
                    <a-textarea
                        v-model:value="form.description"
                        placeholder="Add a description"
                    />
                </a-form-item>

                <a-form-item :name="['projectId']" label="Project" class="mb-4">
                    <ProjectSelector
                        v-model="form.projectId"
                        class="w-full"
                        placeholder="Select a project"
                        default-select-first
                        @change="() => (form.issueType = undefined)"
                    />
                </a-form-item>
                <a-form-item
                    :name="['issueType']"
                    class="mb-4"
                    label="Issue type"
                >
                    <a-select
                        v-model:value="form.issueType"
                        :disabled="!form.projectId"
                        :dropdown-class-name="$style.issueTypeDropdown"
                        placeholder="Select issue type"
                        :options="issueTypeOptions"
                        class="w-full"
                    >
                        <template #suffixIcon>
                            <AtlanIcon
                                icon="CaretDown"
                                class="text-gray-500"
                            /> </template
                    ></a-select>
                </a-form-item>
            </a-form>
        </div>
        <div class="flex justify-end w-full p-4 pt-0 space-x-4">
            <AtlanButton
                color="minimal"
                padding="compact"
                @click="handleCancel"
            >
                Cancel
            </AtlanButton>
            <AtlanButton :loading="isLoading" @click="handleCreate">
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

    import { CREATE_TICKET_FORM_RULES } from '~/constant/integrations/integrations/jira.constant'

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
        description: undefined,
        guid: asset.value.guid,
        name: asset.value.displayText,
        qualifiedName: asset.value.attributes.qualifiedName,
        integrationType: asset.value.attributes.connectorName,
        typeName: asset.value.typeName,
        assetUrl: `${origin}/assets/${asset.value.guid}/overview`,
    })

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

    const { data: issueTypes } = listIssueTypes()

    const issueTypeOptions = computed(() => {
        if (issueTypes.value?.length) {
            return issueTypes.value
                .filter((_t) => {
                    const { scope } = _t
                    const projectID = scope?.project?.id
                    return projectID === form.value.projectId
                })
                .map((t) => ({ label: t.name, value: t.id }))
        }
        return []
    })

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
            @apply border border-gray-300 !important;
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
    .issueTypeDropdown {
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
