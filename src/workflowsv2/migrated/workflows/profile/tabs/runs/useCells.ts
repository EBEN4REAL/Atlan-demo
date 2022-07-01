import useWorkflowInfo from '~/workflows/composables/workflow/useWorkflowInfo'
import { timeDiffCalc } from '~/utils/date'
import Success from '~/assets/images/icons/run-success.svg?url'
import Running from '~/assets/images/icons/running.svg?url'
import Failed from '~/assets/images/icons/run-failed.svg?url'
import Skipped from '~/assets/images/icons/skipped.svg?url'
import Pending from '~/assets/images/icons/query_time.svg?url'

const { getRunBorderClassByPhase, getRunTextClassByPhase } = useWorkflowInfo()

const getRunIcon = (phase: string) => {
    if (['Running'].includes(phase)) return Running
    if (['Pending'].includes(phase)) return Pending
    if (['Succeeded'].includes(phase)) return Success
    if (['Failed', 'Error'].includes(phase)) return Failed
    if (['Omitted', 'Skipped', 'Queued'].includes(phase)) return Skipped
    return ''
}

export const createNode = (nodeData, rootNodeName) => {
    const {
        id,
        phase,
        displayName,
        startedAt,
        finishedAt,
        type,
        name: nodeName,
    } = nodeData

    let displayNameTrunc = displayName

    let isStart = false
    let isConfig = false

    if (nodeName === `${rootNodeName}`) {
        displayNameTrunc = 'START'
        isStart = true
    }

    // if (item.parent === `${rootNodeName}`) {
    //     displayNameTrunc = 'Config'
    //     isConfig = true
    // }

    return {
        startedAt: new Date(startedAt),
        finishedAt: new Date(finishedAt),
        timecalc: timeDiffCalc(new Date(startedAt), new Date(finishedAt)),
        id,
        displayName,
        name: nodeName,
        phase,
        type,
        zIndex: 10,
        width: 140,
        height: 40,
        shape: 'html',
        data: nodeData,
        html: {
            render(node) {
                const data = node.getData() as any

                if (isStart) {
                    return `<div class="text-xl flex items-center justify-center w-full h-full  leading-none text-primary font-bold">${displayNameTrunc}</div>`
                }
                if (isConfig) {
                    return `<div class="rounded bg-white shadow flex items-center justify-center w-full h-full border border-primary leading-none text-primary  font-semibold ">${displayNameTrunc}</div>`
                }
                // prettier-ignore
                return `<div class="flex items-center justify-between bg-white px-3 w-full h-full shadow-lg rounded 
                            ${data?.isSelected ? 'node-selected':''} ${phase} ${type} 
                            ${type === 'Pod' ? 'border border-l-4' : 'border'} 
                            ${getRunBorderClassByPhase(phase)}"
                        >
                            <div class="font-bold truncate ${getRunTextClassByPhase(phase)}">${displayNameTrunc}</div>
                            <img class="h-4 w-auto ${phase === 'Running' ? 'animate-spin' : ''}" src="${getRunIcon(phase)}">
                        </div>`
            },
            shouldComponentUpdate(node) {
                return node.hasChanged('data')
            },
        },
    }
}

export const createEdge = (sourceId, targetId) => ({
    id: `${sourceId}@${targetId}`,
    source: sourceId,
    target: targetId,
    router: { name: 'metro' },
    connector: { name: 'rounded' },
    attrs: {
        line: {
            stroke: '#aaaaaa',
            strokeWidth: 1,
            targetMarker: {
                name: 'block',
                targetMarker: 'classic',
                stroke: '#aaaaaa',
                fill: '#aaaaaa',

                width: 5,
                height: 5,
            },
        },
    },
})
