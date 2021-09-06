const entities = [
    {
        typeName: 'TablePartition',
        attributes: {
            popularityScore: 0,
            __classificationNames: '',
            assetStatusUpdatedBy: 'nitya',
            databaseName: 'northwind',
            'BM for facet 2.Last Verified Date': 1628617410450,
            connectionQualifiedName: 'default/postgres/xhnuxnnr',
            integrationName: 'postgres',
            __modifiedBy: 'nitya',
            description: '',
            __customAttributes:
                '{"is_insertable_into":"YES","is_typed":"NO","is_transient":""}',
            schemaName: 'public',
            'BM for facet 2.Description': '3',
            ownerGroups: '',
            sourceUpdatedAt: 0,
            'BM for facet 2.Order Number': 123,
            'BM for facet 2.test for facet 24 copy 2': 'aa\n',
            'BM for facet 2.test for facet 21': '43',
            'BM for facet 2.test for facet 24': '5',
            rowCount: 1,
            __classificationsText: '',
            __timestamp: 1629440576380,
            'Airflow.Last ETL Status': '123',
            userDescription: 'Helllooooo',
            qualifiedName:
                'default/postgres/xhnuxnnr/northwind/public/measurement_y2006m03',
            connectionLastSyncedAt: 1629440506898,
            __state: 'ACTIVE',
            databaseQualifiedName: 'default/postgres/xhnuxnnr/northwind',
            columnCount: 4,
            meanings: [],
            __guid: 'cc8aaa6e-d4c5-4deb-a908-2f6cde8d56c6',
            'BM for facet 2.Other Properties': '4',
            'BM for facet 2.Business analyst verified': '1',
            'BM for facet 2.Recommended Metrics': true,
            __createdBy: 'service-account-argo-client',
            __modificationTimestamp: 1630521557674,
            name: 'measurement_y2006m03',
            tenantId: 'default',
            connectionName: 'xhnuxnnr',
            assetStatusUpdatedAt: 1629959341541,
            assetStatus: 'verified',
            'Airflow.Enum type': 'ACTIVE',
            ownerUsers: 'nitya',
        },
        guid: 'cc8aaa6e-d4c5-4deb-a908-2f6cde8d56c6',
        status: 'ACTIVE',
        displayText: 'measurement_y2006m03',
        classificationNames: [],
        classifications: [],
        meaningNames: [],
        meanings: [],
        isIncomplete: false,
        labels: [],
    },
    {
        typeName: 'TablePartition',
        attributes: {
            popularityScore: 0,
            __classificationNames: '|Demo 1|',
            assetStatusUpdatedBy: 'nitya',
            databaseName: 'northwind',
            'BM for facet 2.Last Verified Date': 1627991116595,
            connectionQualifiedName: 'default/postgres/xhnuxnnr',
            integrationName: 'postgres',
            __modifiedBy: 'nitya',
            description: '',
            __customAttributes:
                '{"is_insertable_into":"YES","is_typed":"NO","is_transient":""}',
            schemaName: 'public',
            ownerGroups: '',
            sourceUpdatedAt: 0,
            'BM for facet 2.Order Number': 12,
            'BM for facet 2.test for facet 21': 'adasdas',
            rowCount: 1,
            __classificationsText: 'Demo 1 ',
            __timestamp: 1629440576380,
            userDescription: 'Hellooooooooo',
            qualifiedName:
                'default/postgres/xhnuxnnr/northwind/public/measurement_y2006m02',
            connectionLastSyncedAt: 1629440506898,
            __state: 'ACTIVE',
            databaseQualifiedName: 'default/postgres/xhnuxnnr/northwind',
            columnCount: 4,
            meanings: [],
            __guid: '59008900-5fca-4917-b16d-d0dbb30e27ea',
            'BM for facet 2.Other Properties':
                'adfnm.adfnm.adfnm.adfnm.adfnm.adfnm.adfnm.adfnm.',
            'BM for facet 2.Business analyst verified': 'x',
            'BM for facet 2.Recommended Metrics': false,
            __createdBy: 'service-account-argo-client',
            __modificationTimestamp: 1630524469591,
            name: 'measurement_y2006m02',
            tenantId: 'default',
            connectionName: 'xhnuxnnr',
            assetStatusUpdatedAt: 1629821560385,
            assetStatus: 'verified',
            ownerUsers: '',
        },
        guid: '59008900-5fca-4917-b16d-d0dbb30e27ea',
        status: 'ACTIVE',
        displayText: 'measurement_y2006m02',
        classificationNames: ['Demo 1'],
        classifications: [
            {
                typeName: 'Demo 1',
                attributes: {
                    test: null,
                },
                entityGuid: '59008900-5fca-4917-b16d-d0dbb30e27ea',
                entityStatus: 'ACTIVE',
                propagate: false,
                validityPeriods: [],
                removePropagationsOnEntityDelete: false,
            },
        ],
        meaningNames: [],
        meanings: [],
        isIncomplete: false,
        labels: [],
    },
    {
        typeName: 'MaterialisedView',
        attributes: {
            popularityScore: 0,
            __classificationNames: '|Demo 5|Demo 1|Demo 3|',
            assetStatusUpdatedBy: 'nitya',
            databaseName: 'northwind',
            connectionQualifiedName: 'default/postgres/xhnuxnnr',
            integrationName: 'postgres',
            __modifiedBy: 'nitya',
            description: '',
            __customAttributes: '{"is_transient":""}',
            schemaName: 'public',
            'BM for facet 2.Description': '11',
            ownerGroups: '',
            sourceUpdatedAt: 0,
            'BM for facet 2.Order Number': 123,
            'BM for facet 2.test for facet 24 copy 2': 'xxx',
            'BM for facet 2.test for facet 24': 'xx',
            rowCount: 9,
            __classificationsText: 'Demo 5 Demo 1 Demo 3 ',
            __timestamp: 1629440575678,
            viewDefinition:
                ' SELECT employees.employee_id,\n    employees.last_name,\n    employees.first_name,\n    employees.title,\n    employees.title_of_courtesy,\n    employees.birth_date,\n    employees.hire_date,\n    employees.address,\n    employees.city,\n    employees.region,\n    employees.postal_code,\n    employees.country,\n    employees.home_phone,\n    employees.extension,\n    employees.photo,\n    employees.notes,\n    employees.reports_to,\n    employees.photo_path\n   FROM employees;',
            'Airflow.Last ETL Status': 'new1111xx',
            userDescription: ' ',
            qualifiedName:
                'default/postgres/xhnuxnnr/northwind/public/employees_mat_view',
            connectionLastSyncedAt: 1629440506898,
            __state: 'ACTIVE',
            databaseQualifiedName: 'default/postgres/xhnuxnnr/northwind',
            columnCount: 18,
            meanings: [],
            __guid: '60a884a6-d9ba-44df-bb7b-6ba2ee641e85',
            'BM for facet 2.Other Properties': '22',
            'BM for facet 2.Business analyst verified': 'new',
            'BM for facet 2.Recommended Metrics': true,
            __createdBy: 'service-account-argo-client',
            __modificationTimestamp: 1630515922862,
            name: 'employees_mat_view',
            tenantId: 'default',
            connectionName: 'xhnuxnnr',
            assetStatusUpdatedAt: 1629821681738,
            assetStatus: 'verified',
            'Airflow.Enum type': 'OTHER',
            ownerUsers:
                'kaustubh,ramprasath,test2,tanya,sushovan,shubham.jain,yuvraj',
        },
        guid: '60a884a6-d9ba-44df-bb7b-6ba2ee641e85',
        status: 'ACTIVE',
        displayText: 'employees_mat_view',
        classificationNames: ['Demo 5', 'Demo 1', 'Demo 3'],
        classifications: [
            {
                typeName: 'Demo 5',
                entityGuid: '60a884a6-d9ba-44df-bb7b-6ba2ee641e85',
                entityStatus: 'ACTIVE',
                propagate: false,
                validityPeriods: [],
                removePropagationsOnEntityDelete: true,
            },
            {
                typeName: 'Demo 1',
                attributes: {
                    test: null,
                },
                entityGuid: '60a884a6-d9ba-44df-bb7b-6ba2ee641e85',
                entityStatus: 'ACTIVE',
                propagate: false,
                validityPeriods: [],
                removePropagationsOnEntityDelete: true,
            },
            {
                typeName: 'Demo 3',
                entityGuid: '60a884a6-d9ba-44df-bb7b-6ba2ee641e85',
                entityStatus: 'ACTIVE',
                propagate: false,
                validityPeriods: [],
                removePropagationsOnEntityDelete: true,
            },
        ],
        meaningNames: [],
        meanings: [],
        isIncomplete: false,
        labels: [],
    },
    {
        typeName: 'MaterialisedView',
        attributes: {
            popularityScore: 0,
            __classificationNames: '',
            assetStatusUpdatedBy: 'nitya',
            assetStatusMessage: 'HELOOOOO',
            databaseName: 'northwind',
            'BM for facet 2.Last Verified Date': 1691242615028,
            connectionQualifiedName: 'default/postgres/xhnuxnnr',
            integrationName: 'postgres',
            __modifiedBy: 'nitya',
            description: '',
            __customAttributes: '{"is_transient":""}',
            schemaName: 'public',
            ownerGroups: '',
            sourceUpdatedAt: 0,
            'BM for facet 2.Order Number': 12311,
            rowCount: 830,
            __classificationsText: '',
            __timestamp: 1629440575678,
            viewDefinition:
                ' SELECT orders.order_id,\n    orders.customer_id,\n    orders.employee_id,\n    orders.order_date,\n    orders.required_date,\n    orders.shipped_date,\n    orders.ship_via,\n    orders.freight,\n    orders.ship_name,\n    orders.ship_address,\n    orders.ship_city,\n    orders.ship_region,\n    orders.ship_postal_code,\n    orders.ship_country\n   FROM orders;',
            'Airflow.Last ETL Status': '123',
            userDescription:
                'LOREM IPSUM LOREM IPSUM LOREM IPSUM LOREM IPSUM LOREM IPSUM LOREM IPSUM LOREM IPSUM LOREM IPSUM LOREM IPSUM LOREM IPSUM',
            qualifiedName:
                'default/postgres/xhnuxnnr/northwind/public/orders_mat_view',
            connectionLastSyncedAt: 1629440506898,
            __state: 'ACTIVE',
            databaseQualifiedName: 'default/postgres/xhnuxnnr/northwind',
            columnCount: 14,
            meanings: [],
            __guid: '081b06c6-ba4c-4d56-a523-b580d1640021',
            'BM for facet 2.Business analyst verified': '32',
            'BM for facet 2.Recommended Metrics': false,
            __createdBy: 'service-account-argo-client',
            __modificationTimestamp: 1630442904430,
            name: 'orders_mat_view',
            tenantId: 'default',
            connectionName: 'xhnuxnnr',
            assetStatusUpdatedAt: 1630316715101,
            assetStatus: 'verified',
            'Airflow.Enum type': 'DRAFT',
            ownerUsers: 'test2,test1,shivansh',
        },
        guid: '081b06c6-ba4c-4d56-a523-b580d1640021',
        status: 'ACTIVE',
        displayText: 'orders_mat_view',
        classificationNames: [],
        classifications: [],
        meaningNames: [],
        meanings: [],
        isIncomplete: false,
        labels: [],
    },
    {
        typeName: 'TableauSite',
        attributes: {
            popularityScore: 0,
            connectionQualifiedName: 'default/tableau/xzifl77r',
            integrationName: 'tableau',
            __modifiedBy: 'service-account-argo-client',
            qualifiedName:
                'default/tableau/xzifl77r/09638d94-ad32-48b7-89a1-361bcb4698b2',
            connectionLastSyncedAt: 1629658678299,
            __state: 'ACTIVE',
            __customAttributes:
                '{"uri":"sites/5163","id":"969986f1-4146-b08c-ee98-c795a10bc4f0"}',
            meanings: [],
            __guid: '0bf5b74a-6c79-4d02-a0b1-b35e905d1ba2',
            sourceUpdatedAt: 0,
            __createdBy: 'service-account-argo-client',
            __modificationTimestamp: 1629658739362,
            name: 'Atlan',
            tenantId: 'default',
            connectionName: 'xzifl77r',
            assetStatusUpdatedAt: 0,
            __timestamp: 1629658739362,
        },
        guid: '0bf5b74a-6c79-4d02-a0b1-b35e905d1ba2',
        status: 'ACTIVE',
        displayText: 'Atlan',
        classificationNames: [],
        classifications: [],
        meaningNames: [],
        meanings: [],
        isIncomplete: false,
        labels: [],
    },
    {
        typeName: 'TableauSite',
        attributes: {
            popularityScore: 0,
            connectionQualifiedName: 'default/tableau/2jnsg6g7r',
            integrationName: 'tableau',
            __modifiedBy: 'nitya',
            qualifiedName:
                'default/tableau/2jnsg6g7r/09638d94-ad32-48b7-89a1-361bcb4698b2',
            connectionLastSyncedAt: 1629092642571,
            __state: 'ACTIVE',
            __customAttributes:
                '{"uri":"sites/5163","id":"969986f1-4146-b08c-ee98-c795a10bc4f0"}',
            meanings: [],
            __guid: '69fc8cf7-444f-4ecd-a78d-0c8646a3247a',
            sourceUpdatedAt: 0,
            __createdBy: 'nitya',
            __modificationTimestamp: 1629896196083,
            name: 'Atlan',
            tenantId: 'default',
            connectionName: '2jnsg6g7r',
            assetStatusUpdatedAt: 0,
            __timestamp: 1629896196083,
        },
        guid: '69fc8cf7-444f-4ecd-a78d-0c8646a3247a',
        status: 'ACTIVE',
        displayText: 'Atlan',
        classificationNames: [],
        classifications: [],
        meaningNames: [],
        meanings: [],
        isIncomplete: false,
        labels: [],
    },
    {
        typeName: 'TableauSite',
        attributes: {
            popularityScore: 0,
            connectionQualifiedName: 'default/tableau/ui9hvpv7r',
            integrationName: 'tableau',
            __modifiedBy: 'service-account-argo-client',
            qualifiedName:
                'default/tableau/ui9hvpv7r/09638d94-ad32-48b7-89a1-361bcb4698b2',
            connectionLastSyncedAt: 1630294043640,
            __state: 'ACTIVE',
            __customAttributes:
                '{"uri":"sites/5163","id":"969986f1-4146-b08c-ee98-c795a10bc4f0"}',
            meanings: [],
            __guid: '42b1ee54-4fd3-4644-85c2-61bade6929a8',
            sourceUpdatedAt: 0,
            __createdBy: 'service-account-argo-client',
            __modificationTimestamp: 1630294110339,
            name: 'Atlan',
            tenantId: 'default',
            connectionName: 'ui9hvpv7r',
            assetStatusUpdatedAt: 0,
            __timestamp: 1630294110110,
        },
        guid: '42b1ee54-4fd3-4644-85c2-61bade6929a8',
        status: 'ACTIVE',
        displayText: 'Atlan',
        classificationNames: [],
        classifications: [],
        meaningNames: [],
        meanings: [],
        isIncomplete: false,
        labels: [],
    },
    {
        typeName: 'TableauSite',
        attributes: {
            popularityScore: 0,
            connectionQualifiedName: 'default/tableau/korx2p47g',
            integrationName: 'tableau',
            __modifiedBy: 'service-account-argo-client',
            qualifiedName:
                'default/tableau/korx2p47g/09638d94-ad32-48b7-89a1-361bcb4698b2',
            connectionLastSyncedAt: 1630299282212,
            __state: 'ACTIVE',
            __customAttributes:
                '{"uri":"sites/5163","id":"969986f1-4146-b08c-ee98-c795a10bc4f0"}',
            meanings: [],
            __guid: '99e09d31-7498-4f00-96f9-31d4307e7a36',
            sourceUpdatedAt: 0,
            __createdBy: 'service-account-argo-client',
            __modificationTimestamp: 1630299346754,
            name: 'Atlan',
            tenantId: 'default',
            connectionName: 'korx2p47g',
            assetStatusUpdatedAt: 0,
            __timestamp: 1630299346542,
        },
        guid: '99e09d31-7498-4f00-96f9-31d4307e7a36',
        status: 'ACTIVE',
        displayText: 'Atlan',
        classificationNames: [],
        classifications: [],
        meaningNames: [],
        meanings: [],
        isIncomplete: false,
        labels: [],
    },
    {
        typeName: 'TableauSite',
        attributes: {
            popularityScore: 0,
            connectionQualifiedName: 'default/tableau/obarnhv7r',
            integrationName: 'tableau',
            __modifiedBy: 'service-account-argo-client',
            qualifiedName:
                'default/tableau/obarnhv7r/09638d94-ad32-48b7-89a1-361bcb4698b2',
            connectionLastSyncedAt: 1630326860747,
            __state: 'ACTIVE',
            __customAttributes:
                '{"uri":"sites/5163","id":"969986f1-4146-b08c-ee98-c795a10bc4f0"}',
            meanings: [],
            __guid: '3e952792-d9f1-4d3d-aab8-5e13c3ff7f60',
            sourceUpdatedAt: 0,
            __createdBy: 'service-account-argo-client',
            __modificationTimestamp: 1630326924930,
            name: 'Atlan',
            tenantId: 'default',
            connectionName: 'obarnhv7r',
            assetStatusUpdatedAt: 0,
            __timestamp: 1630326924670,
        },
        guid: '3e952792-d9f1-4d3d-aab8-5e13c3ff7f60',
        status: 'ACTIVE',
        displayText: 'Atlan',
        classificationNames: [],
        classifications: [],
        meaningNames: [],
        meanings: [],
        isIncomplete: false,
        labels: [],
    },
    {
        typeName: 'TableauSite',
        attributes: {
            popularityScore: 0,
            userDescription: 'hello',
            connectionQualifiedName: 'default/tableau/at7cla77r',
            integrationName: 'tableau',
            __modifiedBy: 'nitya',
            qualifiedName:
                'default/tableau/at7cla77r/09638d94-ad32-48b7-89a1-361bcb4698b2',
            connectionLastSyncedAt: 1629441041992,
            __state: 'ACTIVE',
            __customAttributes:
                '{"uri":"sites/5163","id":"969986f1-4146-b08c-ee98-c795a10bc4f0"}',
            meanings: [],
            __guid: '6872a57a-3529-46cc-a0f3-7f5151a986a6',
            sourceUpdatedAt: 0,
            __createdBy: 'service-account-argo-client',
            __modificationTimestamp: 1630389824077,
            name: 'Atlan',
            tenantId: 'default',
            connectionName: 'at7cla77r',
            assetStatusUpdatedAt: 0,
            __timestamp: 1629441102102,
        },
        guid: '6872a57a-3529-46cc-a0f3-7f5151a986a6',
        status: 'ACTIVE',
        displayText: 'Atlan',
        classificationNames: [],
        classifications: [],
        meaningNames: [],
        meanings: [],
        isIncomplete: false,
        labels: [],
    },
    {
        typeName: 'TableauSite',
        attributes: {
            popularityScore: 0,
            connectionQualifiedName: 'default/tableau/mlk8ja7nr',
            integrationName: 'tableau',
            __modifiedBy: 'nitya',
            qualifiedName:
                'default/tableau/mlk8ja7nr/09638d94-ad32-48b7-89a1-361bcb4698b2',
            connectionLastSyncedAt: 1629442930190,
            __state: 'ACTIVE',
            __customAttributes:
                '{"uri":"sites/5163","id":"969986f1-4146-b08c-ee98-c795a10bc4f0"}',
            meanings: [],
            __guid: '8bd394c9-f582-43d5-8558-12d5289f0dd3',
            ownerGroups: '',
            sourceUpdatedAt: 0,
            __createdBy: 'service-account-argo-client',
            __modificationTimestamp: 1630390810712,
            name: 'Atlan',
            tenantId: 'default',
            connectionName: 'mlk8ja7nr',
            assetStatusUpdatedAt: 0,
            __timestamp: 1629442992353,
            ownerUsers: '',
        },
        guid: '8bd394c9-f582-43d5-8558-12d5289f0dd3',
        status: 'ACTIVE',
        displayText: 'Atlan',
        classificationNames: [],
        classifications: [],
        meaningNames: [],
        meanings: [],
        isIncomplete: false,
        labels: [],
    },
    {
        typeName: 'TableauSite',
        attributes: {
            popularityScore: 0,
            connectionQualifiedName: 'default/tableau/wlmrla4nr',
            integrationName: 'tableau',
            __modifiedBy: 'service-account-argo-client',
            qualifiedName:
                'default/tableau/wlmrla4nr/09638d94-ad32-48b7-89a1-361bcb4698b2',
            connectionLastSyncedAt: 1630412880205,
            __state: 'ACTIVE',
            __customAttributes:
                '{"uri":"sites/5163","id":"969986f1-4146-b08c-ee98-c795a10bc4f0"}',
            meanings: [],
            __guid: '321e62cd-185f-4cd8-bf23-9e3f581c512e',
            sourceUpdatedAt: 0,
            __createdBy: 'service-account-argo-client',
            __modificationTimestamp: 1630412944051,
            name: 'Atlan',
            tenantId: 'default',
            connectionName: 'wlmrla4nr',
            assetStatusUpdatedAt: 0,
            __timestamp: 1630412943800,
        },
        guid: '321e62cd-185f-4cd8-bf23-9e3f581c512e',
        status: 'ACTIVE',
        displayText: 'Atlan',
        classificationNames: [],
        classifications: [],
        meaningNames: [],
        meanings: [],
        isIncomplete: false,
        labels: [],
    },
    {
        typeName: 'TableauSite',
        attributes: {
            popularityScore: 0,
            'Airflow.Last ETL Status': '123',
            connectionQualifiedName: 'default/tableau/ym0bmq7ng',
            integrationName: 'tableau',
            __modifiedBy: 'service-account-argo-client',
            qualifiedName:
                'default/tableau/ym0bmq7ng/09638d94-ad32-48b7-89a1-361bcb4698b2',
            connectionLastSyncedAt: 1629616650805,
            __state: 'ACTIVE',
            __customAttributes:
                '{"uri":"sites/5163","id":"969986f1-4146-b08c-ee98-c795a10bc4f0"}',
            meanings: [],
            __guid: 'c67b6879-b502-4883-bc28-06f0e76b5b71',
            sourceUpdatedAt: 0,
            'BM for facet 2.Recommended Metrics': true,
            'BM for facet 2.Order Number': 321,
            __createdBy: 'service-account-argo-client',
            __modificationTimestamp: 1629616715321,
            name: 'Atlan',
            tenantId: 'default',
            connectionName: 'ym0bmq7ng',
            assetStatusUpdatedAt: 0,
            __timestamp: 1629616715321,
            'Airflow.Enum type': 'DRAFT',
        },
        guid: 'c67b6879-b502-4883-bc28-06f0e76b5b71',
        status: 'ACTIVE',
        displayText: 'Atlan',
        classificationNames: [],
        classifications: [],
        meaningNames: [],
        meanings: [],
        isIncomplete: false,
        labels: [],
    },
    {
        typeName: 'TableauSite',
        attributes: {
            popularityScore: 0,
            __classificationNames: '|Demo 3|Demo 2|Demo 1|Demo 4|',
            connectionQualifiedName: 'default/tableau/yecte77g',
            integrationName: 'tableau',
            __modifiedBy: 'nitya',
            qualifiedName:
                'default/tableau/yecte77g/09638d94-ad32-48b7-89a1-361bcb4698b2',
            connectionLastSyncedAt: 1629445095317,
            __state: 'ACTIVE',
            __customAttributes:
                '{"uri":"sites/5163","id":"969986f1-4146-b08c-ee98-c795a10bc4f0"}',
            meanings: [],
            __guid: 'de07cb00-752b-4df4-a738-5c40fd168375',
            sourceUpdatedAt: 0,
            __createdBy: 'service-account-argo-client',
            __modificationTimestamp: 1630497230761,
            name: 'Atlan',
            tenantId: 'default',
            connectionName: 'yecte77g',
            __classificationsText: 'Demo 2 Demo 1 Demo 3 Demo 4 ',
            assetStatusUpdatedAt: 0,
            __timestamp: 1629444789169,
        },
        guid: 'de07cb00-752b-4df4-a738-5c40fd168375',
        status: 'ACTIVE',
        displayText: 'Atlan',
        classificationNames: ['Demo 2', 'Demo 1', 'Demo 3', 'Demo 4'],
        classifications: [
            {
                typeName: 'Demo 2',
                entityGuid: 'de07cb00-752b-4df4-a738-5c40fd168375',
                entityStatus: 'ACTIVE',
                propagate: false,
                validityPeriods: [],
                removePropagationsOnEntityDelete: true,
            },
            {
                typeName: 'Demo 1',
                attributes: {
                    test: null,
                },
                entityGuid: 'de07cb00-752b-4df4-a738-5c40fd168375',
                entityStatus: 'ACTIVE',
                propagate: false,
                validityPeriods: [],
                removePropagationsOnEntityDelete: true,
            },
            {
                typeName: 'Demo 3',
                entityGuid: 'de07cb00-752b-4df4-a738-5c40fd168375',
                entityStatus: 'ACTIVE',
                propagate: false,
                validityPeriods: [],
                removePropagationsOnEntityDelete: true,
            },
            {
                typeName: 'Demo 4',
                entityGuid: 'de07cb00-752b-4df4-a738-5c40fd168375',
                entityStatus: 'ACTIVE',
                propagate: false,
                validityPeriods: [],
                removePropagationsOnEntityDelete: true,
            },
        ],
        meaningNames: [],
        meanings: [],
        isIncomplete: false,
        labels: [],
    },
    {
        typeName: 'TableauProject',
        attributes: {
            popularityScore: 0,
            __modifiedBy: 'service-account-argo-client',
            qualifiedName:
                'default/tableau/at7cla77r/09638d94-ad32-48b7-89a1-361bcb4698b2/ffeabea6-0ed0-438c-886a-e02e14698b5e',
            connectionLastSyncedAt: 0,
            __state: 'ACTIVE',
            isTopLevelProject: true,
            description: '',
            meanings: [],
            __guid: '7b4121ec-ae70-474c-b729-e8c4aa28e7dc',
            sourceUpdatedAt: 0,
            __createdBy: 'service-account-argo-client',
            __modificationTimestamp: 1629441102505,
            name: 'Personal Care',
            tenantId: 'default',
            assetStatusUpdatedAt: 0,
            __timestamp: 1629441102505,
        },
        guid: '7b4121ec-ae70-474c-b729-e8c4aa28e7dc',
        status: 'ACTIVE',
        displayText: 'Personal Care',
        classificationNames: [],
        classifications: [],
        meaningNames: [],
        meanings: [],
        isIncomplete: false,
        labels: [],
    },
    {
        typeName: 'TableauProject',
        attributes: {
            popularityScore: 0,
            __modifiedBy: 'service-account-argo-client',
            qualifiedName:
                'default/tableau/at7cla77r/09638d94-ad32-48b7-89a1-361bcb4698b2/7bafe65c-ed6d-41cc-b6a1-6e7b9153d4dc',
            connectionLastSyncedAt: 0,
            __state: 'ACTIVE',
            isTopLevelProject: true,
            description: '',
            meanings: [],
            __guid: '36fb0de2-a934-4c4a-a450-9a0197eaf1ee',
            sourceUpdatedAt: 0,
            __createdBy: 'service-account-argo-client',
            __modificationTimestamp: 1629441103537,
            name: 'Demo',
            tenantId: 'default',
            assetStatusUpdatedAt: 0,
            __timestamp: 1629441103191,
        },
        guid: '36fb0de2-a934-4c4a-a450-9a0197eaf1ee',
        status: 'ACTIVE',
        displayText: 'Demo',
        classificationNames: [],
        classifications: [],
        meaningNames: [],
        meanings: [],
        isIncomplete: false,
        labels: [],
    },
    {
        typeName: 'TableauProject',
        attributes: {
            popularityScore: 0,
            __modifiedBy: 'service-account-argo-client',
            qualifiedName:
                'default/tableau/at7cla77r/09638d94-ad32-48b7-89a1-361bcb4698b2/11599f90-f999-411f-a6a5-32e8b278c32a',
            connectionLastSyncedAt: 0,
            __state: 'ACTIVE',
            isTopLevelProject: true,
            description: '',
            meanings: [],
            __guid: 'cfe5bb11-4ef4-4ce4-8beb-e7c77d10a543',
            sourceUpdatedAt: 0,
            __createdBy: 'service-account-argo-client',
            __modificationTimestamp: 1629441104089,
            name: 'Reporting',
            tenantId: 'default',
            assetStatusUpdatedAt: 0,
            __timestamp: 1629441104089,
        },
        guid: 'cfe5bb11-4ef4-4ce4-8beb-e7c77d10a543',
        status: 'ACTIVE',
        displayText: 'Reporting',
        classificationNames: [],
        classifications: [],
        meaningNames: [],
        meanings: [],
        isIncomplete: false,
        labels: [],
    },
    {
        typeName: 'TableauProject',
        attributes: {
            popularityScore: 0,
            __modifiedBy: 'service-account-argo-client',
            qualifiedName:
                'default/tableau/at7cla77r/09638d94-ad32-48b7-89a1-361bcb4698b2/94d64c29-c469-478f-b7b4-e8e6ef9bc359',
            connectionLastSyncedAt: 0,
            __state: 'ACTIVE',
            isTopLevelProject: false,
            description: '',
            meanings: [],
            __guid: '368de902-161d-473e-b37c-c178ec1e9ca9',
            sourceUpdatedAt: 0,
            __createdBy: 'service-account-argo-client',
            __modificationTimestamp: 1629441104425,
            name: 'Test_Redshift',
            tenantId: 'default',
            assetStatusUpdatedAt: 0,
            __timestamp: 1629441104425,
        },
        guid: '368de902-161d-473e-b37c-c178ec1e9ca9',
        status: 'ACTIVE',
        displayText: 'Test_Redshift',
        classificationNames: [],
        classifications: [],
        meaningNames: [],
        meanings: [],
        isIncomplete: false,
        labels: [],
    },
    {
        typeName: 'TableauProject',
        attributes: {
            popularityScore: 0,
            __modifiedBy: 'service-account-argo-client',
            qualifiedName:
                'default/tableau/at7cla77r/09638d94-ad32-48b7-89a1-361bcb4698b2/a4483d6b-5316-4f64-ab44-1fec497d19e9',
            connectionLastSyncedAt: 0,
            __state: 'ACTIVE',
            isTopLevelProject: false,
            description: '',
            meanings: [],
            __guid: '2f23cc14-e95a-437e-9307-1c8c225c5f7d',
            sourceUpdatedAt: 0,
            __createdBy: 'service-account-argo-client',
            __modificationTimestamp: 1629441105371,
            name: 'Something2',
            tenantId: 'default',
            assetStatusUpdatedAt: 0,
            __timestamp: 1629441105371,
        },
        guid: '2f23cc14-e95a-437e-9307-1c8c225c5f7d',
        status: 'ACTIVE',
        displayText: 'Something2',
        classificationNames: [],
        classifications: [],
        meaningNames: [],
        meanings: [],
        isIncomplete: false,
        labels: [],
    },
    {
        typeName: 'TableauProject',
        attributes: {
            popularityScore: 0,
            __modifiedBy: 'service-account-argo-client',
            qualifiedName:
                'default/tableau/at7cla77r/09638d94-ad32-48b7-89a1-361bcb4698b2/8290354c-cd03-435b-a291-8d56323d7cc0',
            connectionLastSyncedAt: 0,
            __state: 'ACTIVE',
            isTopLevelProject: false,
            description: '',
            meanings: [],
            __guid: '293a158d-27c6-4392-aaaa-aaedee0716c3',
            sourceUpdatedAt: 0,
            __createdBy: 'service-account-argo-client',
            __modificationTimestamp: 1629441105371,
            name: 'Something',
            tenantId: 'default',
            assetStatusUpdatedAt: 0,
            __timestamp: 1629441104941,
        },
        guid: '293a158d-27c6-4392-aaaa-aaedee0716c3',
        status: 'ACTIVE',
        displayText: 'Something',
        classificationNames: [],
        classifications: [],
        meaningNames: [],
        meanings: [],
        isIncomplete: false,
        labels: [],
    },
]
export default entities
