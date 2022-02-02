import { NV, BNV } from './view'

interface PointBasic {
    x: number
    y: number
}
const getDistance = (p1: PointBasic, p2: PointBasic): number => {
    const diff: PointBasic = { x: p1.x - p2.x, y: p1.y - p2.y }
    return Math.round(Math.sqrt(diff.x ** 2 + diff.y ** 2))
}

export default function useCreateGraph(
    graph,
    graphLayout,
    graphContainer,
    minimapContainer,
    graphWidth,
    graphHeight
) {
    /* Build Graph Canvas */
    const { Graph, Point, Path } = window.X6
    const { DagreLayout } = window.layout

    Graph.registerConnector(
        'beiz',
        (s: PointBasic, t: PointBasic, route: PointBasic[]) => {
            let fullPath = ''

            // If no route points then construct the normal bezier curve
            if (route.length <= 4) {
                let control = 100
                let offset = 10

                if (s.x > t.x) {
                    control = -control
                    offset = -offset
                }

                const v1 = { x: s.x + control + offset, y: s.y }
                const v2 = { x: t.x - control - offset, y: t.y }

                // M - Start, L - Line, C - Bezier Curve, Q - Quadratic curve
                // prettier-ignore
                fullPath = `M ${s.x} ${s.y} 
                        L ${s.x + offset} ${s.y}
                        C ${v1.x} ${v1.y} ${v2.x} ${v2.y} ${t.x - offset} ${t.y}
                        L ${t.x} ${t.y}`
            } else {
                // This is the rounded connector algo
                // https://github.com/antvis/X6/blob/master/packages/x6/src/registry/connector/rounded.ts
                const path = new Path()
                path.appendSegment(Path.createSegment('M', s))

                const f13 = 1 / 3
                const f23 = 2 / 3
                const radius = 30

                let prevDistance
                let nextDistance
                for (let i = 0, ii = route.length; i < ii; i += 1) {
                    const curr = Point.create(route[i])
                    const prev = route[i - 1] || s
                    const next = route[i + 1] || t

                    prevDistance = nextDistance || curr.distance(prev) / 2
                    nextDistance = curr.distance(next) / 2

                    const startMove = -Math.min(radius, prevDistance)
                    const endMove = -Math.min(radius, nextDistance)

                    const roundedStart = curr
                        .clone()
                        .move(prev, startMove)
                        .round()
                    const roundedEnd = curr.clone().move(next, endMove).round()

                    const control1 = new Point(
                        f13 * roundedStart.x + f23 * curr.x,
                        f23 * curr.y + f13 * roundedStart.y
                    )
                    const control2 = new Point(
                        f13 * roundedEnd.x + f23 * curr.x,
                        f23 * curr.y + f13 * roundedEnd.y
                    )

                    path.appendSegment(Path.createSegment('L', roundedStart))
                    path.appendSegment(
                        Path.createSegment('C', control1, control2, roundedEnd)
                    )
                }

                path.appendSegment(Path.createSegment('L', t))

                fullPath = path.serialize()
            }
            return fullPath
        },
        true
    )

    Graph.registerConnector(
        'beizAlt',
        (s, t) => {
            let control = 100
            let offset = 10

            if (s.x > t.x) {
                control = -control
                offset = -offset
            }

            const v1 = { x: s.x + control + offset, y: s.y }
            const v2 = { x: t.x - control / 2 - offset, y: t.y }

            return `M ${s.x} ${s.y}
                L ${s.x + offset} ${s.y}
                C ${v1.x} ${v1.y} ${v2.x} ${v2.y} ${t.x - offset} ${t.y}
                L ${t.x} ${t.y}
            `
        },
        true
    )

    graph.value = new Graph({
        autoResize: true,
        interacting: false,
        container: graphContainer.value,
        grid: true,
        background: { color: '#f8f8f8' },
        height: graphHeight.value / 1.35,
        width: graphWidth.value,
        scroller: {
            enabled: true,
            pageVisible: false,
            pageBreak: true,
            pannable: true,
        },
        mousewheel: {
            minScale: 0.5,
            maxScale: 1.2,
            enabled: true,
            global: false,
            factor: 1.04,
            modifiers: ['ctrl', 'meta'],
        },
        minimap: {
            enabled: true,
            container: minimapContainer.value,
            width: 226,
            height: 105,
            padding: 6,
            graphOptions: {
                async: true,
                getCellView(cell) {
                    if (cell.store.data.isBase) return BNV
                    if (cell.isNode()) return NV
                },
                createCellView(cell) {
                    if (!cell.isNode()) return null
                },
            },
        },
    })

    Graph.registerPortLayout(
        'erPortPosition',
        (portsPositionArgs) =>
            portsPositionArgs.map((_, index) => ({
                position: {
                    x: 1,
                    y: (index + 1) * 41 + 40,
                },
                angle: 0,
            })),
        true
    )

    /* graphLayout */
    graphLayout.value = new DagreLayout({
        type: 'dagre',
        rankdir: 'LR',
        controlPoints: true,
        nodesepFunc(x) {
            // vertical spacing btw nodes
            return 20
        },
        ranksepFunc(x) {
            // horizontal spacing btw nodes
            return 190
        },
    })

    return {
        graph,
        graphLayout,
    }
}
