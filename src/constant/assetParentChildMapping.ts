export const assetParentChildMapping = [
    {
        parent: {
            name: "Database",
            displayText: "Database"
        },
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
        parent: {
            name: "Schema",
            displayText: "Schema"
        },
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
        parent: {
            name: "Table",
            displayText: "Table"
        },
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
        parent: {
            name: "TablePartition",
            displayText: "Table Partition"
        },
        children: [
            {
                name: 'Column',
                displayText: 'Column'
            }
        ]
    },
    {
        parent: {
            name: "View",
            displayText: "View"
        },
        children: [
            {
                name: 'Column',
                displayText: 'Column'
            }
        ]
    },
    {
        parent: {
            name: "MaterialisedView",
            displayText: "Materialised View"
        },
        children: [
            {
                name: 'Column',
                displayText: 'Column'
            }
        ]
    },
    {
        parent: {
            name: "SalesforceOrganization",
            displayText: "Salesforce Organization"
        },
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
        parent: {
            name: "SalesforceObject",
            displayText: "Salesforce Object"
        },
        children: [
            {
                name: 'SalesforceField',
                displayText: 'Salesforce Field'
            }
        ]
    },
    {
        parent: {
            name: "PowerBIDataset",
            displayText: "PowerBI Dataset"
        },
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
        parent: {
            name: "PowerBITable",
            displayText: "PowerBI Table"
        },
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
        parent: {
            name: "Asset",
            displayText: "Asset"
        },
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
        parent: {
            name: "Namespace",
            displayText: "Namespace"
        },
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
        parent: {
            name: "Catalog",
            displayText: "Catalog"
        },
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
        parent: {
            name: "Process",
            displayText: "Process"
        },
        children: [
            {
                name: 'ColumnProcess',
                displayText: 'Column Process'
            }
        ]
    },
    {
        parent: {
            name: "AtlasGlossaryTerm",
            displayText: "Atlas Glossary Term"
        },
        children: [
            {
                name: 'Referenceable',
                displayText: 'Referenceable'
            }
        ]
    },
]