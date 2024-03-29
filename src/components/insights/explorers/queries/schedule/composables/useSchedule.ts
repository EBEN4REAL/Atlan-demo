import { message } from 'ant-design-vue'
import { generateUUID } from '~/utils/helper/generator'
import parser from 'cron-parser'

import { Ref } from 'vue'
export function useSchedule() {
    const handleWorkflowSubmit = ({
        body: body,
        isEdit: isEdit,
        workflowTemplate: workflowTemplate,
        savedQueryId: savedQueryId,
        isCron: isCron,
        cron: cron,
        modelValue: modelValue,
        status,
        errorMesssage: errorMesssage,
        execute,
    }: {
        body: Ref<any>
        isEdit: Ref<boolean>
        workflowTemplate: Ref<any>
        savedQueryId: string
        isCron: boolean
        cron: Ref<any>
        modelValue: Ref<{ [key: string]: any }>
        status: Ref<string>
        errorMesssage: Ref<string>
        execute: Function
    }) => {
        if (isEdit.value) {
            body.value.metadata = workflowTemplate.value.metadata
        } else {
            // Copy labels and annotations of the worfklow template
            body.value.metadata.labels = workflowTemplate.value.metadata.labels
            body.value.metadata.annotations =
                workflowTemplate.value.metadata.annotations
            // Schedule Changes
            if (cron.value && isCron) {
                body.value.metadata.annotations[
                    'orchestration.atlan.com/schedule'
                ] = cron.value.cron
                body.value.metadata.annotations[
                    'orchestration.atlan.com/timezone'
                ] = cron.value.timezone
            }

            const seconds = Math.round(new Date().getTime() / 1000)
            let workflowName = workflowTemplate.value.metadata.name
            if (savedQueryId) {
                workflowName = `asq-${savedQueryId}-${generateUUID().slice(
                    0,
                    4
                )}`
            } else {
                workflowName = `${workflowName}-${seconds.toString()}`
            }

            body.value.metadata.name = workflowName.replaceAll('/', '-')
            body.value.metadata.namespace = 'default'
        }

        const parameters: Array<{ [key: string]: string }> = []

        if (workflowTemplate.value.spec.templates.length > 0) {
            workflowTemplate.value.spec.templates[0].inputs.parameters.forEach(
                (p) => {
                    if (typeof modelValue.value[p.name] === 'boolean') {
                        parameters.push({
                            name: p.name,
                            value: modelValue.value[p.name],
                        })
                    } else if (modelValue.value[p.name]) {
                        if (typeof modelValue.value[p.name] === 'object') {
                            parameters.push({
                                name: p.name,
                                value: JSON.stringify(modelValue.value[p.name]),
                            })
                        } else {
                            parameters.push({
                                name: p.name,
                                value: modelValue.value[p.name],
                            })
                        }
                    }
                }
            )
        } else {
            message.error('Something went wrong. Package is not valid.')
        }

        body.value.metadata.labels['orchestration.atlan.com/atlan-ui'] = 'true'

        body.value.spec = {
            templates: [
                {
                    name: 'main',
                    dag: {
                        tasks: [
                            {
                                name: 'run',
                                arguments: {
                                    parameters,
                                },
                                templateRef: {
                                    name: workflowTemplate.value.metadata.name,
                                    template: 'main',
                                    clusterScope: true,
                                },
                            },
                        ],
                    },
                },
            ],
            entrypoint: 'main',
        }

        if (workflowTemplate.value?.spec.volumeClaimTemplates) {
            body.value.spec.volumeClaimTemplates =
                workflowTemplate.value.spec.volumeClaimTemplates
        }

        status.value = 'loading'
        errorMesssage.value = ''
        if (execute) {
            execute(false)
        }

        // edit part will come here src/components/packages/setup/index.vue
    }
    return {
        handleWorkflowSubmit,
    }
}

export const getCronFrequency = (cronString) => {
    const interval = parser.parseExpression(cronString)

    if (
        interval.fields.hour.length === 24 &&
        interval.fields.dayOfMonth.length === 31 &&
        interval.fields.dayOfWeek.length === 8 &&
        interval.fields.month.length === 12
    ) {
        return 'hourly'
    }

    if (
        interval.fields.dayOfMonth.length === 31 &&
        interval.fields.dayOfWeek.length === 8 &&
        interval.fields.month.length === 12
    ) {
        return 'daily'
    }
    if (
        interval.fields.dayOfMonth.length === 31 &&
        interval.fields.dayOfWeek.length === 1 &&
        interval.fields.month.length === 12
    ) {
        return 'weekly'
    }
    if (
        interval.fields.dayOfMonth.length === 31 &&
        interval.fields.dayOfWeek.join(',') === [1, 2, 3, 4, 5].join(',') &&
        interval.fields.month.length === 12
    ) {
        return 'weekdays'
    }
    if (
        interval.fields.dayOfMonth.length === 31 &&
        interval.fields.dayOfWeek.join(',') === [0, 6].join(',') &&
        interval.fields.month.length === 12
    ) {
        return 'weekend'
    }
    if (
        interval.fields.dayOfMonth.length === 1 &&
        interval.fields.dayOfWeek.length === 8 &&
        interval.fields.month.length === 12
    ) {
        return 'monthly'
    }
    return ''
}
