import snowflake from '~/assets/images/source/snowflake.png'
import tableau from '~/assets/images/source/tableau.png'
import redshift from '~/assets/images/source/redshift.png'
import postgres from '~/assets/images/source/postgres.png'
import athena from '~/assets/images/source/athena.png'
import mysql from '~/assets/images/source/mysql.png'
import glue from '~/assets/images/source/glue.png'
// import hive from '~/assets/images/source/hive.png'
// import looker from '~/assets/images/source/looker.png'
// import databricks from '~/assets/images/source/databricks.png'

/**
 * Gets the mapped string for the Node type
 * @returns {String}
 */
export const getNodeTypeText = {
    AtlanTable: 'Table',
    AtlanColumn: 'Column',
    AtlanView: 'View',
    AtlanDatabase: 'Database',
    AtlanSchema: 'Schema',
    AtlanBIDashboard: 'BI Dashboard',
    AtlanBICollection: 'BI Collection',
    AtlanBIWidget: 'BI Widget',
    AtlanBIModel: 'BI Model',
    AtlanBIExplore: 'BI Explore',
    AtlanProcess: 'Process',
    AtlanIntegration: 'Integration',
}

/**
 * Gets the Font Awesome Icon class for the Node type
 * @returns {String}
 */
export const getNodeTypeIcon = {
    AtlanTable: 'far fa-table text-table',
    AtlanColumn: 'far fa-columns text-column',
    AtlanView: 'far fa-th-list text-view',
    AtlanDatabase: 'far fa-database',
    AtlanSchema: 'far fa-box',
    AtlanBIDashboard: 'far fa-user-chart', //
    AtlanBICollection: 'far fa-folder', //
    AtlanBIWidget: 'far fa-chart-pie-alt', //
    AtlanBIModel: 'far fa-compass', //
    AtlanBIExplore: 'far fa-eye', //
    AtlanProcess: 'far fa-code', //
    AtlanIntegration: 'far fa-link text-database', //
    Query: 'far fa-code', //
}

/**
 * Gets the image for the source of the node
 */
export const getNodeSourceImage = {
    snowflake,
    tableau,
    redshift,
    postgres,
    athena,
    mysql,
    glue,
    // hive,
    // looker,
    // databricks,
}

export const isProcessNode = (graph, guid) => {
    const nodes = graph.getNodes()
    const entity = nodes.find((x) => x.id === guid)
    return entity.typeName === 'AtlanProcess'
}

export const updateEdgesStroke = (
    graph,
    model,
    edges,
    edgesToHighlight,
    baseEntityGuid,
    reset = false
) => {
    const graphEdges = graph.value.getEdges()
    const newEdgesData = []
    const getEdgeData = (x) => edges.value.find((edgeData) => edgeData.id === x)

    edges.value.forEach((m) => {
        const edgeData = getEdgeData(m.id)
        let computedStroke

        if (reset) {
            const edgesSplit = m.id.split('@')
            const baseCell = graph.value.getCellById(baseEntityGuid)
            const cell = graph.value.getCellById(edgesSplit[0])
            const isPredecessor = graph.value.isPredecessor(baseCell, cell)
            computedStroke = isPredecessor ? '#9cb781' : '#f1a183'
            if (edgesSplit[1] === baseEntityGuid) computedStroke = '#9cb781'
        }

        edgeData.attrs.line.stroke = reset ? computedStroke : '#d9d9d9'
        edgeData.attrs.line.targetMarker.stroke = reset
            ? computedStroke
            : '#d9d9d9'
        edgeData.zIndex = 1
        newEdgesData.push(edgeData)
    })

    if (!reset) {
        edgesToHighlight.forEach((x) => {
            const edgeData = getEdgeData(x)
            edgeData.attrs.line.stroke = '#2351cc'
            edgeData.attrs.line.targetMarker.stroke = '#2351cc'
            edgeData.zIndex = 30
            newEdgesData.push(edgeData)
        })
    }

    newEdgesData.forEach((y) => {
        graphEdges.forEach((z) => {
            if (y.id === z.id) z.updateData(y)
        })
    })

    console.log('lineage -> update graph start')
    graph.value.fromJSON(model.value)
    console.log('lineage -> update graph end')
}

export const updateNodesToHighlight = (
    graph,
    model,
    nodes,
    highlightedNode,
    nodesToHighlight,
    reset = false
) => {
    const graphNodes = graph.value.getNodes()
    const newNodesData = []

    nodes.value.forEach((m) => {
        nodesToHighlight.forEach((x) => {
            if (m.id === x) {
                const nodeData = m
                if (highlightedNode.value === m.id)
                    nodeData.isHighlightedNode = reset ? false : true
                nodeData.isHighlightedNodePath = reset ? false : true
                newNodesData.push(nodeData)
            }
        })
    })

    newNodesData.forEach((y) => {
        graphNodes.forEach((z) => {
            if (y.id === z.id) z.updateData(y)
        })
    })

    graph.value.fromJSON(model.value)
}
