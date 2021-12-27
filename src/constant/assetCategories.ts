const AssetTypeList: {
  id: string
  label: string
  nameAttribute?: string
  qualifiedNameAttribute?: string
  parents?: string[]
  children?: object[]
  isDiscoverable?: boolean
  orderWeight?: number
  count?: number
}[] = [
    {
      id: 'Dataset',
      label: 'Dataset',
      children: [
        { id: "Database", label: "Database" },
        { id: "MaterialisedView", label: "Materialised View" },
        { id: "PowerBIDataset", label: "PowerBI Dataset" },
        { id: "PowerBIDatasource", label: "PowerBI Datasource" },
        { id: "Schema", label: "Schema" },
        { id: "Table", label: "Table" },
        { id: "TablePartition", label: "Table Partition" },
        { id: "TableauDatasource", label: "Tableau Datasource" },
        { id: "View", label: "View" }
      ],
    },

    {
      id: 'Fields',
      label: 'Fields',
      children: [
        { id: "Column", label: "Column" },
        { id: "TableauCalculatedField", label: "Tableau Calculated Field" },
        { id: "TableauDatasourceField", label: "Tableau Datasource Field" }
      ]
    },
    {
      id: 'Visualisation',
      label: 'Visualisation',
      children: [
        { id: "PowerBIDashboard", label: "PowerBI Dashboard" },
        { id: "PowerBIDataflow", label: "PowerBI Dataflow" },
        { id: "PowerBIPage", label: "PowerBI Page" },
        { id: "PowerBIReport", label: "PowerBI Report" },
        { id: "PowerBIWorkspace", label: "PowerBI Workspace" },
        { id: "TableauDashboard", label: "Tableau Dashboard" },
        { id: "TableauFlow", label: "Tableau Flow" },
        { id: "TableauProject", label: "Tableau Project" },
        { id: "TableauSite", label: "Tableau Site" },
        { id: "TableauWorkbook", label: "Tableau Workbook" },
        { id: "TableauWorksheet", label: "Tableau Worksheet" }]
    },
    {
      id: 'Insights',
      label: 'Insights',
      children: [
        { id: "Query", label: "Query" },
        { id: "QueryFolder", label: "Query Folder" },
        { id: "TableauMetric", label: "Tableau Metric" }
      ]
    },
    {
      id: 'BusinessTerms',
      label: 'Business Terms',
      children: [
        { id: "AtlasGlossary", label: "Glossary" },
        { id: "AtlasGlossaryCategory", label: "Category" },
        { id: "AtlasGlossaryTerm", label: "Term" }
      ]
    },
  ]

export default AssetTypeList