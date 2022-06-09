export const assetParentChildHierachy = [
    {
        parent: "Database",
        children: [
            'Table',
            "View",
            "MaterialisedView",
            "Column",
            "TablePartition",
            "Schema"
        ]
    },
    {
        parent: "Schema",
        children: [
            "Table",
            "View",
            "MaterialisedView",
            "Column",
            "TablePartition",

        ]
    },
    {
        parent: "Table",
        children: [
            "TablePartition",
            "Column",
        ]
    },
    {
        parent: "TablePartition",
        children: [
            "Column",
        ]
    },
    {
        parent: "SalesforceOrganization",
        children: [
            "SalesforceReport",
            "SalesforceDashboard",
            "SalesforceObject",
            "SalesforceField"
        ]
    },
    {
        parent: "SalesforceObject",
        children: [
            "SalesforceField"
        ]
    },
    {
        parent: "PowerBIDataset",
        children: [
            'PowerBITile',
            "PowerBIDataflow",
            "PowerBIReport",
        ]
    },
    {
        parent: "Asset",
        children: [
            'Readme',
            "Link",
        ]
    },
    {
        parent: "Namespace",
        children: [
            'Query',
            "Folder",
        ]
    },
    {
        parent: "Catalog",
        children: [
            'Process',
            "ColumnProcess",
        ]
    },
    {
        parent: "Process",
        children: [
            "ColumnProcess",
        ]
    },
    {
        parent: "AtlasGlossaryTerm",
        children: [
            'Referenceable',
        ]
    },
]