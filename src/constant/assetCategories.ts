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
        { id: "MaterialisedView", label: "MaterialisedView" },
        { id: "PowerBIDataset", label: "PowerBIDataset" },
        { id: "PowerBIDatasource", label: "PowerBIDataset" },
        { id: "Schema", label: "Schema" },
        { id: "Table", label: "Table" },
        { id: "TablePartition", label: "TablePartition" },
        { id: "TableauDatasource", label: "TableauDatasource" },
        { id: "View", label: "View" }
      ],
    },

    {
      id: 'Fields',
      label: 'Fields',
      children: [
        { id: "Columns", label: "Columns" },
        { id: "TableauCalculatedField", label: "TableauCalculatedField" },
        { id: "TableauDatasourceField", label: "TableauDatasourceField" }
      ]
    },
    {
      id: 'Visualisation',
      label: 'Visualisation',
      children: [
        { id: "PowerBIDashboard", label: "PowerBIDashboard" },
        { id: "PowerBIDataflow", label: "PowerBIDataflow" },
        { id: "PowerBIPage", label: "PowerBIPage" },
        { id: "PowerBIReport", label: "PowerBIReport" },
        { id: "PowerBIWorkspace", label: "PowerBIWorkspace" },
        { id: "TableauDashboard", label: "TableauDashboard" },
        { id: "TableauFlow", label: "TableauFlow" },
        { id: "TableauProject", label: "TableauProject" },
        { id: "TableauSite", label: "TableauSite" },
        { id: "TableauWorkbook", label: "TableauWorkbook" },
        { id: "TableauWorksheet", label: "TableauWorksheet" }]
    },
    {
      id: 'Insights',
      label: 'Insights',
      children: [
        { id: "Query", label: "Query" },
        { id: "QueryFolder", label: "QueryFolder" },
        { id: "TableauMetric", label: "TableauMetric" }
      ]
    },
    {
      id: 'BusinessTerms',
      label: 'Business Terms',
      children: [
        { id: "AtlasGlossary", label: "AtlasGlossary" },
        { id: "AtlasGlossaryCategory", label: "AtlasGlossaryCategory" },
        { id: "AtlasGlossaryTerm", label: "AtlasGlossaryTerm" }
      ]
    },
  ]

export default AssetTypeList