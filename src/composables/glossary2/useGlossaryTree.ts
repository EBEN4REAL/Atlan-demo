import { watch, ref, Ref, onMounted, computed } from 'vue'
import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'

// composables
import useUpdateGtcEntity from '~/composables/glossary/useUpdateGtcEntity'
import useLoadGlossaryTreeData from '~/composables/glossary/useLoadGlossaryTreeData'
import useGtcEntity from '~/composables/glossary/useGtcEntity'

// types
import { Glossary, Category, Term } from '~/types/glossary/glossary.interface'
import { BasicSearchResponse } from '~/types/common/atlasSearch.interface'

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
import useAssetInfo from '~/composables/discovery/useAssetInfo'

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
}: UseTreeParams) => {
    const limit = ref(8)
    const offset = ref(0)
    const queryText = ref('')
    const facets = ref({
        typeNames: ['AtlasGlossaryTerm', 'AtlasGlossaryCategory'],
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

    const { data, mutate, isLoading, error, isReady } =
        useIndexSearch<assetInterface>(
            defaultBody,
            dependentKey,
            false,
            false,
            1
        )

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
                                    if (!checkedKeys.value.includes(el.guid)) {
                                        checkedKeys.value.push(el.guid)
                                    }
                                }
                            } else {
                                nodeToParentKeyMap[el.guid] =
                                    treeNode?.dataRef?.guid
                            }
                        })
                        console.log(treeNode)
                        treeNode.dataRef.children.push(...map)
                        loadedKeys.value.push(treeNode.dataRef.key)
                        checkAndAddLoadMoreNode(
                            data.value,
                            treeNode.dataRef.guid,
                            treeNode.dataRef.guid,
                            treeNode
                        )
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
                                        if (
                                            !checkedKeys.value.includes(el.guid)
                                        ) {
                                            checkedKeys.value.push(el.guid)
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

                            console.log(treeNode)
                            checkAndAddLoadMoreNode(
                                data.value,
                                treeNode.dataRef.guid,
                                treeNode.dataRef.guid,
                                treeNode
                            )
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
            // selectedKeys.value = []
        }
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
                        checkAndAddLoadMoreNode(data.value, 'root', 'root')
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
                if (action === 'add') {
                    node?.children?.forEach((element) => {
                        if (element?.typeName !== 'cta')
                            updatedChildren.push(element)
                    })
                    updatedChildren.push({
                        ...asset,
                        id: `${node.attributes?.qualifiedName}_${asset.attributes?.qualifiedName}`,
                        key: `${node.attributes?.qualifiedName}_${asset.attributes?.qualifiedName}`,
                        isLeaf: asset.typeName === 'AtlasGlossaryTerm',
                    })
                }
                if (action === 'delete') {
                    node?.children?.forEach((element) => {
                        if (
                            element?.typeName !== 'cta' &&
                            element?.guid !== asset?.guid &&
                            element?.guid !== asset?.value?.guid
                        )
                            updatedChildren.push(element)
                    })
                }
                nodeToParentKeyMap[asset?.guid ?? asset?.value?.guid ?? ''] =
                    node.key as string

                return {
                    ...node,
                    children: updatedChildren,
                }
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
        if (entity && entity !== {}) {
            recursivelyAddOrDeleteNode(
                asset,
                entity?.value?.guid || entity?.guid,
                'add'
            )
        } else {
            nodeToParentKeyMap[asset?.guid ?? asset?.value?.guid ?? ''] = 'root'

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

    const collapseAll = () => {
        expandedKeys.value = []
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
                    if (treeNode.key === asset?.guid) {
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
                    if (node.key === asset?.guid || !currentPath) {
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
                                if (childNode.key === currentPath) {
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

    const checkAndAddLoadMoreNode = (
        response: BasicSearchResponse<Term>,
        parentGuid: string,
        key?: string,
        treeNode
    ) => {
        let searchParams
        try {
            searchParams = JSON.parse(response.searchParameters?.query ?? '{}')
        } catch {
            searchParams = { size: limit.value, from: 0 }
        }
        console.log(treeNode)
        const localLimit = searchParams.size ?? limit.value
        const localOffset = searchParams.from ?? 0
        const approxCount = response.approximateCount

        if (
            approxCount &&
            localLimit &&
            approxCount > localLimit + localOffset
        ) {
            if (key === 'root') {
                treeData.value.push({
                    key: treeNode?.guid + '_Load_More',
                    title: 'Load more',
                    isLeaf: true,
                    isLoading: false,
                    click: () => {
                        handleLoadMore(treeNode, localLimit + localOffset)
                    },
                    typeName: 'loadMore',
                    guid: 'LoadMore',
                    checkable: false,
                    selectable: false,
                })
            } else {
                const path = recursivelyFindPath(parentGuid)[0]
                console.log(path)

                const addLoadMoreInNestedNode = (node: TreeDataItem) => {
                    const currentPath = path.pop()
                    if (node.guid === parentGuid && !currentPath) {
                        node.children?.push({
                            key: treeNode?.guid + '_Load_More',
                            title: 'Load more',
                            isLeaf: true,
                            isLoading: false,
                            typeName: 'loadMore',
                            click: () => {
                                handleLoadMore(
                                    treeNode,
                                    localLimit + localOffset
                                )
                            },
                            guid: 'LoadMore',
                            checkable: false,
                            selectable: false,
                            parent: treeNode,
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
    const handleLoadMore = async (treeNode, localOffset) => {
        console.log('handleLoad More')
        console.log(treeNode)
        offset.value = localOffset
        console.log(offset.value)
        treeNode.dataRef.children = treeNode.dataRef.children.filter((node) => {
            console.log(node.key !== `${treeNode?.guid}_Load_More`)
            return node.key === `${treeNode?.guid}_Load_More`
        })
        console.log(treeNode.dataRef.children)
        // if (treeNode.typeName === 'AtlasGlossary') {
        //     facets.value = {
        //         typeNames: ['AtlasGlossaryTerm', 'AtlasGlossaryCategory'],
        //         glossary: treeNode.attributes?.qualifiedName,
        //         isRootTerm: true,
        //         isRootCategory: true,
        //     }
        //     generateBody()
        //     try {
        //         await mutate()

        //         if (error.value) {
        //             loadedKeys.value.push(treeNode.dataRef.key)
        //             treeNode.dataRef.isLoading = false
        //             treeNode.dataRef.isError = error
        //         } else {
        //             if (!treeNode.dataRef.children) {
        //                 treeNode.dataRef.children = []
        //             }
        //             let map = data.value?.entities?.map((i) => ({
        //                 ...i,
        //                 id: `${treeNode.attributes?.qualifiedName}_${i.attributes?.qualifiedName}`,
        //                 key: `${treeNode.attributes?.qualifiedName}_${i.attributes?.qualifiedName}`,
        //                 isLeaf: i.typeName === 'AtlasGlossaryTerm',
        //                 checkable:
        //                     i.typeName === 'AtlasGlossaryTerm'
        //                         ? checkable
        //                         : false,
        //             }))
        //             if (map) {
        //                 console.log(map)
        //                 treeNode.dataRef.children.push(...map)
        //                 checkAndAddLoadMoreNode(
        //                     data.value,
        //                     treeNode.dataRef.guid,
        //                     treeNode.dataRef.guid,
        //                     treeNode
        //                 )
        //             }
        //         }
        //     } catch (e) {
        //         console.log(e)
        //     }
        // } else if (treeNode.typeName === 'AtlasGlossaryCategory') {
        //     facets.value = {
        //         typeNames: ['AtlasGlossaryTerm', 'AtlasGlossaryCategory'],
        //         glossary:
        //             treeNode.attributes?.anchor?.uniqueAttributes
        //                 ?.qualifiedName,
        //         parentCategory: treeNode.attributes?.qualifiedName,
        //     }

        //     generateBody()
        //     try {
        //         await mutate()
        //         if (error.value) {
        //             loadedKeys.value.push(treeNode.dataRef.key)
        //             treeNode.dataRef.isLoading = false
        //             treeNode.dataRef.isError = error
        //         } else {
        //             if (!treeNode.dataRef.children) {
        //                 treeNode.dataRef.children = []
        //             }
        //             if (data.value?.entities) {
        //                 let map = data.value?.entities?.map((i) => ({
        //                     ...i,
        //                     id: `${treeNode.attributes?.qualifiedName}_${i.attributes?.qualifiedName}`,
        //                     key: `${treeNode.attributes?.qualifiedName}_${i.attributes?.qualifiedName}`,
        //                     isLeaf: i.typeName === 'AtlasGlossaryTerm',
        //                     checkable:
        //                         i.typeName === 'AtlasGlossaryTerm'
        //                             ? checkable
        //                             : false,
        //                 }))
        //                 if (map) {
        //                     console.log(map)
        //                     treeNode.dataRef.children.push(...map)
        //                     checkAndAddLoadMoreNode(
        //                         data.value,
        //                         treeNode.dataRef.guid,
        //                         treeNode.dataRef.guid,
        //                         treeNode
        //                     )
        //                 }
        //             }
        //         }
        //     } catch (e) {
        //         console.log(e)
        //     }
        // }
    }
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
    }
}

export default useGlossaryTree
