// Integration Icons
import snowflake from '~/assets/images/source/snowflake.png'
import tableau from '~/assets/images/source/tableau.png'
import redshift from '~/assets/images/source/redshift.png'
import postgres from '~/assets/images/source/postgres.png'
import athena from '~/assets/images/source/athena.png'
import mysql from '~/assets/images/source/mysql.png'
import glue from '~/assets/images/source/glue.png'
import powerbi from '~/assets/images/source/powerbi.png'

// Certification Icons
import deprecated from '~/assets/images/status/deprecated.svg?url'
import verified from '~/assets/images/status/verified.svg?url'
import draft from '~/assets/images/status/draft.svg?url'
import noStatus from '~/assets/images/status/nostatus.svg?url'

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
}

/**
 * Gets the icon for the certification of the node
 */
export const getNodeCertificationImage = {
    deprecated,
    verified,
    draft,
    noStatus,
}
