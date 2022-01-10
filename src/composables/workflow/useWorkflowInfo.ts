import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import cronstrue from 'cronstrue'

dayjs.extend(relativeTime)

export default function useWorkflowInfo() {
    const name = (item: any): string => item.metadata?.name

    const creationTimestamp = (item: any, relative: any) => {
        if (relative) {
            return dayjs().from(item.metadata?.creationTimestamp, true)
        }
        return dayjs(item.metadata?.creationTimestamp).format(
            'dddd MMMM D YYYY HH:mm:ss'
        )
    }

    const labels = (item: any) => item.metadata?.labels

    const phase = (item: any) => item.status?.phase

    const startedAt = (item: any, relative: any) => {
        if (relative) {
            return dayjs().from(item.status.startedAt, true)
        }
        return dayjs(item.status.startedAt).format('dddd MMMM D YYYY HH:mm:ss')
    }
    const finishedAt = (item: any, relative: any) => {
        if (relative) {
            if (item?.status?.finishedAt) {
                return dayjs().from(item?.status?.finishedAt, true)
            }
        }
        return dayjs(item?.status?.finishedAt).format(
            'dddd MMMM D YYYY HH:mm:ss'
        )
    }
    const podFinishedAt = (finishedAtProp: any) => {
        if (finishedAtProp) {
            return dayjs().to(dayjs(finishedAtProp))
        }
        return finishedAtProp
    }
    const duration = (item) => {
        if (item?.status?.startedAt && item?.status?.finishedAt) {
            const sec = dayjs(item.status.finishedAt).diff(
                item.status.startedAt,
                'second'
            )
            return `${Math.floor(sec / 60)} mins, ${sec % 60} seconds`
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

    const cronString = (item) => {
        if (cron(item)) {
            return cronstrue.toString(cron(item))
        }
    }

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
    }
}
