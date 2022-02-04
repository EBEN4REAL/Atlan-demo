import snowflake from '~/assets/images/source/snowflake.png'
import tableau from '~/assets/images/source/tableau.png'
import redshift from '~/assets/images/source/redshift.png'
import postgres from '~/assets/images/source/postgres.png'
import athena from '~/assets/images/source/athena.png'
import mysql from '~/assets/images/source/mysql.png'
import glue from '~/assets/images/source/glue.png'
import powerbi from '~/assets/images/source/powerbi.png'
import databricks from '~/assets/images/source/databricks.png'
import looker from '~/assets/images/source/looker.png'
import bigquery from '~/assets/images/source/bigquery.png'

/**
 * Gets the mapped string for the Node type
 * @returns {String}
 */
export const getNodeTypeText = {
    // SQL
    Column: 'Column',
    ColumnProcess: 'Process',
    Database: 'Database',
    Process: 'Process',
    Table: 'Table',
    View: 'View',
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
    TableauCalculatedField: 'Calculated Field',
    TableauDatasourceField: 'Datasource Field',
    TableauDashboard: 'Dashboard',
    TableauWorksheet: 'Worksheet',
    TableauWorkbook: 'Workbook',
    TableauProject: 'Project',
    TableauSite: 'Site',
    TableauFlow: 'Flow',
    TableauMetric: 'Metric',
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
    powerbi,
    databricks,
    looker,
    bigquery,
}

// FIXME: Shall we use the connectorName attribute here?
export const getSource = (entity) => {
    const item =
        entity.attributes?.qualifiedName?.split('/') ||
        entity.uniqueAttributes?.qualifiedName?.split('/')
    if (item[0] === 'default') return item[1]
    return item[0]
}

export const getSchema = (entity) => {
    const allowedTypes = ['Table', 'View']
    if (!allowedTypes.includes(entity.typeName)) return null
    const item =
        entity.attributes?.qualifiedName?.split('/') ||
        entity.uniqueAttributes?.qualifiedName?.split('/')
    if (item[0] === 'default') return item[4]
    return item[3]
}

export const childParentBiAssetMap = {
    PowerBIReport: 'dataset',
    LookerTile: 'query',
}

export const childGroupBiAssetMap = {
    LookerQuery: 'model',
    LookerTile: 'dashboard',
}

export const parentChildrenBiAssetMap = {
    PowerBIDataset: [
        'datasets',
        'workspace',
        'tiles',
        'reports',
        'datasources',
        'dataflows',
    ],
    LookerQuery: ['tiles', 'model', 'looks'],
}

export const nonBiTypes = [
    'Column',
    'ColumnProcess',
    'Database',
    'Process',
    'Table',
    'View',
]
