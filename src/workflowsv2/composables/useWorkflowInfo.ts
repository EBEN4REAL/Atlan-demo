import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import parser from 'cron-parser'
import cronstrue from 'cronstrue'
import { useConnectionStore } from '~/store/connection'
import { getDurationStringFromSec } from '~/utils/time'

dayjs.extend(relativeTime)

export default function useWorkflowInfo() {
    const name = (item: any): string => item?.metadata?.name

    const creationTimestamp = (item: any, relative: any) => {
        if (relative) {
            return dayjs().from(item.metadata?.creationTimestamp, true)
        }
        return dayjs(item.metadata?.creationTimestamp).format(
            'dddd MMMM D YYYY HH:mm:ss'
        )
    }

    const creatorUsername = (item) =>
        item?.metadata?.labels[
            'workflows.argoproj.io/creator-preferred-username'
        ] || 'argo'

    const modifierUsername = (item) =>
        item?.metadata?.labels[
            'workflows.argoproj.io/modifier-preferred-username'
        ]

    // const modifiedTimestamp = (item: any, relative: any) => {
    //     if (relative) {
    //         return dayjs().from(item.metadata?.creationTimestamp, true)
    //     }
    //     return dayjs(item.metadata?.creationTimestamp).format(
    //         'dddd MMMM D YYYY HH:mm:ss'
    //     )
    // }

    const labels = (item: any) => item.metadata?.labels

    const isStopped = (item) => item?.spec?.shutdown === 'Stop'

    const phase = (item: any) => {
        if (isStopped(item)) {
            return 'Stopped'
        }

        return item.status?.phase
    }

    const allowSchedule = (item: any) => {
        if (
            item.metadata?.annotations[
                'orchestration.atlan.com/allowSchedule'
            ] === 'false'
        ) {
            return false
        }
        return true
    }

    const phaseMessage = (item: any) => item.status?.message

    const startedAt = (item: any, relative: any) => {
        if (phase(item) === 'Pending') return 'Yet to start'
        else
            return (
                (relative
                    ? dayjs().from(item.status?.startedAt, true)
                    : dayjs(item.status?.startedAt).format(
                          'dddd, MMMM D YYYY, HH:mm:ss'
                      )) + ' ago'
            )
    }
    const finishedAt = (item: any, relative: any) => {
        if (!item?.status?.finishedAt) {
            return 'N/A'
        }
        if (relative) {
            if (item?.status?.finishedAt) {
                return dayjs().from(item?.status?.finishedAt, true)
            }
        }
        return dayjs(item?.status?.finishedAt).format(
            'dddd, MMMM D YYYY, HH:mm:ss'
        )
    }

    const difference = (startTime, endTime) => {
        if (startTime && endTime) {
            const sec = dayjs(endTime).diff(startTime, 'second')
            return `${Math.floor(sec / 60)} mins, ${sec % 60} seconds`
        }
        return ''
    }

    const formatDate = (date) => {
        return dayjs(date).format('dddd, MMMM D YYYY, HH:mm:ss')
    }

    const podFinishedAt = (finishedAtProp: any) => {
        if (finishedAtProp) {
            return dayjs().to(dayjs(finishedAtProp))
        }
        return finishedAtProp
    }
    const duration = (item) => {
        if (!item?.status?.startedAt) return 'N/A'
        if (!item?.status?.finishedAt) return 'In progress'

        if (item?.status?.startedAt && item?.status?.finishedAt) {
            const sec = dayjs(item.status.finishedAt).diff(
                item.status.startedAt,
                'second'
            )
            return getDurationStringFromSec(sec)
        }
        return ''
    }
    const progress = (item) => item.status.progress

    const progressPercent = (item) => {
        const split = item.status.progress.split('/')
        let percentage = 100
        if (split.length === 2) {
            percentage = (split[0] / split[1]) * 100
        }
        return percentage
    }

    const cron = (item) => {
        return item?.metadata?.annotations['orchestration.atlan.com/schedule']
    }

    const cronTimezone = (item) => {
        return item?.metadata?.annotations['orchestration.atlan.com/timezone']
    }

    const nextRuns = (item) => {
        const options = {
            tz: cronTimezone(item),
        }
        const interval = parser.parseExpression(cron(item), options)
        const temp = []

        temp.push(interval.next().toString())
        temp.push(interval.next().toString())
        temp.push(interval.next().toString())
        return temp
    }

    const cronString = (item) => {
        if (cron(item)) {
            return `${cronstrue.toString(cron(item), {
                use24HourTimeFormat: true,
            })}(${cronTimezone(item)})`
        }
    }

    const cronObject = (item) => ({
        cron: cron(item),
        timezone: cronTimezone(item),
    })

    const isCronRun = (item) => {
        if (item?.metadata?.ownerReferences?.length > 0) {
            if (
                item?.metadata?.ownerReferences
                    .map((i) => i.kind)
                    .includes('CronWorkflow')
            ) {
                return true
            }
        }
        return false
    }

    const isCronWorkflow = (workflow) =>
        !!workflow?.metadata?.annotations?.['orchestration.atlan.com/schedule']

    const getRunClassByPhase = (tempStatus) => {
        switch (tempStatus) {
            case 'Succeeded':
                return 'bg-green-500 bg-opacity-10'
            case 'Running':
                return 'bg-yellow-300 bg-opacity-10'
            case 'Failed':
            case 'Error':
            case 'Stopped':
                return 'bg-red-500 bg-opacity-10'
            default:
                return 'bg-gray-200'
        }
    }

    const getRunTextClassByPhase = (tempStatus) => {
        switch (tempStatus) {
            case 'Succeeded':
                return 'text-green-500'
            case 'Running':
                return 'text-yellow-500'
            case 'Error':
                return 'text-warning'
            case 'Failed':
            case 'Stopped':
                return 'text-red-500'
            default:
                return 'text-gray-500'
        }
    }

    const getRunBorderClassByPhase = (tempStatus) => {
        if (tempStatus === 'Succeeded')
            return 'border-green-500 border-opacity-75'
        if (tempStatus === 'Failed') return 'border-red-500 border-opacity-75'
        if (tempStatus === 'Error') return 'border-warning border-opacity-75'
        if (tempStatus === 'Running')
            return 'border-yellow-500 border-opacity-75'
        return 'border-gray-400'
    }

    const getRunIconByPhase = (item) => {
        switch (phase(item)) {
            case 'Succeeded':
                return 'RunSuccess'
            case 'Running':
                return 'RunProgress'
            case 'Failed':
            case 'Error':
            case 'Stopped':
                return 'RunFailed'
            case 'Pending':
                return 'Clock'
            default:
                return 'Retry'
        }
    }

    const getRunClass = (item) => getRunClassByPhase(phase(item))

    const getRunBorderClass = (item) => getRunBorderClassByPhase(phase(item))

    const getRunTextClass = (item) => getRunTextClassByPhase(phase(item))

    // const getRunTimeContent = (item, relativeTime) => {
    //     const tempStatus = phase(item)
    //     if (tempStatus === 'Succeeded') {
    //         return `${finishedAt(item, relativeTime)}`
    //     } else if (tempStatus === 'Failed' || tempStatus === 'Error') {
    //         return `${finishedAt(item, relativeTime)}`
    //     } else if (tempStatus === 'Running') {
    //         return `${startedAt(item, relativeTime)}`
    //     }
    //     return `${startedAt(item, relativeTime)}`
    // }

    const getRunTooltip = (item) => {
        const tempStatus = phase(item)
        if (tempStatus === 'Pending') return 'Yet to start'
        if (tempStatus === 'Succeeded') {
            return `${tempStatus}, ${finishedAt(item, true)} ago (${duration(
                item
            )})`
        } else if (tempStatus === 'Failed' || tempStatus === 'Error') {
            return `${tempStatus}, ${finishedAt(item, true)} ago (${duration(
                item
            )})`
        } else if (tempStatus === 'Running') {
            return `${tempStatus}, started ${startedAt(item, true)}`
        }
        return `${tempStatus}, ${finishedAt(item, true)} ago (${duration(
            item
        )})`
    }

    const packageType = (item) =>
        item?.metadata?.labels['orchestration.atlan.com/type']

    const packageName = (item) =>
        item?.metadata?.annotations['package.argoproj.io/name']

    const useCases = (item) => {
        let temp =
            item?.metadata?.annotations[
                'orchestration.atlan.com/usecases'
            ]?.split(',')

        return temp?.map((i) => i.trim()) || []
    }

    const supportLink = (item) =>
        item?.metadata?.annotations['orchestration.atlan.com/supportLink']

    const connectorStore = useConnectionStore()

    const displayName = (item, workflowName) => {
        // debugger
        let suffix = workflowName.split(`${name(item)}-`).pop()
        if (packageType(item) === 'connector') {
            suffix = suffix.replaceAll('-', '/')
            const found = connectorStore.list.find(
                (i) => i.attributes.qualifiedName === suffix
            )
            if (found) {
                return found?.attributes.name
            }
            return suffix
        }
        return suffix
    }

    const getGlobalArguments = (item) => {
        const map = {}

        if (item?.spec?.templates?.length > 0) {
            if (item?.spec?.templates[0].dag?.tasks.length > 0) {
                item?.spec?.templates[0].dag?.tasks[0].arguments?.parameters.forEach(
                    (element) => {
                        map[element.name] = element.value
                    }
                )
            }
        }

        return map
    }

    const workflowTemplateName = (item) =>
        item?.metadata?.labels?.['workflows.argoproj.io/workflow-template']

    return {
        name,
        creationTimestamp,
        labels,
        phase,
        startedAt,
        finishedAt,
        podFinishedAt,
        duration,
        progress,
        progressPercent,
        cronString,
        cron,
        isCronRun,
        isCronWorkflow,
        getRunClass,
        getRunTooltip,
        getRunBorderClass,
        getRunTextClass,
        creatorUsername,
        modifierUsername,
        packageType,
        displayName,
        packageName,
        phaseMessage,
        isStopped,
        allowSchedule,
        cronObject,
        nextRuns,
        getGlobalArguments,
        useCases,
        supportLink,
        formatDate,
        difference,
        getRunClassByPhase,
        getRunBorderClassByPhase,
        getRunTextClassByPhase,
        getRunIconByPhase,
        workflowTemplateName,
    }
}
