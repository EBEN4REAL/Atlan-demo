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
      id: 'Datasets',
      label: 'Datasets',
      children: [
        {
          id: 'Table',
          label: 'Table',
        },
        {
          id: 'Views',
          label: 'Views',
        },
        {
          id: 'Partition',
          label: 'Partition',
        },
        {
          id: 'MaterialisedView',
          label: 'Materialised View',
        },
        {
          id: 'TableauDatasource',
          label: 'Tableau Datasource',
        },
      ],
    },

    {
      id: 'Fields',
      label: 'Fields',
    },
    {
      id: 'Visualization',
      label: 'Visualization',
    },
    {
      id: 'BusinessTerms',
      label: 'Business Terms',
    },
    {
      id: 'Queries',
      label: 'Queries',
    },
  ]

export default AssetTypeList