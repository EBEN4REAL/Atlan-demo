import Snowflake from '~/assets/images/source/svg/Snowflake.svg?url'
import Tableau from '~/assets/images/source/svg/Tableau.svg?url'
import Redshift from '~/assets/images/source/svg/Redshift.svg?url'
import Postgres from '~/assets/images/source/svg/postgres.svg?url'
import Athena from '~/assets/images/source/svg/Athena.svg?url'
import Databricks from '~/assets/images/source/svg/Databricks.svg?url'
import PowerBI from '~/assets/images/source/svg/PowerBI.svg?url'
import BigQuery from '~/assets/images/source/svg/Bigquery.svg?url'
import Looker from '~/assets/images/source/svg/Looker.svg?url'
import Salesforce from '~/assets/images/source/svg/Salesforce.svg?url'
import MySQL from '~/assets/images/source/svg/MySQL.svg?url'
import MSSQL from '~/assets/images/source/svg/MSSQL.svg?url'
// FIXME: Add an SVG for glue
import Glue from '~/assets/images/source/glue.png'

export const SourceList = [
    {
        id: 'snowflake',
        label: 'Snowflake',
        image: Snowflake,
        filterMaxLevel: 2,
        connectionCount: 0,
        dialectConfig: {
            assetQuoteType: '"',
            abortQuery: true,
        },
        hierarchy: [
            {
                typeName: 'Database',
                name: 'Database',
                parent: '',
                attribute: 'databaseQualifiedName',
                level: 1,
                image: 'Database',
            },
            {
                typeName: 'Schema',
                name: 'Schema',
                parent: 'Database',
                attribute: 'schemaQualifiedName',
                level: 2,
                image: 'Schema',
            },
            {
                typeName: 'Table',
                name: 'Table',
                parent: 'Schema',
                attribute: 'tableQualifiedName',
                level: 3,
            },
            {
                typeName: 'View',
                name: 'View',
                parent: 'Schema',
                attribute: 'viewQualifiedName',
                level: 3,
            },
        ],
        types: [
            'Database',
            'Schema',
            'Table',
            'Column',
            'View',
            'TablePartition',
            'MaterialisedView',
            'Query',
            'Folder',
        ],
    },
    {
        id: 'tableau',
        label: 'Tableau',
        image: Tableau,
        hierarchy: [],
        types: [
            'TableauSite',
            'TableauProject',
            'TableauWorkbook',
            'TableauWorksheet',
            'TableauDashboard',
            'TableauDatasource',
            'TableauDatasourceField',
            'TableauCalculatedField',
        ],
    },
    {
        id: 'redshift',
        label: 'Redshift',
        image: Redshift,

        connectionCount: 0,
        dialectConfig: {
            abortQuery: true,
        },
        hierarchy: [
            {
                typeName: 'Database',
                name: 'Database',
                parent: '',
                attribute: 'databaseQualifiedName',
                level: 1,
                image: 'Database',
            },
            {
                typeName: 'Schema',
                name: 'Schema',
                parent: 'Database',
                attribute: 'schemaQualifiedName',
                level: 2,
                image: 'Schema',
            },
            {
                typeName: 'Table',
                name: 'Table',
                parent: 'Schema',
                attribute: 'tableQualifiedName',
                level: 3,
            },
            {
                typeName: 'View',
                name: 'View',
                parent: 'Schema',
                attribute: 'viewQualifiedName',
                level: 3,
            },
            {
                typeName: 'Procedure',
                name: 'Procedure',
                parent: 'Schema',
                attribute: 'procedureQualifiedName',
                level: 3,
            },
        ],
    },
    {
        id: 'mysql',
        label: 'MySQL',
        image: MySQL,
        connectionCount: 0,
        dialectConfig: {
            abortQuery: true,
        },
        selectFirstAsDefault: true, // false by default
        hierarchy: [
            {
                typeName: 'Database',
                name: 'Database',
                parent: '',
                attribute: 'databaseQualifiedName',
                level: 1,
                image: 'Database',
            },
            {
                typeName: 'Schema',
                name: 'Schema',
                parent: 'Database',
                attribute: 'schemaQualifiedName',
                level: 2,
                image: 'Schema',
            },
            {
                typeName: 'Table',
                name: 'Table',
                parent: 'Schema',
                attribute: 'tableQualifiedName',
                level: 3,
            },
            {
                typeName: 'View',
                name: 'View',
                parent: 'Schema',
                attribute: 'viewQualifiedName',
                level: 3,
            },
            {
                typeName: 'Procedure',
                name: 'Procedure',
                parent: 'Schema',
                attribute: 'procedureQualifiedName',
                level: 3,
            },
        ],
    },
    {
        id: 'mssql',
        label: 'MSSQL',
        image: MSSQL,
        connectionCount: 0,
        dialectConfig: {
            abortQuery: true,
        },
        selectFirstAsDefault: true, // false by default
        hierarchy: [
            {
                typeName: 'Database',
                name: 'Database',
                parent: '',
                attribute: 'databaseQualifiedName',
                level: 1,
                image: 'Database',
            },
            {
                typeName: 'Schema',
                name: 'Schema',
                parent: 'Database',
                attribute: 'schemaQualifiedName',
                level: 2,
                image: 'Schema',
            },
            {
                typeName: 'Table',
                name: 'Table',
                parent: 'Schema',
                attribute: 'tableQualifiedName',
                level: 3,
            },
            {
                typeName: 'View',
                name: 'View',
                parent: 'Schema',
                attribute: 'viewQualifiedName',
                level: 3,
            },
            {
                typeName: 'Procedure',
                name: 'Procedure',
                parent: 'Schema',
                attribute: 'procedureQualifiedName',
                level: 3,
            },
        ],
        types: [
            'Database',
            'Schema',
            'Table',
            'Column',
            'View',
            'Query',
            'Folder',
        ],
    },
    {
        id: 'databricks',
        label: 'Databricks',
        image: Databricks,
        hierarchy: [
            {
                typeName: 'Database',
                name: 'Database',
                parent: '',
                attribute: 'databaseQualifiedName',
                level: 1,
                image: 'Database',
            },
            {
                typeName: 'Schema',
                name: 'Schema',
                parent: 'Database',
                attribute: 'schemaQualifiedName',
                level: 2,
                image: 'Schema',
            },
            {
                typeName: 'Table',
                name: 'Table',
                parent: 'Schema',
                attribute: 'tableQualifiedName',
                level: 3,
            },
            {
                typeName: 'View',
                name: 'View',
                parent: 'Schema',
                attribute: 'viewQualifiedName',
                level: 3,
            },
            {
                typeName: 'Procedure',
                name: 'Procedure',
                parent: 'Schema',
                attribute: 'procedureQualifiedName',
                level: 3,
            },
        ],
        dialectConfig: {
            assetQuoteType: '`',
            // does not support abortQuery for now
            abortQuery: false,
        },
        connectionCount: 0,
        types: [
            'Database',
            'Schema',
            'Table',
            'Column',
            'View',
            'Procedure',
            'TablePartition',
            'Query',
            'Folder',
        ],
    },
    {
        id: 'bigquery',
        label: 'BigQuery',
        image: BigQuery,
        hierarchy: [
            {
                typeName: 'Database',
                name: 'Database',
                parent: '',
                attribute: 'databaseQualifiedName',
                level: 1,
                image: 'Database',
            },
            {
                typeName: 'Schema',
                name: 'Schema',
                parent: 'Database',
                attribute: 'schemaQualifiedName',
                level: 2,
                image: 'Schema',
            },
            {
                typeName: 'Table',
                name: 'Table',
                parent: 'Schema',
                attribute: 'tableQualifiedName',
                level: 3,
            },
            {
                typeName: 'View',
                name: 'View',
                parent: 'Schema',
                attribute: 'viewQualifiedName',
                level: 3,
            },
        ],
        dialectConfig: {
            // does not support abortQuery for now
            abortQuery: false,
        },
        connectionCount: 0,
        types: [
            'Database',
            'Schema',
            'Table',
            'Column',
            'View',
            'TablePartition',
            'MaterialisedView',
            'Query',
            'Folder',
        ],
    },
    {
        id: 'postgres',
        label: 'Postgres',
        image: Postgres,
        hierarchy: [
            {
                typeName: 'Database',
                name: 'Database',
                parent: '',
                attribute: 'databaseQualifiedName',
                level: 1,
                image: 'Database',
            },
            {
                typeName: 'Schema',
                name: 'Schema',
                parent: 'Database',
                attribute: 'schemaQualifiedName',
                level: 2,
                image: 'Schema',
            },
            {
                typeName: 'Table',
                name: 'Table',
                parent: 'Schema',
                attribute: 'tableQualifiedName',
                level: 3,
            },
            {
                typeName: 'View',
                name: 'View',
                parent: 'Schema',
                attribute: 'viewQualifiedName',
                level: 3,
            },
        ],
        connectionCount: 0,
        dialectConfig: {
            abortQuery: true,
        },
        types: [
            'Database',
            'Schema',
            'Table',
            'Column',
            'View',
            'TablePartition',
            'MaterialisedView',
            'Query',
            'Folder',
        ],
    },
    {
        id: 'athena',
        label: 'Athena',
        image: Athena,
        filterMaxLevel: 2,
        dialectConfig: {
            assetQuoteType: '"',
            abortQuery: false,
        },
        hierarchy: [
            {
                typeName: 'Database',
                name: 'Database',
                parent: '',
                attribute: 'databaseQualifiedName',
                level: 1,
                image: 'Database',
            },
            {
                typeName: 'Schema',
                name: 'Schema',
                parent: 'Database',
                attribute: 'schemaQualifiedName',
                level: 2,
                image: 'Schema',
            },
            {
                typeName: 'Table',
                name: 'Table',
                parent: 'Schema',
                attribute: 'tableQualifiedName',
                level: 3,
            },
            {
                typeName: 'View',
                name: 'View',
                parent: 'Schema',
                attribute: 'viewQualifiedName',
                level: 3,
            },
        ],
        types: [
            'Database',
            'Schema',
            'Table',
            'Column',
            'View',
            'TablePartition',
            'MaterialisedView',
            'Query',
            'Folder',
        ],
    },
    {
        id: 'glue',
        label: 'Glue',
        image: Glue,
        filterMaxLevel: 2,
        hierarchy: [
            {
                typeName: 'Database',
                name: 'Database',
                parent: '',
                attribute: 'databaseQualifiedName',
                level: 1,
                image: 'Database',
            },
            {
                typeName: 'Schema',
                name: 'Schema',
                parent: 'Database',
                attribute: 'schemaQualifiedName',
                level: 2,
                image: 'Schema',
            },
            {
                typeName: 'Table',
                name: 'Table',
                parent: 'Schema',
                attribute: 'tableQualifiedName',
                level: 3,
            },
            {
                typeName: 'View',
                name: 'View',
                parent: 'Schema',
                attribute: 'viewQualifiedName',
                level: 3,
            },
        ],
        types: [
            'Database',
            'Schema',
            'Table',
            'Column',
            'View',
            'TablePartition',
            'MaterialisedView',
        ],
    },
    {
        id: 'powerbi',
        label: 'Power BI',
        image: PowerBI,
        connectionCount: 0,
        hierarchy: [],
        types: [
            'PowerBIWorkspace',
            'PowerBIDashboard',
            'PowerBIReport',
            'PowerBIDataset',
            'PowerBIDataflow',
            'PowerBITile',
            'PowerBIPage',
            'PowerBIDatasource',
        ],
    },
    {
        id: 'looker',
        label: 'Looker',
        image: Looker,
        connectionCount: 0,
        hierarchy: [],
        types: [
            'LookerDashboard',
            'LookerExplore',
            'LookerField',
            'LookerFolder',
            'LookerLook',
            'LookerModel',
            'LookerProject',
            'LookerQuery',
            'LookerTile',
        ],
    },
    {
        id: 'salesforce',
        label: 'Salesforce',
        image: Salesforce,
        connectionCount: 0,
        hierarchy: [],
        types: [
            'SalesforceOrganization',
            'SalesforceDashboard',
            'SalesforceReport',
            'SalesforceObject',
            'SalesforceField',
        ],
    },
    {
        id: 's3',
        label: 'S3',
        image: Salesforce,
        connectionCount: 0,
        hierarchy: [],
        types: ['S3Bucket', 'S3Object'],
    },
]
