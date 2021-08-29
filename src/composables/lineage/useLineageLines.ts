import { nextTick } from 'vue'
import {
    graphRelations,
    getPredecessors,
    getSuccessors,
} from '~/components/asset/assetProfile/tabs/lineage/util'
import LeaderLine from 'leader-line-new'

export const getPath = (guid, pathGuid, selectedPathGuids) => {
    if (!guid || guid === pathGuid) {
        pathGuid.value = null
        selectedPathGuids.value = []
    } else pathGuid.value = guid
}

export const isHighlightedNode = (guid, selectedPathGuids) => {
    return selectedPathGuids.value.find((i) => i === guid)
}

export const highlightLines = (
    glGraph,
    guid,
    lines,
    showProcessNodes,
    direction
) => {
    let selectedPathGuids = []
    const args = [
        glGraph.value,
        guid.value,
        showProcessNodes.value,
        direction.value,
        true,
    ]
    const predecessors = getPredecessors(...args)
    const successors = getSuccessors(...args)
    selectedPathGuids = [
        ...predecessors.flat(),
        guid.value,
        ...successors.flat(),
    ]

    nextTick(() => {
        lines.value.forEach((l) => {
            if (
                selectedPathGuids.includes(l.start.id) &&
                selectedPathGuids.includes(l.end.id)
            ) {
                l.setOptions({ color: '#7494e1' })
                const lineSVG = document.getElementById(
                    `line@${l.start.id}@${l.end.id}`
                )
                lineSVG.style.zIndex = 2
            } else if (
                l.start.id.includes('group') &&
                l.end.id.includes('group')
            )
                l.hide('none')
            else l.setOptions({ color: '#d9d9d9' })
        })
    })

    return { selectedPathGuids }
}

export const drawLines = (refs, linesWrapper) => {
    const leaderLineOptions = {
        path: 'grid',
        size: 1.3,
        endPlug: 'arrow3',
        endPlugSize: 1.4,
        startSocket: 'right',
        endSocket: 'left',
        startSocketGravity: 25,
        endSocketGravity: 25,
    }

    const lines = []
    const gR = graphRelations
    const linesElements = []

    console.log('gR:', gR)

    // LeaderLine.positionByWindowResize = false;

    nextTick(() => {
        gR.forEach((l) => {
            // Each node is refrenced with its guid in the DOM
            const fromRef = refs.value[l.fromEntityId]
            const fromNode = fromRef[0] || fromRef
            const toRef = refs.value[l.toEntityId]
            const toNode = toRef[0] || toRef

            if (fromNode && toNode) {
                let color
                // if (l.relationType === "graph") color = "rgba(255, 255, 255, 0)";
                // else color = l.path === "upstream" ? "#9cb781" : "#f1a183";
                color = l.path === 'upstream' ? '#9cb781' : '#f1a183'

                const options = { ...leaderLineOptions, color }
                lines.push(new LeaderLine(fromNode, toNode, options))

                document.querySelector(
                    '.leader-line:last-of-type'
                ).id = `line@${fromNode.id}@${toNode.id}`

                linesElements.push(
                    document.querySelector('.leader-line:last-of-type')
                )
            }
        })

        const rectWrapper = linesWrapper.value.getBoundingClientRect()

        linesWrapper.value.style.transform =
            'translate(-' +
            (rectWrapper.left + window.pageXOffset) +
            'px, -' +
            (rectWrapper.top + window.pageYOffset) +
            'px)'

        // linesElements.forEach((l) => {
        //   linesWrapper.value.appendChild(l);
        // });
    })

    return { lines }
}

export const updateLines = (lines) => {
    nextTick(() => {
        lines.value.forEach((l) => l.position())
    })
}
