import { assetTypeList } from '~/constant/assetType'
import { useConnectionStore } from '~/store/connection/index'

const store = useConnectionStore()

const sourceConnected = (typeName) =>
    store.activeConnectionSourceList.some(
        (s) => s.id.toLowerCase() === typeName.toLowerCase()
    )

const getChildren = (arr) => {
    const children: any = []

    arr.forEach((c) => {
        if (c?.source) {
            const sourceIndex = children.findIndex((s) => s.id === c.source)
            if (sourceIndex > -1)
                children[sourceIndex].children = [
                    ...children[sourceIndex].children,
                    {
                        id: c.id,
                        label: c.fullLabel ?? c.label,
                    },
                ]
            else {
                children.push({
                    isSource: true,
                    id: c.source,
                    label: c.source,
                    children: [
                        {
                            id: c.id,
                            label: c.fullLabel ?? c.label,
                        },
                    ],
                })
            }
        } else {
            children.push({
                id: c.id,
                label: c.fullLabel ?? c.label,
            })
        }
    })
    return children
}

export const applicableTypeList = () => {
    const connectedList = assetTypeList.filter((t) =>
        t.source ? sourceConnected(t.source) : true
    )

    const customMetadataAssetCategories: {
        id: string
        label: string
        children: {
            id: string
            label: string
        }[]
    }[] = [
        ...(connectedList.some((t) => t.categoryType === 'SQL')
            ? [
                  {
                      id: 'SQL',
                      label: 'SQL',
                      children: [
                          ...connectedList
                              .filter((t) => t.categoryType === 'SQL')
                              .map((c) => ({
                                  id: c.id,
                                  label: c.fullLabel ?? c.label,
                              })),
                      ],
                  },
              ]
            : []),
        ...(connectedList.some((t) => t.categoryType === 'BI')
            ? [
                  {
                      id: 'BI',
                      label: 'BI',
                      children: getChildren(
                          connectedList.filter((t) => t.categoryType === 'BI')
                      ),
                  },
              ]
            : []),
        ...(connectedList.some((t) => t.categoryType === 'SaaS')
            ? [
                  {
                      id: 'SaaS',
                      label: 'SaaS',
                      children: getChildren(
                          connectedList.filter((t) => t.categoryType === 'SaaS')
                      ),
                  },
              ]
            : []),
        ...(connectedList.some((t) => t.categoryType === 'ObjectStore')
            ? [
                  {
                      id: 'ObjectStore',
                      label: 'Object',
                      children: getChildren(
                          connectedList.filter(
                              (t) => t.categoryType === 'ObjectStore'
                          )
                      ),
                  },
              ]
            : []),
        ...(connectedList.some((t) => t.categoryType === 'Insights')
            ? [
                  {
                      id: 'Insights',
                      label: 'Insights',
                      children: [
                          ...connectedList
                              .filter((t) => t.categoryType === 'Insights')
                              .map((c) => ({
                                  id: c.id,
                                  label: c.fullLabel ?? c.label,
                              })),
                      ],
                  },
              ]
            : []),
        ...(connectedList.some((t) => t.categoryType === 'Lineage')
            ? [
                  {
                      id: 'Lineage',
                      label: 'Lineage',
                      children: [
                          ...connectedList
                              .filter((t) => t.categoryType === 'Lineage')
                              .map((c) => ({
                                  id: c.id,
                                  label: c.fullLabel ?? c.label,
                              })),
                      ],
                  },
              ]
            : []),
        ...(connectedList.some((t) => t.categoryType === 'BusinessTerms')
            ? [
                  {
                      id: 'BusinessTerms',
                      label: 'BusinessTerms',
                      children: [
                          ...connectedList
                              .filter((t) => t.categoryType === 'BusinessTerms')
                              .map((c) => ({
                                  id: c.id,
                                  label: c.fullLabel ?? c.label,
                              })),
                      ],
                  },
              ]
            : []),
    ]

    const applicableEntityTypesOptions: any = [
        ...customMetadataAssetCategories.map((t) => ({
            title: t.label,
            value: t.id,
            key: t.id,
            children: t.children?.map((a) => ({
                ...a,
                title: a.label,
                value: a.id,
                key: a.id,
                category: t.id,
                children: a?.children?.map((b) => ({
                    title: b.label,
                    value: b.id,
                    key: b.id,
                    source: a.id,
                })),
            })),
        })),
    ]

    return applicableEntityTypesOptions
}
