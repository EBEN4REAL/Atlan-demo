import { ref, Ref, watch } from 'vue'
import axios from 'axios'
import useSearchList from './useSearchList'
import { assetInterface } from '~/types/assets/asset.interface'

export default function useAssetListing(
    typeName?: string,
    initialBody?: any,
    immediate: boolean = true,
    cacheSuffx?: string | ''
) {
    const cancelTokenSource = axios.CancelToken.source()

    const { isLoading, query, replaceBody, body, list } = useSearchList(
        typeName || 'Catalog',
        [],
        initialBody,
        '',
        immediate,
        cancelTokenSource
    )

    function mutateAssetInList(updatedAsset: assetInterface) {
        const idx = list.value.findIndex(
            (ast) => ast.guid === updatedAsset.guid
        )
        if (idx > -1) list.value[idx] = updatedAsset
    }

    return {
        list,
        isLoading,
        query,
        replaceBody,
        body,
        mutateAssetInList,
    }
}
