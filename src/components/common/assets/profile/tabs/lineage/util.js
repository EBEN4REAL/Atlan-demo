import snowflake from '~/assets/images/source/snowflake.png'
import tableau from '~/assets/images/source/tableau.png'
import redshift from '~/assets/images/source/redshift.png'
import postgres from '~/assets/images/source/postgres.png'
import athena from '~/assets/images/source/athena.png'
import mysql from '~/assets/images/source/mysql.png'
import glue from '~/assets/images/source/glue.png'
import powerbi from '~/assets/images/source/powerbi.png'

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
    QueryFolder: 'QueryFolder',
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
}
