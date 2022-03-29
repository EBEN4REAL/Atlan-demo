import { h } from 'vue'
import { Modal, message } from 'ant-design-vue'
import { deleteWorkflowByName } from '~/workflows/composables/workflow/useWorkflowList'
import { debouncedWatch, until } from '@vueuse/core'

export const archiveWorkflow = (
    name: string,
    quickChange: Function,
    reportName: string
) => {
    Modal.confirm({
        title: 'Delete Workflow',
        content: () =>
            h('span', [
                'Are you sure you want to delete ',
                h('b', [reportName]),
                ' scheduled query workflow?',
            ]),
        okType: 'danger',
        autoFocusButton: null,
        okButtonProps: {
            type: 'primary',
        },
        okText: 'Delete',
        cancelText: 'Cancel',
        async onOk() {
            const { error, isLoading } = deleteWorkflowByName(name, true)
            await until(isLoading).toBe(false)
            if (error.value)
                message.error('Failed to delete scheduled query workflow')
            else {
                message.success('Workflow deleted')
                setTimeout(() => {
                    quickChange(true)
                }, 1000)
            }
        },
    })
}
