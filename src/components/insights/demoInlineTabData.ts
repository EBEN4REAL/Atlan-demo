import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
export const inlineTabsDemoData: activeInlineTabInterface[] = [
    {
        key: '1',
        label: 'ABCDE',
        isSaved: true,
        queryId: 'abcd-01-01',
        explorer: {},
        playground: {
            editorTitle: 'ABCDE EDITOR',
            resultTitle: 'ABCDE Result',
        },
        favico: 'https://atlan.com/favicon.ico',
        assetSidebar: {
            isVisible: false,
            assetInfo: {},
            title: '',
            id: '',
        },
    },
    {
        key: '2',
        label: 'ADBE',
        isSaved: false,
        queryId: undefined,
        explorer: {},
        playground: {
            editorTitle: 'ADBE EDITOR',
            resultTitle: 'ADBE Result',
        },
        favico: 'https://atlan.com/favicon.ico',
        assetSidebar: {
            isVisible: false,
            assetInfo: {},
            title: '',
            id: '',
        },
    },
    {
        key: '3',
        label: 'BCDE',
        isSaved: false,
        queryId: undefined,
        explorer: {},
        playground: {
            editorTitle: 'BCDE EDITOR',
            resultTitle: 'BCDE Result',
        },
        favico: 'https://atlan.com/favicon.ico',
        assetSidebar: {
            isVisible: false,
            assetInfo: {},
            title: '',
            id: '',
        },
    },
]
