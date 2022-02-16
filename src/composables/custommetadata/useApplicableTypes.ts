import { assetTypeList } from '~/constant/assetType'
import { useConnectionStore } from '~/store/connection/index'

const store = useConnectionStore()

const sourceConnected = (typeName) => store.activeConnectionSourceList.some(s => s.id.toLowerCase() === typeName.toLowerCase())

export const applicableTypeList = () => {

    const connectedList = assetTypeList.filter(t => t.source ? sourceConnected(t.source) : true)

    const customMetadataAssetCategories: {
        id: string
        label: string,
        children: {
            id: string
            label: string,
        }[]
    }[] = [
            {
                id: 'SQL',
                label: 'SQL',
                children: [
                    ...connectedList.filter(t => t.categoryType === 'SQL').map(c => ({
                        id: c.id, label: c.fullLabel ?? c.label
                    }))
                ],
            },
            {
                id: 'BI',
                label: 'BI',
                children: [
                    ...connectedList.filter(t => t.categoryType === 'BI').map(c => ({
                        id: c.id, label: c.fullLabel ?? c.label
                    }))
                ],
            },
            {
                id: 'SaaS',
                label: 'SaaS',
                children: [
                    ...connectedList.filter(t => t.categoryType === 'SaaS').map(c => ({
                        id: c.id, label: c.fullLabel ?? c.label
                    }))
                ],
            },
            {
                id: 'Insights',
                label: 'Insights',
                children: [
                    ...connectedList.filter(t => t.categoryType === 'Insights').map(c => ({
                        id: c.id, label: c.fullLabel ?? c.label
                    }))
                ],
            },
            {
                id: 'Lineage',
                label: 'Lineage',
                children: [
                    ...connectedList.filter(t => t.categoryType === 'Lineage').map(c => ({
                        id: c.id, label: c.fullLabel ?? c.label
                    }))
                ],
            },
            {
                id: 'BusinessTerms',
                label: 'Business Terms',
                children: [
                    ...connectedList.filter(t => t.categoryType === 'BusinessTerms').map(c => ({
                        id: c.id, label: c.fullLabel ?? c.label
                    }))
                ],
            }
        ]



    const applicableEntityTypesOptions: any = [
        ...customMetadataAssetCategories.map((t) => ({
            title: t.label,
            value: t.id,
            key: t.id,
            children: t.children?.map((a) => ({
                title: a.label,
                value: a.id,
                key: a.id,
            })),
        })),
    ]

    return applicableEntityTypesOptions

}