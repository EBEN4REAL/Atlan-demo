import { inject, watch, ref, Ref, onMounted, computed, provide } from 'vue'
import { whenever } from '@vueuse/core'
import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import updateAsset from '~/composables/discovery/updateAsset'
import useAssetInfo from '~/composables/discovery/useAssetInfo'

// composables
import useUpdateGtcEntity from '~/composables/glossary/useUpdateGtcEntity'
import useLoadGlossaryTreeData from '~/composables/glossary/useLoadGlossaryTreeData'
import useGtcEntity from '~/composables/glossary/useGtcEntity'
import updateAssetAttributes from '~/composables/discovery/updateAssetAttributes'

// types
import { Glossary, Category, Term } from '~/types/glossary/glossary.interface'
import { IndexSearchResponse } from '~/services/meta/search/index'

// store
import useGlossaryStore from '~/store/glossary'
import store from '~/utils/storage'
import useGlossaryData from '../glossary/useGlossaryData'
import {
    AssetAttributes,
    InternalAttributes,
    GlossaryAttributes,
} from '~/constant/projection'
import { useBody } from '../discovery/useBody'
import useIndexSearch from '../discovery/useIndexSearch'
import { assetInterface } from '~/types/assets/asset.interface'

interface UseTreeParams {
    emit?: any
    parentGlossaryGuid?: Ref<string | undefined>
    parentGlossaryQualifiedName?: Ref<string>
    optimisticUpdate?: boolean
    filterMode?: boolean
    cacheKey?: string
    isAccordion?: boolean
    nodesKey?: 'qualifiedName' | 'guid'
    checkable: Boolean
    checkedGuids?: string[]
    localCheckedNodes?: Ref<Array<any>>
}

const useGlossaryTree = ({
    emit,
    optimisticUpdate = true,
    filterMode = false,
    checkable = false,
    cacheKey,
    isAccordion,
    parentGlossaryGuid,
    parentGlossaryQualifiedName,
    nodesKey = 'guid',
    checkedGuids = [],
    localCheckedNodes,
}: UseTreeParams) => {
    const limit = ref(100)
    const offset = ref(0)
    const queryText = ref('')
    const facets = ref({
        typeNames: ['AtlasGlossaryTerm', 'AtlasGlossaryCategory'],
        glossary: '',
        isRootTerm: true,
        isRootCategory: true,
        parentCategory: '',
    })
    const aggregations = ref([])
    const postFacets = ref({})
    const dependentKey = ref(null)
    const attributes = ref([
        ...InternalAttributes,
        ...AssetAttributes,
        ...GlossaryAttributes,
    ])
    const relationAttributes = ref(['name', 'categories'])
    const preference = ref({
        sort: 'name.keyword-asc',
    })
    const loadedKeys = ref<string[]>([])
    const selectedKeys = ref<string[]>([])
    const checkedKeys = ref<string[]>([])
    const expandedKeys = ref<string[]>([])
    const treeData = ref<TreeDataItem[]>([])
    const nodeToParentKeyMap: Record<string, 'root' | string | string[]> = {}
    const defaultBody = ref({})
    const generateBody = () => {
        const dsl = useBody(
            queryText?.value,
            offset?.value,
            limit?.value,
            facets?.value,
            postFacets?.value,
            aggregations?.value,
            preference?.value
        )
        defaultBody.value = {
            dsl,
            attributes: attributes?.value,
            relationAttributes: relationAttributes?.value,
        }
    }

    const { data, mutate, isLoading, error, isReady } = useIndexSearch<
        Category | Term
    >(defaultBody, dependentKey, false, false, 1)

    const onLoadData = async (treeNode: any) => {
        treeNode.dataRef.isLoading = true
        treeNode.dataRef.isError = null
        offset.value = 0
        if (treeNode.typeName === 'AtlasGlossary') {
            facets.value = {
                typeNames: ['AtlasGlossaryTerm', 'AtlasGlossaryCategory'],
                glossary: treeNode.attributes?.qualifiedName,
                isRootTerm: true,
                isRootCategory: true,
            }
            generateBody()
            try {
                await mutate()

                if (error.value) {
                    loadedKeys.value.push(treeNode.dataRef.key)
                    treeNode.dataRef.isLoading = false
                    treeNode.dataRef.isError = error
                } else {
                    if (!treeNode.dataRef.children) {
                        treeNode.dataRef.children = []
                    }
                    let map = data.value?.entities?.map((i) => ({
                        ...i,
                        id: `${treeNode.attributes?.qualifiedName}_${i.attributes?.qualifiedName}`,
                        key: `${treeNode.attributes?.qualifiedName}_${i.attributes?.qualifiedName}`,
                        isLeaf: i.typeName === 'AtlasGlossaryTerm',
                        checkable:
                            i.typeName === 'AtlasGlossaryTerm'
                                ? checkable
                                : false,
                    }))
                    if (data.value && map) {
                        map?.forEach((el) => {
                            if (el.typeName === 'AtlasGlossaryTerm') {
                                const currentParentList =
                                    nodeToParentKeyMap[el.guid]
                                if (
                                    currentParentList &&
                                    currentParentList.length &&
                                    typeof currentParentList !== 'string'
                                ) {
                                    currentParentList.push(
                                        treeNode.dataRef.guid
                                    )
                                    nodeToParentKeyMap[el.guid] =
                                        currentParentList
                                } else {
                                    nodeToParentKeyMap[el.guid] = [
                                        treeNode.dataRef.guid,
                                    ]
                                }
                                if (
                                    checkable &&
                                    checkedGuids?.includes(el.guid)
                                ) {
                                    console.log(el.guid)
                                    const key = `${treeNode.attributes?.qualifiedName}_${el.attributes?.qualifiedName}`
                                    localCheckedNodes?.value?.push(el)
                                    if (!checkedKeys.value.includes(key)) {
                                        checkedKeys.value.push(key)
                                    }
                                }
                            } else {
                                nodeToParentKeyMap[el.guid] =
                                    treeNode?.dataRef?.guid
                            }
                        })
                        treeNode.dataRef.children.push(...map)
                        loadedKeys.value.push(treeNode.dataRef.key)
                        checkAndAddLoadMoreNode({
                            response: data.value,
                            parentGuid: treeNode.dataRef.guid,
                            parentGlossaryQf:
                                treeNode.attributes?.qualifiedName,
                        })
                    } else {
                        // treeNode.dataRef.children = null
                        treeNode.dataRef.children.push({
                            key: `${treeNode.attributes?.qualifiedName}_cta`,
                            id: `${treeNode.attributes?.qualifiedName}_cta`,
                            title: 'cta',
                            isLeaf: true,
                            typeName: 'cta',
                            guid: `${treeNode.attributes?.qualifiedName}_cta`,
                            glossaryQualifiedName:
                                treeNode?.attributes?.qualifiedName,
                            glossaryName: treeNode?.attributes?.name,
                            glossaryGuid: treeNode?.guid,
                            parentCategory: treeNode,
                            selectable: false,
                            checkable: false,
                        })
                        loadedKeys.value.push(treeNode.dataRef.key)
                        nodeToParentKeyMap[
                            `${treeNode.attributes?.qualifiedName}_cta`
                        ] = treeNode.dataRef.guid
                    }
                    treeNode.dataRef.isLoading = false
                    treeNode.dataRef.isError = null
                }
            } catch (e) {
                loadedKeys.value.push(treeNode.dataRef.key)
                treeNode.dataRef.isLoading = false
                treeNode.dataRef.isError = e
                return
                // return
            }
        } else if (treeNode.typeName === 'AtlasGlossaryCategory') {
            facets.value = {
                typeNames: ['AtlasGlossaryTerm', 'AtlasGlossaryCategory'],
                glossary:
                    treeNode.attributes?.anchor?.uniqueAttributes
                        ?.qualifiedName,
                parentCategory: treeNode.attributes?.qualifiedName,
            }

            generateBody()
            try {
                await mutate()
                if (error.value) {
                    loadedKeys.value.push(treeNode.dataRef.key)
                    treeNode.dataRef.isLoading = false
                    treeNode.dataRef.isError = error
                } else {
                    if (!treeNode.dataRef.children) {
                        treeNode.dataRef.children = []
                    }
                    if (data.value?.entities) {
                        let map = data.value?.entities?.map((i) => ({
                            ...i,
                            id: `${treeNode.attributes?.qualifiedName}_${i.attributes?.qualifiedName}`,
                            key: `${treeNode.attributes?.qualifiedName}_${i.attributes?.qualifiedName}`,
                            isLeaf: i.typeName === 'AtlasGlossaryTerm',
                            checkable:
                                i.typeName === 'AtlasGlossaryTerm'
                                    ? checkable
                                    : false,
                        }))
                        if (map) {
                            map?.forEach((el) => {
                                if (el.typeName === 'AtlasGlossaryTerm') {
                                    const currentParentList =
                                        nodeToParentKeyMap[el.guid]
                                    if (
                                        currentParentList &&
                                        currentParentList.length &&
                                        typeof currentParentList !== 'string'
                                    ) {
                                        currentParentList.push(
                                            treeNode.dataRef.guid
                                        )
                                        nodeToParentKeyMap[el.guid] =
                                            currentParentList
                                    } else {
                                        nodeToParentKeyMap[el.guid] = [
                                            treeNode.dataRef.guid,
                                        ]
                                    }
                                    if (
                                        checkable &&
                                        checkedGuids?.includes(el.guid)
                                    ) {
                                        console.log(el.guid)
                                        const key = `${treeNode.attributes?.qualifiedName}_${el.attributes?.qualifiedName}`
                                        localCheckedNodes?.value?.push(el)
                                        if (!checkedKeys.value.includes(key)) {
                                            checkedKeys.value.push(key)
                                        }
                                    }
                                } else {
                                    nodeToParentKeyMap[el.guid] =
                                        treeNode?.dataRef?.guid
                                }
                            })
                            treeNode.dataRef.children = []
                            treeNode.dataRef.children.push(...map)
                            loadedKeys.value.push(treeNode.dataRef.key)

                            checkAndAddLoadMoreNode({
                                response: data.value,
                                parentGuid: treeNode.dataRef.guid,
                                parentGlossaryQf:
                                    treeNode.attributes?.anchor
                                        ?.uniqueAttributes?.qualifiedName,
                                parentCategoryQf:
                                    treeNode.attributes?.qualifiedName,
                            })
                        } else {
                            loadedKeys.value.push(treeNode.dataRef.key)
                        }
                    } else {
                        // treeNode.dataRef.children = null
                        treeNode.dataRef.children.push({
                            key: `${treeNode.attributes?.qualifiedName}_cta`,
                            id: `${treeNode.attributes?.qualifiedName}_cta`,
                            title: 'cta',
                            isLeaf: true,
                            typeName: 'cta',
                            guid: `${treeNode.attributes?.qualifiedName}_cta`,
                            glossaryName:
                                treeNode?.attributes?.anchor?.attributes?.name,
                            glossaryQualifiedName:
                                treeNode?.attributes?.anchor?.uniqueAttributes
                                    ?.qualifiedName,
                            categoryName: treeNode?.attributes?.name,
                            categoryGuid: treeNode?.guid,
                            parentCategory: treeNode,
                            selectable: false,
                            checkable: false,
                        })
                        loadedKeys.value.push(treeNode.dataRef.key)
                        nodeToParentKeyMap[
                            `${treeNode.attributes?.qualifiedName}_cta`
                        ] = treeNode.dataRef.key
                    }
                    treeNode.dataRef.isLoading = false
                    treeNode.dataRef.isError = null
                }
            } catch (e) {
                console.log(e)
                treeNode.dataRef.isLoading = false
                treeNode.dataRef.isError = e
            }
        }
    }

    const expandNode = (expanded: string[], event: any) => {
        if (!event.node.isLeaf) {
            const key: string = event.node.eventKey
            const isExpanded = expandedKeys.value?.includes(key)
            if (!isExpanded) {
                if (isAccordion && event.node.dataRef.isRoot) {
                    expandedKeys.value = []
                }
                expandedKeys.value?.push(key)
            } else if (isExpanded) {
                const index = expandedKeys.value?.indexOf(key)
                expandedKeys.value?.splice(index, 1)
            }
            expandedKeys.value = [...expandedKeys.value]
        }
    }

    const recursivelyFindPath = (
        targetGuid: string,
        initialStack?: string[]
    ) => {
        let parentStack = initialStack?.length ? initialStack : [targetGuid]

        const findPath = (currGuid: string) => {
            if (
                nodeToParentKeyMap[currGuid] &&
                nodeToParentKeyMap[currGuid] !== 'root'
            ) {
                const current = nodeToParentKeyMap[currGuid]
                if (typeof current === 'string') {
                    parentStack.push(current)
                    findPath(current)
                }
            }
        }
        const allPaths: string[][] = []

        const firstParent = nodeToParentKeyMap[targetGuid]
        if (typeof firstParent === 'string') {
            parentStack = initialStack?.length ? initialStack : [targetGuid]
            findPath(targetGuid)
            allPaths.push(parentStack)
        } else {
            firstParent?.forEach((guid) => {
                parentStack = initialStack?.length
                    ? initialStack
                    : [targetGuid, guid]
                findPath(guid)
                allPaths.push(parentStack)
            })
        }
        return allPaths
    }

    const selectNode = (selected: any, event: any) => {
        if (!event.node.isLeaf) {
            expandNode([], event)
        }
        selectedKeys.value = selected
        emit('select', event.node.dataRef)
    }

    const glossaryStore = useGlossaryStore()

    const glossaryList = computed(() =>
        glossaryStore.list.sort((a, b) =>
            a.attributes.name > b.attributes.name
                ? 1
                : b.attributes.name > a.attributes.name
                ? -1
                : 0
        )
    )

    const initTreeData = async (defaultGlossaryQf) => {
        let glossaryFound = null
        if (defaultGlossaryQf !== '') {
            glossaryFound = glossaryList.value.find(
                (i) => i.attributes.qualifiedName === defaultGlossaryQf
            )
            if (glossaryFound) {
                facets.value = {
                    typeNames: ['AtlasGlossaryTerm', 'AtlasGlossaryCategory'],
                    glossary: defaultGlossaryQf,
                    isRootTerm: true,
                    isRootCategory: true,
                }
                generateBody()
                try {
                    await mutate()
                    treeData.value = []
                    if (data.value?.entities) {
                        data.value?.entities?.forEach((el) => {
                            nodeToParentKeyMap[el.guid] = 'root'
                        })
                        treeData.value = data.value?.entities.map((i) => ({
                            ...i,
                            id: `${defaultGlossaryQf}_${i.attributes?.qualifiedName}`,
                            key: `${defaultGlossaryQf}_${i.attributes?.qualifiedName}`,
                            isLeaf: i.typeName === 'AtlasGlossaryTerm',
                            checkable:
                                i.typeName === 'AtlasGlossaryTerm'
                                    ? checkable
                                    : false,
                        }))
                        treeData.value.sort((a, b) => {
                            if (a.typeName === 'AtlasGlossaryTerm') return 1
                            return -1
                        })
                        checkAndAddLoadMoreNode({
                            response: data.value,
                            parentGuid: 'root',
                            parentKey: 'root',
                            parentGlossaryQf: defaultGlossaryQf,
                        })
                    }
                } catch (e) {
                    console.log(e)
                    treeData.value = []
                }
            }
        } else {
            treeData.value = glossaryList.value.map((i) => {
                nodeToParentKeyMap[i?.guid] = 'root'
                return {
                    ...i,
                    id: i.attributes?.qualifiedName,
                    key: i.attributes?.qualifiedName,
                    isLeaf: false,
                    checkable: false,
                }
            })
        }
    }

    const { getAnchorQualifiedName } = useAssetInfo()

    const recursivelyAddOrDeleteNode = async (asset, guid, action) => {
        let parentStack: string[]

        const updateNodeNested = async (node: TreeDataItem) => {
            const currentPath = parentStack.pop()
            // if the target node is reached
            if (node.key === guid || !currentPath || node.guid === guid) {
                const updatedChildren: TreeDataItem[] = []
                console.log(
                    action,
                    ' from ',
                    node?.displayText,
                    asset?.displayText
                )
                if (action === 'add') {
                    let loadMoreNode
                    node?.children?.forEach((element) => {
                        if (element?.typeName === 'loadMore')
                            loadMoreNode = element
                        if (
                            element?.typeName !== 'cta' &&
                            element?.typeName !== 'loadMore'
                        )
                            updatedChildren.push(element)
                    })
                    updatedChildren.push({
                        ...asset,
                        id: `${node.attributes?.qualifiedName}_${asset.attributes?.qualifiedName}`,
                        key: `${node.attributes?.qualifiedName}_${asset.attributes?.qualifiedName}`,
                        isLeaf: asset.typeName === 'AtlasGlossaryTerm',
                    })
                    if (loadMoreNode) {
                        updatedChildren.push(loadMoreNode)
                    }
                }
                if (action === 'delete') {
                    node?.children?.forEach((element) => {
                        if (
                            (asset?.typeName === 'AtlasGlossaryCategory' ||
                                asset?.value?.typeName ===
                                    'AtlasGlossaryCategory') &&
                            (element?.guid === asset?.guid ||
                                element?.guid === asset?.value?.guid)
                        ) {
                            if (element?.children?.length)
                                element?.children?.forEach((el) => {
                                    if (el?.typeName !== 'cta')
                                        updatedChildren.push(el)
                                })
                        }
                        if (
                            element?.typeName !== 'cta' &&
                            element?.guid !== asset?.guid &&
                            element?.guid !== asset?.value?.guid
                        )
                            updatedChildren.push(element)
                    })
                }
                nodeToParentKeyMap[asset?.guid ?? asset?.value?.guid ?? ''] =
                    node.guid as string
                if (
                    loadedKeys.value.find(
                        (key) => node?.key === key || node?.value?.key === key
                    ) ||
                    action === 'delete'
                ) {
                    return {
                        ...node,
                        children: updatedChildren,
                    }
                }
                return node
            }
            const updatedChildren: TreeDataItem[] = []

            // eslint-disable-next-line no-restricted-syntax
            for (const childNode of node?.children ?? []) {
                // if the current node is in the path that is needed to reach the target node
                if (
                    childNode.key === currentPath ||
                    childNode.guid === currentPath
                ) {
                    const updatedNode = await updateNodeNested(childNode)
                    updatedChildren.push(updatedNode)
                } else {
                    updatedChildren.push(childNode)
                }
            }
            return {
                ...node,
                children: updatedChildren,
            }
        }

        // find the path to the node
        parentStack = recursivelyFindPath(guid)[0]
        const parent = parentStack?.pop()
        const updatedTreeData: TreeDataItem[] = []
        // eslint-disable-next-line no-restricted-syntax
        for (const node of treeData.value) {
            if (node.key === parent || node.guid === parent) {
                const updatedNode = await updateNodeNested(node)
                updatedTreeData.push(updatedNode)
            } else {
                updatedTreeData.push(node)
            }
        }

        treeData.value = updatedTreeData
    }
    const deleteNode = (asset, guid) => {
        if (guid === 'root') {
            const updatedTreeData: TreeDataItem[] = treeData.value.filter(
                (el) => {
                    return el?.guid !== asset?.guid
                }
            )
            treeData.value = updatedTreeData
        } else {
            recursivelyAddOrDeleteNode(asset, guid, 'delete')
        }
    }

    const addNode = (asset, entity): TreeDataItem => {
        if (entity) {
            recursivelyAddOrDeleteNode(
                asset,
                entity?.value?.guid || entity?.guid,
                'add'
            )
        } else {
            nodeToParentKeyMap[asset?.guid ?? asset?.value?.guid ?? ''] = 'root'
            const found = treeData.value?.find((el) => el?.guid === asset?.guid)
            if (!found) {
                if (asset.typeName === 'AtlasGlossary') {
                    treeData.value.unshift({
                        ...asset,
                        id: asset.attributes?.qualifiedName,
                        key: asset.attributes?.qualifiedName,
                        isLeaf: false,
                    })
                }

                if (asset.typeName === 'AtlasGlossaryTerm') {
                    treeData.value.unshift({
                        ...asset,
                        id: `${getAnchorQualifiedName(asset)}_${
                            asset.attributes?.qualifiedName
                        }`,
                        key: `${getAnchorQualifiedName(asset)}_${
                            asset.attributes?.qualifiedName
                        }`,
                        isLeaf: true,
                    })
                }

                if (asset.typeName === 'AtlasGlossaryCategory') {
                    treeData.value.unshift({
                        ...asset,
                        id: `${getAnchorQualifiedName(asset)}_${
                            asset.attributes?.qualifiedName
                        }`,
                        key: `${getAnchorQualifiedName(asset)}_${
                            asset.attributes?.qualifiedName
                        }`,
                        isLeaf: false,
                    })
                }
            }
        }
    }

    const collapseAll = () => {
        expandedKeys.value = []
    }

    const handleCategoriesChange = (
        existingCategories,
        newCategories,
        asset
    ) => {
        const addedCategories = newCategories?.filter(
            (category) =>
                !existingCategories.find(
                    (existing) => existing.guid === category.guid
                )
        )
        const removedCategories = existingCategories?.filter(
            (category) =>
                !newCategories?.find((newCat) => newCat.guid === category.guid)
        )

        if (addedCategories?.length) {
            addedCategories.forEach((cat) => {
                setTimeout(() => {
                    addNode(asset, cat)
                }, 0)
            })
        }
        if (removedCategories?.length)
            removedCategories.forEach((cat) => {
                setTimeout(() => {
                    deleteNode(asset, cat?.guid)
                }, 0)
            })
        if (!newCategories?.length && removedCategories?.length) {
            setTimeout(() => {
                if (parentGlossaryQualifiedName?.value !== '') {
                    addNode(asset)
                } else addNode(asset, asset?.attributes?.anchor)
            }, 0)
        }
    }

    const updateNode = (asset) => {
        const currentParents = nodeToParentKeyMap[asset?.guid]
        if (currentParents) {
            if (
                currentParents === 'root' ||
                (typeof currentParents !== 'string' &&
                    currentParents?.find((parent) => parent === 'root'))
            ) {
                treeData.value = treeData.value.map((treeNode) => {
                    if (treeNode.guid === asset?.guid) {
                        handleCategoriesChange(
                            treeNode?.attributes?.categories,
                            asset?.attributes?.categories,
                            asset
                        )

                        treeNode.attributes = asset?.attributes
                    }
                    return treeNode
                })
            } else {
                let parentStack: string[][]

                const updateNodeNested = (
                    node: TreeDataItem,
                    path: string[]
                ): TreeDataItem => {
                    const currentPath = path.pop()

                    // if the target node is reached
                    if (node.guid === asset?.guid || !currentPath) {
                        handleCategoriesChange(
                            node?.attributes?.categories,
                            asset?.attributes?.categories,
                            asset
                        )

                        node.attributes = asset.attributes
                        return {
                            ...node,
                        }
                    }
                    return {
                        ...node,
                        children: node.children?.map(
                            (childNode: TreeDataItem) => {
                                // if the current element is in the path that is needed to reach the target node
                                if (
                                    childNode.key === currentPath ||
                                    childNode.guid === currentPath
                                ) {
                                    return updateNodeNested(childNode, path)
                                }
                                return childNode
                            }
                        ),
                    }
                }

                // find the path to the node
                parentStack = recursivelyFindPath(asset?.guid)
                parentStack.forEach((path) => {
                    const parent = path.pop()

                    treeData.value = treeData.value.map(
                        (node: TreeDataItem) => {
                            if (node?.guid === parent)
                                return updateNodeNested(node, path)
                            return node
                        }
                    )
                })
            }
        }
    }
    const dragAndDropNode = ({ event, node, dragNode, dragNodesKeys }) => {
        console.log(event, node, dragNode, dragNodesKeys)
        const assetToDrop = { ...dragNode.dataRef }
        if (assetToDrop?.typeName === 'AtlasGlossary') {
            message.error(
                `Cannot reorder a Glossary. Try reordering a term/category instead.`,
                2
            )
        } else if (node?.typeName === 'AtlasGlossaryTerm') {
            message.error(
                `Cannot drop ${
                    assetToDrop?.displayText ?? ''
                } in a Term. Try dropping in a category instead.`,
                3
            )
        } else {
            let nodeParentGlossaryGuid
            if (node?.typeName === 'AtlasGlossary')
                nodeParentGlossaryGuid = node?.guid
            else nodeParentGlossaryGuid = node?.attributes?.anchor?.guid
            if (
                nodeParentGlossaryGuid !== assetToDrop?.attributes?.anchor?.guid
            ) {
                message.error(`Cannot change parent Glossary`)
            } else {
                // delete from parent and add to node
                setTimeout(() => {
                    deleteNode(
                        assetToDrop,
                        dragNode?.parent?.node?.guid ?? 'root'
                    )
                }, 0)
                setTimeout(() => {
                    addNode(assetToDrop, node)
                }, 0)
                const updateTermCategories = () => {
                    const selectedAsset = ref(assetToDrop)
                    const {
                        localCategories,
                        handleCategoriesUpdate,
                        error: updateError,
                        asset,
                    } = updateAssetAttributes(selectedAsset)
                    console.log(selectedAsset)
                    console.log(localCategories)
                    const newCategories = localCategories.value?.filter(
                        (el) => el.guid !== dragNode?.parent?.node?.guid
                    )
                    if (node?.typeName !== 'AtlasGlossary')
                        newCategories.push(node?.dataRef)
                    localCategories.value = newCategories
                    handleCategoriesUpdate()

                    whenever(updateError, () => {
                        setTimeout(() => {
                            deleteNode(assetToDrop, node?.guid ?? 'root')
                        }, 0)
                        setTimeout(() => {
                            addNode(assetToDrop, dragNode?.parent?.node)
                        }, 0)
                    })
                }
                // if (dragNode?.typeName === 'AtlasGlossaryTerm') {
                updateTermCategories()
                // }
            }
        }
    }
    interface checkAndAddLoadMoreParams {
        response: IndexSearchResponse<Term | Category>
        parentGuid: string
        parentKey?: string | 'root'
        parentGlossaryQf: string
        parentCategoryQf?: string
    }

    const checkAndAddLoadMoreNode = ({
        response,
        parentGuid,
        parentKey,
        parentGlossaryQf,
        parentCategoryQf,
    }: checkAndAddLoadMoreParams) => {
        let searchParams
        try {
            searchParams = JSON.parse(response.searchParameters?.query ?? '{}')
        } catch {
            searchParams = { size: limit.value, from: 0 }
        }
        const localLimit = searchParams.size ?? limit.value
        const localOffset = searchParams.from ?? 0
        const approxCount = response.approximateCount ?? 0

        const numberOfLoadMore =
            approxCount - (localLimit + localOffset) < localLimit
                ? approxCount - (localLimit + localOffset)
                : localLimit

        if (
            approxCount &&
            localLimit &&
            approxCount > localLimit + localOffset
        ) {
            if (parentKey === 'root') {
                treeData.value.push({
                    key: 'root' + '_Load_More',
                    title: `Load ${numberOfLoadMore} more`,
                    isLeaf: true,
                    isLoading: false,
                    typeName: 'loadMore',
                    click() {
                        this.dataRef.isLoading = true
                        handleLoadMore(
                            localLimit + localOffset,
                            'root',
                            parentGlossaryQf,
                            parentCategoryQf
                        )
                    },
                    guid: 'LoadMore',
                    checkable: false,
                    selectable: false,
                })
            } else {
                const path = recursivelyFindPath(parentGuid)[0]

                const addLoadMoreInNestedNode = (node: TreeDataItem) => {
                    const currentPath = path.pop()
                    if (node.guid === parentGuid && !currentPath) {
                        node.children?.push({
                            key: node?.guid + '_Load_More',
                            title: `Load ${numberOfLoadMore} more`,
                            isLeaf: true,
                            isLoading: false,
                            typeName: 'loadMore',
                            click() {
                                this.dataRef.isLoading = true
                                handleLoadMore(
                                    localLimit + localOffset,
                                    node?.guid,
                                    parentGlossaryQf,
                                    parentCategoryQf
                                )
                            },
                            guid: 'LoadMore',
                            checkable: false,
                            selectable: false,
                        })
                        return node
                    }
                    return {
                        ...node,
                        children: node.children?.map((child) => {
                            if (child.guid === currentPath)
                                return addLoadMoreInNestedNode(child)
                            return child
                        }),
                    }
                }
                const parent = path?.pop()

                treeData.value = treeData.value.map((node) => {
                    if (node.guid === parent)
                        return addLoadMoreInNestedNode(node)
                    return node
                })
            }
        }
    }

    const handleLoadMore = async (
        localOffset: number,
        parentGuid: string | 'root',
        parentGlossaryQf: string,
        parentCategoryQf?: string
    ) => {
        offset.value = localOffset
        const path = recursivelyFindPath(parentGuid)[0]

        const getChildren = async () => {
            const children: any[] = []
            facets.value = {
                typeNames: ['AtlasGlossaryTerm', 'AtlasGlossaryCategory'],
                glossary: parentGlossaryQf,
                isRootTerm: parentCategoryQf ? false : true,
                isRootCategory: parentCategoryQf ? false : true,
                parentCategory: parentCategoryQf,
            }
            generateBody()
            try {
                await mutate()

                let map = data.value?.entities?.map((i) => ({
                    ...i,
                    id: `${parentGlossaryQf}_${parentCategoryQf}_${i.attributes?.qualifiedName}`,
                    key: `${parentGlossaryQf}_${parentCategoryQf}_${i.attributes?.qualifiedName}`,
                    isLeaf: i.typeName === 'AtlasGlossaryTerm',
                    checkable:
                        i.typeName === 'AtlasGlossaryTerm' ? checkable : false,
                }))
                map?.forEach((el) => {
                    if (el.typeName === 'AtlasGlossaryTerm') {
                        const currentParentList = nodeToParentKeyMap[el.guid]
                        if (
                            currentParentList &&
                            currentParentList.length &&
                            typeof currentParentList !== 'string'
                        ) {
                            currentParentList.push(parentGuid)
                            nodeToParentKeyMap[el.guid] = currentParentList
                        } else {
                            nodeToParentKeyMap[el.guid] = [parentGuid]
                        }
                        if (checkable && checkedGuids?.includes(el.guid)) {
                            console.log(el.guid)

                            const key = `${parentGlossaryQf}_${parentCategoryQf}_${el.attributes?.qualifiedName}`
                            localCheckedNodes?.value?.push(el)
                            if (!checkedKeys.value.includes(key)) {
                                checkedKeys.value.push(key)
                            }
                        }
                    } else {
                        nodeToParentKeyMap[el.guid] = parentGuid
                    }
                })
                if (data.value) {
                    children?.push(...map)
                    checkAndAddLoadMoreNode({
                        response: data.value,
                        parentGuid: parentGuid,
                        parentKey: parentGuid,
                        parentGlossaryQf,
                        parentCategoryQf,
                    })
                }
                return children
            } catch (e) {
                console.log(e)
                return []
            }
        }
        const newChildren = await getChildren()

        if (parentGuid === 'root') {
            treeData.value = treeData.value.filter(
                (child) => child.typeName !== 'loadMore'
            )
            treeData.value.push(...newChildren)
        } else {
            const appendNewNodes = (node: TreeDataItem) => {
                const currentPath = path.pop()

                if (node.guid === parentGuid && !currentPath) {
                    let updatedChildren = node.children?.filter(
                        (child) => child.typeName !== 'loadMore'
                    )

                    if (updatedChildren && updatedChildren.length) {
                        updatedChildren.push(...newChildren)
                    } else updatedChildren = newChildren

                    return {
                        ...node,
                        children: updatedChildren,
                    }
                }
                return {
                    ...node,
                    children: node.children?.map((child) => {
                        if (child.guid === currentPath)
                            return appendNewNodes(child)
                        return child
                    }),
                }
            }

            const parent = path?.pop()
            treeData.value = treeData.value.map((node) => {
                if (node.guid === parent) return appendNewNodes(node)
                return node
            })
        }
        if (data.value) {
            checkAndAddLoadMoreNode({
                response: data.value,
                parentGuid,
                parentKey: parentGuid,
                parentGlossaryQf,
                parentCategoryQf,
            })
        }
    }

    watch(parentGlossaryQualifiedName, (newParentGlossaryQF) => {
        offset.value = 0
        queryText.value = ''
        loadedKeys.value = []
        selectedKeys.value = []
        checkedKeys.value = []
        expandedKeys.value = []
        initTreeData(newParentGlossaryQF)
    })
    return {
        onLoadData,
        expandNode,
        generateBody,
        data,
        loadedKeys,
        expandedKeys,
        checkedKeys,
        selectNode,
        selectedKeys,
        glossaryList,
        initTreeData,
        treeData,
        addNode,
        isLoading,
        error,
        isReady,
        getAnchorQualifiedName,
        recursivelyFindPath,
        collapseAll,
        deleteNode,
        updateNode,
        dragAndDropNode,
    }
}

export default useGlossaryTree
