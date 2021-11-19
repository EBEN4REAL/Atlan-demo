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
    Table: 'Table',
    Column: 'Column',
    View: 'View',
    Database: 'Database',
    Schema: 'Schema',
    BIDashboard: 'BI Dashboard',
    BICollection: 'BI Collection',
    BIWidget: 'BI Widget',
    BIModel: 'BI Model',
    BIExplore: 'BI Explore',
    Process: 'Process',
    Integration: 'Integration',
    TableauSite: 'Site',
    TableauProject: 'Project',
    TableauWorkbook: 'Workbook',
    TableauWorksheet: 'Worksheet',
    TableauDashboard: 'Dashboard',
    TableauDatasource: 'Datasource',
    TableauFlow: 'Flow',
    TableauMetric: 'Metric',
    TableauCalculatedField: 'CalculatedField',
    TableauDatasourceField: 'DatasourceField',
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
