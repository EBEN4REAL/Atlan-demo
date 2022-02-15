import { assetTypeList } from '~/constant/assetType'

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
        id: 'SQL',
        label: 'SQL',
        children: [
            ...assetTypeList
                .filter((t) => t.categoryType === 'SQL')
                .map((c) => ({
                    id: c.id,
                    label: c.label,
                })),
        ],
    },
    {
        id: 'BI',
        label: 'BI',
        children: [
            ...assetTypeList
                .filter((t) => t.categoryType === 'BI')
                .map((c) => ({
                    id: c.id,
                    label: c.label,
                })),
        ],
    },
    {
        id: 'SaaS',
        label: 'SaaS',
        children: [
            ...assetTypeList
                .filter((t) => t.categoryType === 'SaaS')
                .map((c) => ({
                    id: c.id,
                    label: c.label,
                })),
        ],
    },
    {
        id: 'Insights',
        label: 'Insights',
        children: [
            ...assetTypeList
                .filter((t) => t.categoryType === 'Insights')
                .map((c) => ({
                    id: c.id,
                    label: c.label,
                })),
        ],
    },
    {
        id: 'Lineage',
        label: 'Lineage',
        children: [
            ...assetTypeList
                .filter((t) => t.categoryType === 'Lineage')
                .map((c) => ({
                    id: c.id,
                    label: c.label,
                })),
        ],
    },
    {
        id: 'BusinessTerms',
        label: 'Business Terms',
        children: [
            ...assetTypeList
                .filter((t) => t.categoryType === 'BusinessTerms')
                .map((c) => ({
                    id: c.id,
                    label: c.label,
                })),
        ],
    },
]

export default AssetTypeList
