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

export const isCyclicEdge = (mergedLineageData, source, target) => {
    const filtered = mergedLineageData.value.relations.filter((rel) => {
        const { fromEntityId, toEntityId } = rel
        if (
            (fromEntityId === source || fromEntityId === target) &&
            (toEntityId === source || toEntityId === target)
        )
            return true

        return false
    })

    const conditionSet = new Set()
    filtered.forEach((rel) => {
        const { fromEntityId, toEntityId } = rel
        conditionSet.add(`${fromEntityId}@${toEntityId}`)
    })
    const conditionArr = Array.from(conditionSet)

    if (conditionArr.length === 2) return true
    return false
}

export const getFilteredRelations = (relations) => {
    const relsSet = new Set()
    const newRels = []
    relations.forEach((rel) => {
        const { processId, fromEntityId, toEntityId } = rel
        const entry = `${fromEntityId}@${toEntityId}`

        if (!relsSet.has(entry)) {
            const arr = relations.filter((x) => {
                const { fromEntityId: from, toEntityId: to } = x
                if (entry === `${from}@${to}`) return true
                return false
            })

            relsSet.add(entry)

            newRels.push({
                processId,
                fromEntityId,
                toEntityId,
                isDup: !!(arr.length > 1),
            })
        }
    })

    return newRels
}
