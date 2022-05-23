import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import advanced from 'dayjs/plugin/advancedFormat'
import { useTimeAgo } from '@vueuse/core'

import parser from 'cron-parser'
import cronstrue from 'cronstrue'
import { useConnectionStore } from '~/store/connection'
import { getDurationStringFromSec } from '~/utils/time'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(advanced)
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

    const message = (run, node?: string) => {
        if (node) {
            const status = run?.status?.nodes[node]
            return status?.message
        }
        return run.status?.message
    }

    const allowSchedule = (item: any) => {
        if (
            item?.metadata?.annotations && item?.metadata?.annotations[
            'orchestration.atlan.com/allowSchedule'
            ] === 'false'
        ) {
            return false
        }
        return true
    }

    const phaseMessage = (item: any) => item.status?.message

    const startedAt = (
        item: any,
        relative: any,
        format = 'dddd, MMMM D YYYY, HH:mm:ss'
    ) => {
        if (phase(item) === 'Pending') return 'Yet to start'

        return relative
            ? dayjs().from(item.status?.startedAt, true) + ' ago'
            : dayjs(item.status?.startedAt).format(format)
    }
    const finishedAt = (
        item: any,
        relative: any,
        format = 'dddd, MMMM D YYYY, HH:mm:ss'
    ) => {
        if (!item?.status?.finishedAt) return 'N/A'

        return relative
            ? dayjs().from(item?.status?.finishedAt, true)
            : dayjs(item?.status?.finishedAt).format(format)
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
        return item?.metadata?.annotations && item?.metadata?.annotations['orchestration.atlan.com/schedule']
    }

    const cronTimezone = (item) => {
        return item?.metadata?.annotations && item?.metadata?.annotations['orchestration.atlan.com/timezone']
    }

    const nextRuns = (item) => {
        const options = {
            tz: cronTimezone(item),
        }
        const interval = parser.parseExpression(cron(item), options)
        const temp: string[] = []

        temp.push(interval.next().toString())
        temp.push(interval.next().toString())
        temp.push(interval.next().toString())
        return temp
    }

    const nextRunRelativeTime = (item) => {
        const options = {
            tz: cronTimezone(item),
        }
        const interval = parser.parseExpression(cron(item), options)
        const nextRunTime = interval.next().toString()
        return useTimeAgo(new Date(nextRunTime)).value
    }

    const cronString = (item, verbose = false) => {
        if (cron(item)) {
            let str = cronstrue.toString(cron(item), {
                use24HourTimeFormat: true,
                verbose,
            })

            if (
                dayjs().tz(cronTimezone(item)).format('z') !==
                dayjs.tz(Date.now(), dayjs.tz.guess()).format('z')
            )
                str += verbose
                    ? ` (${cronTimezone(item)})`
                    : ` (${dayjs().tz(cronTimezone(item)).format('z')})`

            return str
        }
        return undefined
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

    const getRunClassByPhase = (status) => {
        switch (status) {
            case 'Succeeded':
                return 'bg-new-green-100'
            case 'Running':
                return 'bg-new-yellow-100'
            case 'Failed':
            case 'Error':
            case 'Stopped':
                return 'bg-new-red-100'
            default:
                return 'bg-new-gray-100'
        }
    }

    const getRunClassBgByPhase = (status) => {
        switch (status) {
            case 'Succeeded':
                return 'bg-new-green-500'
            case 'Running':
                return 'bg-new-yellow-300'
            case 'Failed':
            case 'Error':
            case 'Stopped':
                return 'bg-new-red-400'
            default:
                return 'bg-new-gray-300'
        }
    }

    const getRunTextClassByPhase = (status) => {
        switch (status) {
            case 'Succeeded':
                return 'text-new-green-500'
            case 'Running':
                return 'text-new-yellow-600'
            case 'Error':
            case 'Failed':
            case 'Stopped':
                return 'text-new-red-500'
            default:
                return 'text-new-gray-600'
        }
    }

    const getRunBorderClassByPhase = (status) => {
        switch (status) {
            case 'Succeeded':
                return 'border-green-500 border-opacity-75'
            case 'Running':
                return 'border-yellow-500 border-opacity-75'
            case 'Error':
            case 'Failed':
            case 'Stopped':
                return 'border-red-500 border-opacity-75'
            default:
                return 'border-gray-400'
        }
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

    const getRunClassBgLight = (item) => getRunClassByPhase(phase(item))
    const getRunClassBg = (item) => getRunClassBgByPhase(phase(item))

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
        item?.metadata?.annotations && item?.metadata?.annotations?.['package.argoproj.io/name']

    const useCases = (item) => {
        let temp =
            item?.metadata?.annotations && item?.metadata?.annotations[
                'orchestration.atlan.com/usecases'
            ]?.split(',')

        return temp?.map((i) => i.trim()) || []
    }

    const supportLink = (item) =>
        item?.metadata?.annotations && item?.metadata?.annotations['orchestration.atlan.com/supportLink']

    const connectorStore = useConnectionStore()

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


    const displayName = (
        item: Record<string, any>,
        workflowName: string,
        spec?: Record<string, any>
    ) => {
        let suffix = workflowName?.split(`${name(item)}-`).pop()
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
        if (['miner'].includes(packageType(item))) {
            const globalArguments = getGlobalArguments({ spec })
            const connectionQualifiedName = globalArguments['connection-qualified-name']
            suffix = suffix.replaceAll('-', '/')
            const found = connectorStore.list.find(
                (i) => i.attributes.qualifiedName === connectionQualifiedName
            )
            if (found) {
                return found?.attributes.name
            }
            return suffix || workflowName
        }

        if (packageType(item) === 'schedule-query') {
            return (
                spec?.templates[0]?.dag?.tasks?.[0]?.arguments?.parameters?.find(
                    (prm) => prm.name === 'report-name'
                )?.value ||
                suffix ||
                workflowName
            )
        }
        return suffix || workflowName
    }

    const connectorGuid = (item, workflowName) => {
        // debugger
        let suffix = workflowName?.split(`${name(item)}-`).pop()
        if (packageType(item) === 'connector') {
            suffix = suffix.replaceAll('-', '/')

            const found = connectorStore.list.find(
                (i) => i.attributes.qualifiedName === suffix
            )

            if (found) return found?.guid
        }
        return undefined
    }

    const workflowTemplateName = (item) =>
        item?.metadata?.labels?.[
        'workflows.argoproj.io/workflow-template'
        ] as string

    return {
        name,
        creationTimestamp,
        labels,
        phase,
        message,
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
        getRunClassBgLight,
        getRunClassBg,
        getRunTooltip,
        getRunBorderClass,
        getRunTextClass,
        creatorUsername,
        modifierUsername,
        packageType,
        displayName,
        connectorGuid,
        packageName,
        phaseMessage,
        isStopped,
        allowSchedule,
        cronObject,
        nextRuns,
        nextRunRelativeTime,
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
