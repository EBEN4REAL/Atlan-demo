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
}: UseTreeParams) => {
    const limit = ref(100)
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
    const { getRootTerms, getSubTerms, getAllCategories } =
        useLoadGlossaryTreeData()

    // helper
    const returnTreeDataItemAttributes = (
        item: Category | Term,
        type: 'term' | 'category',
        glossaryGuid: string,
        isRoot?: Boolean,
        parentCategoryId?: string
    ) => ({
        ...item,
        ...item.attributes,
        title: item.attributes.name,
        key: nodesKey === 'guid' ? item.guid : item.attributes.qualifiedName,
        glossaryID: glossaryGuid,
        parentCategoryId,
        type,
        isRoot,
        isLeaf: type === 'term',
        checkable: type === 'term',
    })

    const onLoadData = async (treeNode: any) => {
        treeNode.dataRef.isLoading = true
        treeNode.dataRef.isError = null
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
                        checkable: i.typeName === 'AtlasGlossaryTerm' ? checkable : false
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
                                    currentParentList.push(treeNode.dataRef.key)
                                    nodeToParentKeyMap[el.guid] =
                                        currentParentList
                                } else {
                                    nodeToParentKeyMap[el.guid] = [
                                        treeNode.dataRef.key,
                                    ]
                                }
                            } else {
                                nodeToParentKeyMap[el.guid] =
                                    treeNode?.dataRef?.key
                            }
                        })

                        treeNode.dataRef.children.push(...map)
                        loadedKeys.value.push(treeNode.dataRef.key)
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
                            checkable: false
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
                            checkable: i.typeName === 'AtlasGlossaryTerm' ? checkable: false
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
                                            treeNode.dataRef.key
                                        )
                                        nodeToParentKeyMap[el.guid] =
                                            currentParentList
                                    } else {
                                        nodeToParentKeyMap[el.guid] = [
                                            treeNode.dataRef.key,
                                        ]
                                    }
                                } else {
                                    nodeToParentKeyMap[el.guid] =
                                        treeNode?.dataRef?.key
                                }
                            })
                            treeNode.dataRef.children = []
                            treeNode.dataRef.children.push(...map)
                            loadedKeys.value.push(treeNode.dataRef.key)
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
                            checkable: false
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
                            checkable: i.typeName === 'AtlasGlossaryTerm' ? checkable : false
                        }))
                        treeData.value.sort((a, b) => {
                            if (a.typeName === 'AtlasGlossaryTerm') return 1
                            return -1
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
                // let isLeafFlag = false
                // if (i.termsCount === 0 && i.categoryCount === 0) {
                //     isLeafFlag = true
                // }
                return {
                    ...i,
                    id: i.attributes?.qualifiedName,
                    key: i.attributes?.qualifiedName,
                    isLeaf: false,
                    checkable: false
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

        // let parentStack: string[]
        // parentStack = recursivelyFindPath(entity.value?.guid || entity?.guid)[0]
        // console.log(parentStack)
        // const parent = parentStack?.pop()
        // const updatedTreeData: TreeDataItem[] = []
        // console.log(parent)
        // treeData.value.forEach((node) => {
        //     console.log(node.key, node.guid)
        //     if (
        //         node.key === entity?.value?.guid ||
        //         node.guid === entity?.value?.guid ||
        //         node.key === entity?.guid ||
        //         node.guid === entity?.guid
        //     ) {
        //         console.log(node)
        //         node.children?.push({
        //             ...asset,
        //             id: `${node.attributes?.qualifiedName}_${asset.attributes?.qualifiedName}`,
        //             key: `${node.attributes?.qualifiedName}_${asset.attributes?.qualifiedName}`,
        //             isLeaf: asset.typeName === 'AtlasGlossaryTerm',
        //         })
        //         console.log(node)
        //         nodeToParentKeyMap[asset?.guid ?? asset?.value?.guid ?? ''] =
        //             node.key as string

        //         updatedTreeData.push(node)
        //     } else {
        //         updatedTreeData.push(node)
        //     }
        // })

        // treeData.value = updatedTreeData
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
            // refetchNode(
            //     entity?.guid || entity.value?.guid,
            //     entity?.attributes?.qualifiedName ||
            //         entity.value?.attributes?.qualifiedName,
            //     'term'
            // )
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
    const refetchNode = async (
        guid: string | 'root',
        categoryQaulifiedName?: string,
        refetchEntityType?: 'category' | 'term'
    ) => {
        // if the root level of the tree needs a refetch
        if (guid === 'root' && parentGlossaryGuid?.value) {
            let categoryList: Category[] | null = null

            let termsList: Term[] | null = null

            if (refetchEntityType === 'category' || !refetchEntityType) {
                categoryList =
                    (
                        await getAllCategories(
                            parentGlossaryQualifiedName.value,
                            { limit: limit.value }
                        )
                    ).entities ?? []
            }
            if (refetchEntityType === 'term' || !refetchEntityType) {
                termsList =
                    (
                        await getRootTerms(parentGlossaryQualifiedName.value, {
                            limit: limit.value,
                        })
                    ).entities ?? []
            }

            const updatedTreeData: TreeDataItem[] = []
            if (categoryList !== null) {
                categoryList.forEach((category) => {
                    const existingCategory = treeData.value.find(
                        (entity) => entity.guid === category.guid
                    )
                    // if the category already exists,ignore it so as to maintain the expanded state
                    if (existingCategory) {
                        updatedTreeData.push(existingCategory)
                    } else if (!category.attributes?.parentCategory?.guid) {
                        // if a new category is found at the root level, append it

                        nodeToParentKeyMap[category.guid] = 'root'
                        updatedTreeData.push(
                            returnTreeDataItemAttributes(
                                category,
                                'category',
                                parentGlossaryGuid.value ?? '',
                                true
                            )
                        )
                    }
                })
            } else {
                treeData.value.forEach((item) => {
                    if (item.typeName === 'AtlasGlossaryCategory')
                        updatedTreeData.push(item)
                })
            }
            if (termsList !== null) {
                termsList.forEach((term) => {
                    const existingTerm = treeData.value.find(
                        (entity) => entity.guid === term.guid
                    )
                    // if term already exists, append the existing one
                    if (existingTerm) {
                        updatedTreeData.push(existingTerm)
                    } else {
                        nodeToParentKeyMap[term.guid] = ['root']
                        updatedTreeData.push(
                            returnTreeDataItemAttributes(
                                term,
                                'term',
                                parentGlossaryGuid.value ?? ''
                            )
                        )
                    }
                })
            } else {
                treeData.value.forEach((item) => {
                    if (item.typeName === 'AtlasGlossaryTerm')
                        updatedTreeData.push(item)
                })
            }

            treeData.value.forEach((item) => {
                if (item.title === 'Load more') updatedTreeData.push(item)
            })

            treeData.value = updatedTreeData
        } else {
            let parentStack: string[]

            const updateNodeNested = async (node: TreeDataItem) => {
                const currentPath = parentStack.pop()
                // if the target node is reached
                if (node.key === guid || !currentPath) {
                    let categoryList: Category[] | null = null
                    let termsList: Term[] | null = null

                    if (
                        refetchEntityType === 'category' ||
                        !refetchEntityType
                    ) {
                        categoryList =
                            (
                                await getAllCategories(
                                    parentGlossaryQualifiedName.value,
                                    { limit: limit.value }
                                )
                            ).entities ?? []
                    }
                    if (refetchEntityType === 'term' || !refetchEntityType) {
                        termsList =
                            (
                                await getSubTerms(categoryQaulifiedName ?? '', {
                                    limit: limit.value,
                                })
                            ).entities ?? []
                    }
                    const updatedChildren: TreeDataItem[] = []

                    if (categoryList !== null) {
                        categoryList.forEach((category) => {
                            const existingCategory = node.children?.find(
                                (entity) => entity.guid === category.guid
                            )
                            // if current category already exists, append the existing one to maintain expanded state
                            // else append the new one
                            if (existingCategory) {
                                updatedChildren.push(existingCategory)
                            } else if (
                                category.attributes?.parentCategory?.guid ===
                                node.key
                            ) {
                                nodeToParentKeyMap[category?.guid ?? ''] =
                                    node.key as string
                                updatedChildren.push(
                                    returnTreeDataItemAttributes(
                                        category,
                                        'category',
                                        parentGlossaryGuid.value ?? '',
                                        true,
                                        node.key
                                    )
                                )
                            }
                        })
                    } else {
                        node.children?.forEach((item) => {
                            if (item.type === 'category')
                                updatedChildren.push(item)
                        })
                    }

                    if (termsList !== null) {
                        termsList.forEach((term) => {
                            const existingTerm = node.children?.find(
                                (entity) => entity.guid === term.guid
                            )
                            if (existingTerm) {
                                updatedChildren.push(existingTerm)
                            } else {
                                nodeToParentKeyMap[term?.guid ?? ''] = [
                                    node.key as string,
                                ]
                                updatedChildren.push(
                                    returnTreeDataItemAttributes(
                                        term,
                                        'term',
                                        parentGlossaryGuid?.value,
                                        false,
                                        node.key
                                    )
                                )
                            }
                        })
                    } else {
                        node.children?.forEach((item) => {
                            if (item.type === 'term') updatedChildren.push(item)
                        })
                    }

                    node.children?.forEach((item) => {
                        if (item.title === 'Load more')
                            updatedChildren.push(item)
                    })

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
    }
    const collapseAll = () => {
        expandedKeys.value = []
    }
    return {
        onLoadData,
        expandNode,
        generateBody,
        data,
        loadedKeys,
        expandedKeys,
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
        refetchNode,
        collapseAll,
        deleteNode,
    }
}

export default useGlossaryTree
