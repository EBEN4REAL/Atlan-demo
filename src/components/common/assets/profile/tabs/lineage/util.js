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
    salesforce,
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
    // Salesforce
    SalesforceOrganization: 'Organization',
    SalesforceDashboard: 'Dashboard',
    SalesforceReport: 'Report',
    SalesforceObject: 'Object',
    SalesforceField: 'Field',
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
    salesforce,
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
 * @returns The schema name of the entity.
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

/**
 * Given an entity, return the database name of the entity
 * @param entity - The entity object.
 * @returns The database name of the entity.
 */
export const getDatabase = (entity) => {
    // TODO:
    const allowedTypes = ['Table', 'View']
    if (!allowedTypes.includes(entity.typeName)) return null
    const item =
        entity.attributes?.qualifiedName?.split('/') ||
        entity.uniqueAttributes?.qualifiedName?.split('/')
    if (item[0] === 'default') return item[3]
    return item[2]
}

/**
 * It takes an array of relations and returns an array of relations with duplicates removed
 * @param relations - The array of relations to filter.
 * @returns An array of relations that have been filtered to remove duplicates.
 */
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

/**
 * It takes an array of relations and returns an array of relations that are cyclic
 * @param relations - an array of objects, each object has two properties: fromEntityId and toEntityId.
 * @returns An array of strings.
 */
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

/**
 * It takes an array of relations and returns an object with the number of times each relation occurs
 * @param relations - an array of objects, each object has a fromEntityId and toEntityId property
 * @returns An object with the number of times a relation is repeated.
 */
export const getGroupedRelations = (relations) => {
    let res = {}
    relations.forEach((rel) => {
        const { processId, fromEntityId, toEntityId } = rel
        const entry = `${fromEntityId}@${toEntityId}`
        if (res[entry]) res[entry].push(processId)
        else res = { ...res, [entry]: [processId] }
    })

    Object.entries(res).forEach(([k, v]) => {
        if (v < 2) delete res[k]
    })
    return res
}

/**
 * It takes a graph and a list of relations, and then it checks if any of the relations are cyclic. If
 * they are, it updates the graph to reflect that
 * @param graph - the graph object
 * @param relations - an array of relations, each relation is an object with the following properties:
 */
export const controlCyclicEdges = (graph, relations, mode = 'node') => {
    const cyclicRelations = getCyclicRelations(relations)
    cyclicRelations.forEach((rel) => {
        const [sourceId, targetId] = rel.split('@')

        const edge = graph.value.getEdges().find((e) => {
            const from =
                mode === 'node' ? e.getSource().cell : e.getSource().port
            const to = mode === 'node' ? e.getTarget().cell : e.getTarget().port
            return sourceId === from && targetId === to
        })
        if (!edge) return
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
        const entry = `${sourceId}@${targetId}`
        lineageStore.setCyclicRelation(entry)
    })
}

/**
 * It takes a graph and a list of relations and then it checks if the relations are grouped and if they
 * are, it updates the edge data and the label
 * @param graph - the graph object
 * @param relations - the relations object from the graph data
 */
export const controlGroupedEdges = (graph, relations, mode = 'node') => {
    const groupedRelations = Object.entries(getGroupedRelations(relations))
    groupedRelations.forEach(([rel, processIds]) => {
        const [sourceId, targetId] = rel.split('@')

        const edge = graph.value.getEdges().find((e) => {
            const from =
                mode === 'node' ? e.getSource().cell : e.getSource().port
            const to = mode === 'node' ? e.getTarget().cell : e.getTarget().port
            return sourceId === from && targetId === to
        })
        if (!edge) return
        const count = processIds.length

        edge.updateData({ isGroupEdge: true, groupCount: count })
        edge.setLabels({
            attrs: {
                label: {
                    // text: `grouped process (${count})`,
                    text: `grouped-processes`,
                },
            },
        })
    })
}

/**
 * It takes a cell and sets its z-index to 20 and then moves it to the front
 * @param cell - The cell to be set to the front.
 */
export const setFront = (cell) => {
    cell.setZIndex(20)
    cell.toFront()
}

/**
 * It takes a cell and sets its z-index to 0 and then sends it to the back
 * @param cell - The cell to be moved to the back.
 */
export const setBack = (cell) => {
    cell.setZIndex(0)
    cell.toBack()
}
