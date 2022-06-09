export const assetParentChildMapping = [
    {
        parent: "Database",
        children: [
            {
                name: 'Table',
                displayText: 'Table'
            },
            {
                name: 'View',
                displayText: 'View'
            },
            {
                name: 'MaterialisedView',
                displayText: 'Materialised View'
            },
            {
                name: 'Column',
                displayText: 'Column'
            },
            {
                name: 'TablePartition',
                displayText: 'TabTable Partition'
            },
            {
                name: 'Schema',
                displayText: 'Schema'
            }
        ]
    },
    {
        parent: "Schema",
        children: [
            {
                name: 'Table',
                displayText: 'Table'
            },
            {
                name: 'View',
                displayText: 'View'
            },
            {
                name: 'MaterialisedView',
                displayText: 'Materialised View'
            },
            {
                name: 'Column',
                displayText: 'Column'
            },
            {
                name: 'TablePartition',
                displayText: 'Table Partition'
            }
        ]
    },
    {
        parent: "Table",
        children: [
            {
                name: 'TablePartition',
                displayText: 'Table Partition'
            },
            {
                name: 'Column',
                displayText: 'Column'
            }
        ]
    },
    {
        parent: "TablePartition",
        children: [
            {
                name: 'Column',
                displayText: 'Column'
            }
        ]
    },
    {
        parent: "View",
        children: [
            {
                name: 'Column',
                displayText: 'Column'
            }
        ]
    },
    {
        parent: "MaterialisedView",
        children: [
            {
                name: 'Column',
                displayText: 'Column'
            }
        ]
    },
    {
        parent: "SalesforceOrganization",
        children: [
            {
                name: 'SalesforceReport',
                displayText: 'Salesforce Report'
            },
            {
                name: 'SalesforceDashboard',
                displayText: 'Salesforce Dashboard'
            },
            {
                name: 'SalesforceObject',
                displayText: 'Salesforce Object'
            },
            {
                name: 'SalesforceField',
                displayText: 'Salesforce Field'
            }
        ]
    },
    {
        parent: "SalesforceObject",
        children: [
            {
                name: 'SalesforceField',
                displayText: 'Salesforce Field'
            }
        ]
    },
    {
        parent: "PowerBIDataset",
        children: [
            {
                name: 'PowerBITile',
                displayText: 'PowerBI Tile'
            },
            {
                name: 'PowerBIDataflow',
                displayText: 'PowerBI Dataflow'
            },
            {
                name: 'PowerBIReport',
                displayText: 'PowerBI Report'
            },
            {
                name: 'PowerBITable',
                displayText: 'PowerBI Table'
        },
            {
                name: 'PowerBIMeasure',
                displayText: 'PowerBI Measure'
            },
            {
                name: 'PowerBIColumn',
                displayText: 'PowerBI Column'
            },
        ]
    },
    {
        parent: "PowerBITable",
        children: [
            {
                name: 'PowerBIColumn',
                displayText: 'PowerBI Column'
            },
            {
                name: 'PowerBIMeasure',
                displayText: 'PowerBI Measure'
            }
        ]
    },
    {
        parent: "Asset",
        children: [
            {
                name: 'Readme',
                displayText: 'Readme'
            },
            {
                name: 'Link',
                displayText: 'Link'
            }
        ]
    },
    {
        parent: "Namespace",
        children: [
            {
                name: 'Query',
                displayText: 'Query'
            },
            {
                name: 'Folder',
                displayText: 'Folder'
            }
        ]
    },
    {
        parent: "Catalog",
        children: [
            {
                name: 'Process',
                displayText: 'Process'
            },
            {
                name: 'ColumnProcess',
                displayText: 'Column Process'
            }
        ]
    },
    {
        parent: "Process",
        children: [
            {
                name: 'ColumnProcess',
                displayText: 'Column Process'
            }
        ]
    },
    {
        parent: "AtlasGlossaryTerm",
        children: [
            {
                name: 'Referenceable',
                displayText: 'Referenceable'
            }
        ]
    },
]