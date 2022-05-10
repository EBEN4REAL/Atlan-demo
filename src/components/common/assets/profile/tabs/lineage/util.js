import {
    snowflake,
    tableau,
    redshift,
    postgres,
    athena,
    databricks,
    powerbi,
    bigquery,
    looker,
    mysql,
    mssql,
    glue,
} from './icons'

/** STORE */
import useLineageStore from '~/store/lineage'

const lineageStore = useLineageStore()

/* This is a mapping of the asset types. */
export const getNodeTypeText = {
    // SQL
    Column: 'Column',
    ColumnProcess: 'Process',
    Database: 'Database',
    Process: 'Process',
    Table: 'Table',
    View: 'View',
    MaterialisedView: 'MaterialisedView',
    // PowerBI
    PowerBIDashboard: 'Dashboard',
    PowerBIDataflow: 'Dataflow',
    PowerBIDataset: 'Dataset',
    PowerBIDatasource: 'Datasource',
    PowerBIPage: 'Page',
    PowerBIReport: 'Report',
    PowerBITile: 'Tile',
    PowerBIWorkspace: 'Workspace',
    // Looker
    LookerView: 'View',
    LookerTile: 'Tile',
    LookerFolder: 'Folder',
    LookerDashboard: 'Dashboard',
    LookerQuery: 'Query',
    LookerExplore: 'Explore',
    LookerField: 'Field',
    LookerLook: 'Look',
    LookerModel: 'Model',
    LookerProject: 'Project',
    // Tableau
    TableauDatasource: 'Datasource',
    TableauCalculatedField: 'CalculatedField',
    TableauDatasourceField: 'DatasourceField',
    TableauDashboard: 'Dashboard',
    TableauWorksheet: 'Worksheet',
    TableauWorkbook: 'Workbook',
    TableauProject: 'Project',
    TableauSite: 'Site',
    TableauFlow: 'Flow',
    TableauMetric: 'Metric',
}

/* This is a mapping of the source of the asset to the image. */
export const getNodeSourceImage = {
    snowflake,
    tableau,
    redshift,
    postgres,
    athena,
    databricks,
    powerbi,
    bigquery,
    looker,
    mysql,
    mssql,
    glue,
}

/**
 * Given an entity, return the source of the entity
 * @param entity - The entity object.
 * @returns The source of the entity.
 */
export const getSource = (entity) => {
    // TODO:
    if (entity.typeName === 'vpNode') return null

    const item =
        entity.attributes?.qualifiedName?.split('/') ||
        entity.uniqueAttributes?.qualifiedName?.split('/')
    if (item[0] === 'default') return item[1]
    return item[0]
}

/**
 * Given an entity, return the schema name of the entity
 * @param entity - The entity object.
 * @returns The schema name of the table or view.
 */
export const getSchema = (entity) => {
    // TODO:
    const allowedTypes = ['Table', 'View']
    if (!allowedTypes.includes(entity.typeName)) return null
    const item =
        entity.attributes?.qualifiedName?.split('/') ||
        entity.uniqueAttributes?.qualifiedName?.split('/')
    if (item[0] === 'default') return item[4]
    return item[3]
}

export const getFilteredRelations = (relations) => {
    const relsSet = new Set()
    const filteredRels = []
    relations.forEach((rel) => {
        const { fromEntityId, toEntityId } = rel
        const entry = `${fromEntityId}@${toEntityId}`
        if (!relsSet.has(entry)) {
            relsSet.add(entry)
            filteredRels.push(rel)
        }
    })
    return filteredRels
}

export const getCyclicRelations = (relations) => {
    const res = []
    const relationsId = relations.map(
        (x) => `${x.fromEntityId}@${x.toEntityId}`
    )
    relations.forEach((id) => {
        const { fromEntityId, toEntityId } = id
        const entryCW = `${fromEntityId}@${toEntityId}`
        const entryACW = `${toEntityId}@${fromEntityId}`
        const isCyclic = relationsId.includes(entryACW)
        if (isCyclic) res.push(entryCW)
    })
    return res
}

export const getGroupedRelations = (relations) => {
    let res = {}
    relations.forEach((rel) => {
        const { fromEntityId, toEntityId } = rel
        const entry = `${fromEntityId}@${toEntityId}`
        if (res[entry]) res[entry] += 1
        else res = { ...res, [entry]: 1 }
    })

    Object.entries(res).forEach(([k, v]) => {
        if (v < 2) delete res[k]
    })
    return res
}

export const controlCyclicEdges = (graph, relations) => {
    const cyclicRelations = getCyclicRelations(relations)
    const graphEdges = graph.value.getEdges()
    graphEdges.forEach((edge) => {
        const sourceNode = edge.getSourceNode()
        const targetNode = edge.getTargetNode()
        const entry = `${sourceNode.id}@${targetNode.id}`
        const isCyclic = cyclicRelations.includes(entry)
        if (isCyclic) {
            edge.updateData({ isCyclicEdge: true })
            edge.attr('line/stroke', '#F4B444')
            edge.attr('line/strokeWidth', 0.9)
            edge.attr('line/targetMarker/stroke', '#F4B444')
            edge.setLabels({
                attrs: {
                    label: {
                        text: 'cyclic-processes',
                    },
                },
            })
            edge.toFront()
            lineageStore.setCyclicRelation(entry)
        }
    })
}

export const controlGroupedEdges = (graph, relations) => {
    const groupedRelations = Object.keys(getGroupedRelations(relations))
    const graphEdges = graph.value.getEdges()
    graphEdges.forEach((edge) => {
        const sourceNode = edge.getSourceNode()
        const targetNode = edge.getTargetNode()
        const entry = `${sourceNode.id}@${targetNode.id}`
        const isGrouped = groupedRelations.includes(entry)
        if (isGrouped) {
            edge.updateData({ isGroupEdge: true })
            edge.setLabels({
                attrs: {
                    label: {
                        text: 'grouped-processes',
                    },
                },
            })
        }
    })
}
