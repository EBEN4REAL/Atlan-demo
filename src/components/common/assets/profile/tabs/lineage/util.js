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
    Column: 'Column',
    ColumnProcess: 'Process',
    Database: 'Database',
    PowerBIDashboard: 'PowerBIDashboard',
    PowerBIDataflow: 'PowerBIDataflow',
    PowerBIDataset: 'PowerBIDataset',
    PowerBIDatasource: 'PowerBIDatasource',
    PowerBIPage: 'PowerBIPage',
    PowerBIReport: 'PowerBIReport',
    PowerBITile: 'PowerBITile',
    PowerBIWorkspace: 'PowerBIWorkspace',
    Process: 'Process',
    Query: 'Query',
    QueryFolder: 'Folder',
    QueryFolderNamespace: 'QueryFolderNamespace',
    Table: 'Table',
    View: 'View',
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
    const item = entity.attributes.qualifiedName.split('/')
    if (item[0] === 'default') return item[1]
    return item[0]
}

export const getSchema = (entity) => {
    const item = entity.attributes.qualifiedName.split('/')
    if (item[0] === 'default') return item[4]
    return item[3]
}
