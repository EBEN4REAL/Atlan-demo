import snowflake from '~/assets/images/source/snowflake.png'
import tableau from '~/assets/images/source/tableau.png'
import redshift from '~/assets/images/source/redshift.png'
import postgres from '~/assets/images/source/postgres.png'
import athena from '~/assets/images/source/athena.png'
import database from '~/assets/images/assetType/Database.svg'
import schema from '~/assets/images/assetType/Schema.svg'

export const SourceList = [
    {
        id: 'snowflake',
        label: 'Snowflake',
        image: snowflake,
        filterMaxLevel: 2,
        hierarchy: [
            {
                typeName: 'Database',
                name: 'Database',
                parent: '',
                attribute: 'databaseQualifiedName',
                level: 1,
                image: database,
            },
            {
                typeName: 'Schema',
                name: 'Schema',
                parent: 'Database',
                attribute: 'schemaQualifiedName',
                level: 2,
                image: schema,
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
    },
    {
        id: 'tableau',
        label: 'Tableau',
        image: tableau,
        hierarchy: [],
    },
    {
        id: 'redshift',
        label: 'Redshift',
        image: redshift,
        hierarchy: [],
    },
    {
        id: 'postgres',
        label: 'Postgres',
        image: postgres,
        hierarchy: [],
    },
    {
        id: 'athena',
        label: 'Athena',
        image: athena,
        hierarchy: [],
    },
    {
        id: 'powerBI',
        label: 'PowerBI',
        image: tableau,
        hierarchy: [],
    }
]
