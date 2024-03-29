// TODO: make helper function to give node attributes and add cta nodes - it's causing redundancy
import { inject, watch, ref, Ref, onMounted, computed, provide, h } from 'vue'
import { whenever } from '@vueuse/core'
import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree'
import { useRouter, useRoute } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import updateAsset from '~/composables/discovery/updateAsset'
import useAssetInfo from '~/composables/discovery/useAssetInfo'

// composables
import useUpdateGtcEntity from '~/composables/glossary/useUpdateGtcEntity'
import useLoadGlossaryTreeData from '~/composables/glossary/useLoadGlossaryTreeData'
import useGtcEntity from '~/composables/glossary/useGtcEntity'
import updateAssetAttributes from '~/composables/discovery/updateAssetAttributes'
import { fetchGlossaryPermission } from '~/composables/glossary/useGTCPermissions'

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
    AssetRelationAttributes,
} from '~/constant/projection'
import { useBody } from '../discovery/useBody'
import useIndexSearch from '../discovery/useIndexSearch'
import { assetInterface } from '~/types/assets/asset.interface'

//components
import DnDConfirmationModalContent from '@/glossary/modal/dndConfirmationModalContent.vue'

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
    disabledGuids?: string[]
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
    disabledGuids = [],
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
    const relationAttributes = ref(['categories', ...AssetRelationAttributes])

    const preference = ref({
        sort: 'name.keyword-asc',
    })
    const loadedKeys = ref<string[]>([])
    const selectedKeys = ref<string[]>([])
    const checkedKeys = ref<string[]>([])
    const expandedKeys = ref<string[]>([])
    const allKeys = ref<string[]>([])
    const treeData = ref<TreeDataItem[]>([])
    const nodeToParentKeyMap: Record<string, 'root' | string | string[]> = {}
    const hasPermissionToDnD = ref(true)
    const defaultBody = ref({})
    const updateList = inject('updateList')
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
            suppressLogs: true,
        }
    }
    const { data, mutate, isLoading, error, isReady } = useIndexSearch<
        Category | Term
    >(defaultBody, dependentKey, false, false, 1)

    const sortTermsAndCategories = (children) => {
        children.sort((a, b) => {
            if (a?.displayText?.toLowerCase() < b?.displayText?.toLowerCase())
                return -1
            if (a?.displayText?.toLowerCase() > b?.displayText?.toLowerCase())
                return 1
            return 0
        })
        const terms = children?.filter(
            (el) => el?.typeName === 'AtlasGlossaryTerm'
        )
        const categories = children?.filter(
            (el) => el?.typeName === 'AtlasGlossaryCategory'
        )
        return [...categories, ...terms]
    }
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
                        disabled: disabledGuids.includes(i.guid),
                        parent: {
                            displayText: treeNode?.attributes?.name,
                            guid: treeNode?.guid,
                            qualifiedName: treeNode?.attributes?.qualifiedName,
                            typeName: treeNode?.typeName,
                        },
                    }))
                    if (data.value && map) {
                        map?.forEach((el) => {
                            allKeys.value.push(
                                `${treeNode.attributes?.qualifiedName}_${el.attributes?.qualifiedName}`
                            )
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
                        treeNode.dataRef.children.push(
                            ...sortTermsAndCategories(map)
                        )

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
                treeData.value = [...treeData.value] // maintains reactivity of tree
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
                            disabled: disabledGuids.includes(i.guid),
                            parent: {
                                displayText: treeNode?.attributes?.name,
                                guid: treeNode?.guid,
                                qualifiedName:
                                    treeNode?.attributes?.qualifiedName,
                                typeName: treeNode?.typeName,
                            },
                        }))
                        if (map) {
                            map?.forEach((el) => {
                                allKeys.value.push(
                                    `${treeNode.attributes?.qualifiedName}_${el.attributes?.qualifiedName}`
                                )

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
                            treeNode.dataRef.children.push(
                                ...sortTermsAndCategories(map)
                            )
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
                    treeData.value = [...treeData.value] // maintains reactivity of tree
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
        selectedKeys.value = []
        selectedKeys.value.push(event?.node?.key)
        const selectedTerm = selectedKeys.value[0]?.split('_')[1]

        allKeys.value?.forEach((el) => {
            if (
                el?.endsWith(selectedTerm) &&
                !selectedKeys.value?.includes(el)
            ) {
                selectedKeys.value.push(el)
            }
        })

        emit('select', event.node.dataRef)
    }

    const glossaryStore = useGlossaryStore()

    const glossaryList = computed(() => glossaryStore.list)

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
                            allKeys.value.push(
                                `${defaultGlossaryQf}_${el.attributes?.qualifiedName}`
                            )
                        })
                        const rootTermsAndCategories = data.value?.entities.map(
                            (i) => ({
                                ...i,
                                id: `${defaultGlossaryQf}_${i.attributes?.qualifiedName}`,
                                key: `${defaultGlossaryQf}_${i.attributes?.qualifiedName}`,
                                isLeaf: i.typeName === 'AtlasGlossaryTerm',
                                checkable:
                                    i.typeName === 'AtlasGlossaryTerm'
                                        ? checkable
                                        : false,
                                disabled: disabledGuids.includes(i.guid),
                            })
                        )
                        treeData.value = sortTermsAndCategories(
                            rootTermsAndCategories
                        )
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
                allKeys.value.push(
                    `${defaultGlossaryQf}_${i.attributes?.qualifiedName}`
                )

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

    const { getAnchorQualifiedName, getAnchorGuid } = useAssetInfo()

    const recursivelyAddOrDeleteNode = async (
        asset,
        guid,
        action,
        updateChildrenOnDelete = true
    ) => {
        let parentStack: string[]

        const updateNodeNested = async (node: TreeDataItem) => {
            const currentPath = parentStack.pop()
            // if the target node is reached
            if (node.key === guid || !currentPath || node.guid === guid) {
                const updatedChildren: TreeDataItem[] = []
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

                    const found = node?.children?.find(
                        (el) => el?.guid === asset?.guid
                    )
                    if (!found)
                        updatedChildren.push({
                            ...asset,
                            id: `${node.attributes?.qualifiedName}_${asset.attributes?.qualifiedName}`,
                            key: `${node.attributes?.qualifiedName}_${asset.attributes?.qualifiedName}`,
                            isLeaf: asset.typeName === 'AtlasGlossaryTerm',
                            parent: {
                                displayText: node?.attributes?.name,
                                guid: node?.guid,
                                qualifiedName: node?.attributes?.qualifiedName,
                                typeName: node?.typeName,
                            },
                        })
                    if (loadMoreNode) {
                        updatedChildren.push(loadMoreNode)
                    }
                }
                if (action === 'delete') {
                    node?.children?.forEach((element) => {
                        // reOrder children to root if deleting a category
                        if (
                            (asset?.typeName === 'AtlasGlossaryCategory' ||
                                asset?.value?.typeName ===
                                    'AtlasGlossaryCategory') &&
                            (element?.guid === asset?.guid ||
                                element?.guid === asset?.value?.guid) &&
                            updateChildrenOnDelete
                        ) {
                            if (element?.children?.length) {
                                const updatedChildren =
                                    getUpdatedChildrenOnCategoryDelete(
                                        element?.guid,
                                        element?.children
                                    )
                                console.log(updatedChildren)
                                if (parentGlossaryQualifiedName?.value !== '') {
                                    treeData.value.push(...updatedChildren)
                                } else {
                                    treeData.value.forEach((i) => {
                                        if (
                                            i.guid ===
                                            element?.attributes?.anchor?.guid
                                        ) {
                                            i.children?.push(...updatedChildren)
                                        }
                                    })
                                }

                                // element?.children?.forEach((el) => {
                                //     if (el?.typeName !== 'cta') {
                                //         if (
                                //             parentGlossaryQualifiedName?.value !==
                                //             ''
                                //         ) {
                                //             treeData.value.push(el)
                                //         } else {
                                //             treeData.value.forEach((i) => {
                                //                 if (
                                //                     i.guid ===
                                //                     element?.attributes?.anchor
                                //                         ?.guid
                                //                 ) {
                                //                     console.log(el)
                                //                     i.children?.push(el)
                                //                 }
                                //             })
                                //         }
                                //     }
                                // })
                            }
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

    const getUpdatedChildrenOnCategoryDelete = (
        categoryGuid: String,
        children
    ) => {
        const updatedChildren: TreeDataItem[] = []
        children.forEach((el) => {
            if (el?.typeName === 'AtlasGlossaryCategory') {
                if (el?.parentCategory) el.parentCategory = null
                updatedChildren.push(el)
            } else if (el?.typeName === 'AtlasGlossaryTerm') {
                el.attributes.categories = el?.attributes?.categories?.filter(
                    (i) => i?.guid !== categoryGuid
                )
                if (!el?.attributes?.categories?.length)
                    updatedChildren.push(el)
            }
        })
        return updatedChildren
    }
    const deleteNode = (asset, guid, updateChildrenOnDelete = true) => {
        if (guid === 'root') {
            const updatedTreeData = []
            treeData.value.forEach((el) => {
                if (el?.guid === asset?.guid) {
                    if (
                        el?.typeName === 'AtlasGlossaryCategory' &&
                        updateChildrenOnDelete &&
                        el?.children
                    ) {
                        const updatedChildren =
                            getUpdatedChildrenOnCategoryDelete(
                                el?.guid,
                                el?.children
                            )
                        console.log(updatedChildren)
                        updatedTreeData.push(...updatedChildren)
                    }
                } else updatedTreeData.push(el)
            })

            treeData.value = updatedTreeData
        } else {
            recursivelyAddOrDeleteNode(
                asset,
                guid,
                'delete',
                updateChildrenOnDelete
            )
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
                    treeData.value.push({
                        ...asset,
                        id: asset.attributes?.qualifiedName,
                        key: asset.attributes?.qualifiedName,
                        isLeaf: false,
                    })
                }

                if (
                    asset.typeName === 'AtlasGlossaryTerm' ||
                    asset.typeName === 'AtlasGlossaryCategory'
                ) {
                    treeData.value.push({
                        ...asset,
                        id: `${getAnchorQualifiedName(asset)}_${
                            asset.attributes?.qualifiedName
                        }`,
                        key: `${getAnchorQualifiedName(asset)}_${
                            asset.attributes?.qualifiedName
                        }`,
                        isLeaf: asset.typeName === 'AtlasGlossaryTerm',
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
                !existingCategories?.find(
                    (existing) => existing?.guid === category?.guid
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

        // handles root to some category
        if (!existingCategories?.length && addedCategories?.length) {
            setTimeout(() => {
                if (parentGlossaryQualifiedName?.value !== '') {
                    deleteNode(asset, 'root')
                } else deleteNode(asset, asset?.attributes?.anchor)
            }, 0)
        }
        //  handles removal of all categories
        if (!newCategories?.length && removedCategories?.length) {
            setTimeout(() => {
                if (parentGlossaryQualifiedName?.value !== '') {
                    addNode(asset)
                } else addNode(asset, asset?.attributes?.anchor)
            }, 0)
        }
    }

    const updateNode = (asset, updateCategories = true) => {
        const currentParents = nodeToParentKeyMap[asset?.guid]
        if (currentParents) {
            if (
                currentParents === 'root' ||
                (typeof currentParents !== 'string' &&
                    currentParents?.find((parent) => parent === 'root'))
            ) {
                treeData.value = treeData.value.map((treeNode) => {
                    if (treeNode.guid === asset?.guid) {
                        if (updateCategories)
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
                        if (updateCategories)
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

    // handles confirm drag and drop
    const confirmDragAndDrop = ({ event, node, dragNode, dragNodesKeys }) => {
        const assetToDrop = { ...dragNode.dataRef }
        const updateDragNodeAttributes = (newParent) => {
            const selectedAsset = ref(assetToDrop)
            const {
                localCategories,
                localParentCategory,
                handleParentCategoryUpdate,
                handleCategoriesUpdate,
                error: updateError,
                asset,
            } = updateAssetAttributes(selectedAsset)
            if (dragNode?.typeName === 'AtlasGlossaryTerm') {
                const newCategories = localCategories.value?.filter(
                    (el) => el.guid !== dragNode?.parent?.node?.guid
                )
                if (node?.typeName !== 'AtlasGlossary' && newParent?.guid)
                    newCategories.push(newParent)
                localCategories.value = newCategories
                console.log(newParent)
                handleCategoriesUpdate()
            }
            if (dragNode?.typeName === 'AtlasGlossaryCategory') {
                const parentCategory = {
                    guid: newParent?.guid,
                }
                console.log(newParent)
                if (newParent?.typeName === 'AtlasGlossary') {
                    parentCategory.guid = null
                }
                localParentCategory.value = parentCategory
                handleParentCategoryUpdate()
            }
            whenever(updateError, () => {
                setTimeout(() => {
                    deleteNode(assetToDrop, newParent?.guid ?? 'root', false)
                }, 0)
                setTimeout(() => {
                    addNode(assetToDrop, dragNode?.parent?.node)
                }, 0)
            })
            whenever(asset, () => {
                if (asset.value) {
                    // updateNode(asset.value)
                    console.log(updateList)
                    if (updateList) updateList(asset.value)
                }
            })
        }

        console.log(node)
        console.log(assetToDrop)

        const assetToDropParentQf = assetToDrop?.key?.split('_')[0]
        const nodeParentQf = node?.key?.split('_')[0]
        if (assetToDrop?.typeName === 'AtlasGlossary') {
            message.error(
                `Cannot reorder a Glossary. Try reordering a term/category instead.`,
                2
            )
        } else if (node?.typeName === 'AtlasGlossaryTerm') {
            const parentStack = recursivelyFindPath(node?.guid)[0]
            if (assetToDropParentQf === nodeParentQf) {
                message.error(`Term already a part of this category`, 2)
                return
            }

            const parentOfTerm = {
                guid: parentStack[1],
            }
            if (
                treeData.value?.find((el) => el.guid === parentOfTerm?.guid) &&
                parentGlossaryQualifiedName?.value === ''
            )
                parentOfTerm.guid = ''
            setTimeout(() => {
                deleteNode(
                    assetToDrop,
                    dragNode?.parent?.node?.guid ?? 'root',
                    false
                )
            }, 0)

            if (parentStack[1]) {
                setTimeout(() => {
                    addNode(assetToDrop, { guid: parentStack[1] })
                }, 0)
            } else {
                setTimeout(() => {
                    addNode(assetToDrop)
                }, 0)
            }
            updateDragNodeAttributes(parentOfTerm)
        } else {
            let nodeParentGlossaryGuid
            if (
                assetToDropParentQf === node?.qualifiedName ||
                assetToDropParentQf === node?.attributes?.qualifiedName
            ) {
                message.error(`Term already a part of this category`, 2)
                return
            }

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
                        dragNode?.parent?.node?.guid ?? 'root',
                        false
                    )
                }, 0)
                setTimeout(() => {
                    addNode(assetToDrop, node)
                }, 0)

                updateDragNodeAttributes(node?.dataRef)
            }
        }
    }

    // handles drag and drop confirmation
    const handleDragAndDropModal = ({
        event,
        node,
        dragNode,
        dragNodesKeys,
    }) => {
        let modalText = `Moving ${dragNode?.displayText} from ${node?.displayText}`
        const assetToDrop = { ...dragNode.dataRef }
        const assetToDropInto = { ...node.dataRef }
        let dragNodeName, dragNodeType, parentType, parentName
        dragNodeName = dragNode?.displayText
        dragNodeType = dragNode?.typeName
        if (node?.typeName !== 'AtlasGlossaryTerm') {
            modalText = `Moving ${dragNode?.displayText} into ${assetToDropInto?.displayText}`
            parentName = assetToDropInto?.displayText
            parentType = assetToDropInto?.typeName
        } else if (assetToDropInto?.parent?.displayText) {
            modalText = `Moving ${dragNode?.displayText} into ${assetToDropInto?.parent?.displayText}`
            parentName = assetToDropInto?.parent?.displayText
            parentType = assetToDropInto?.parent?.typeName
        } else if (!assetToDropInto?.parent) {
            modalText = `Moving ${dragNode?.displayText} into ${assetToDropInto?.attributes?.anchor?.attributes?.name}`
            parentName = assetToDropInto?.attributes?.anchor?.attributes?.name
            parentType = 'AtlasGlossary'
        }
        Modal.confirm({
            title: `Confirm changes`,
            okText: 'Confirm',
            cancelButtonProps: { type: 'default' },
            okButtonProps: { type: 'primary', class: 'bg-primary' },
            maskClosable: true,
            keyboard: true,
            cancelText: 'Cancel',
            autoFocusButton: 'ok',
            icon: null,
            content: h(DnDConfirmationModalContent, {
                dragNodeName,
                dragNodeType,
                parentName,
                parentType,
            }),
            onOk() {
                console.log('OK')
                confirmDragAndDrop({ event, node, dragNode, dragNodesKeys })
            },
            onCancel() {
                console.log('Cancel d&d')
                console.log(assetToDropInto)
            },
        })
    }

    // handles start of drag event
    // being used to evaluate permissions
    const dragStart = ({ event, node }) => {
        hasPermissionToDnD.value = true
        console.log(node)
        const parentGlossary = computed(() => {
            return {
                guid: getAnchorGuid(node?.dataRef),
                typeName: 'AtlasGlossary',
            }
        })
        const { entityUpdatePermission, fetch, isEvaluating } =
            fetchGlossaryPermission(parentGlossary, false)
        fetch()
        const updatePermission = () => {
            console.log(entityUpdatePermission.value)
            if (entityUpdatePermission !== undefined)
                hasPermissionToDnD.value = entityUpdatePermission.value
        }
        updatePermission()
        watch(entityUpdatePermission, () => {
            updatePermission()
        })
    }

    const dragAndDropNode = ({ event, node, dragNode, dragNodesKeys }) => {
        if (!hasPermissionToDnD.value) {
            message.error(`You don't have permission to perform this action`)
            return
        }
        let nodeParentGlossaryGuid
        if (node?.typeName === 'AtlasGlossary')
            nodeParentGlossaryGuid = node?.guid
        else nodeParentGlossaryGuid = node?.attributes?.anchor?.guid
        if (
            nodeParentGlossaryGuid !==
            dragNode?.dataRef?.attributes?.anchor?.guid
        ) {
            message.error(`Cannot change parent Glossary`)
            return
        }

        if (dragNode?.typeName === 'AtlasGlossary') {
            message.error(
                `Cannot reorder a Glossary. Try reordering a term/category instead.`,
                2
            )
            return
        } else if (node?.typeName === 'AtlasGlossaryTerm') {
            const assetToDropParentQf = dragNode?.key?.split('_')[0]
            const nodeParentQf = node?.key?.split('_')[0]

            if (assetToDropParentQf === nodeParentQf) {
                message.error(
                    `${
                        dragNode?.typeName === 'AtlasGlossaryTerm'
                            ? 'Term'
                            : 'Category'
                    } already a part of this category`,
                    2
                )
                return
            }
        }

        // show confirmation modal for d&d
        handleDragAndDropModal({ event, node, dragNode, dragNodesKeys })
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
                    disabled: disabledGuids.includes(i.guid),
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

    const checkDuplicateCategoryNames = (
        parentCategoryGuid: string,
        name: string
    ): boolean => {
        let parentStack: string[]
        let nameExists: boolean = false

        const checkDuplicate = (node: TreeDataItem) => {
            const currentPath = parentStack.pop()

            // if the target node is reached
            if (
                node.key === parentCategoryGuid ||
                !currentPath ||
                node.guid === parentCategoryGuid
            ) {
                if (node.children && node.children.length) {
                    const index =
                        node.children.findIndex((child) => {
                            return (
                                child?.attributes?.name === name &&
                                child?.typeName === 'AtlasGlossaryCategory'
                            )
                        }) ?? 0
                    nameExists = index > -1
                }
            }

            // eslint-disable-next-line no-restricted-syntax
            for (const childNode of node?.children ?? []) {
                // if the current node is in the path that is needed to reach the target node
                if (
                    childNode.key === currentPath ||
                    childNode.guid === currentPath
                ) {
                    checkDuplicate(childNode)
                }
            }
        }

        if (parentCategoryGuid) {
            // find the path to the node
            parentStack = recursivelyFindPath(parentCategoryGuid)[0]
            const parent = parentStack?.pop()
            for (const node of treeData.value) {
                if (node.key === parent || node.guid === parent) {
                    checkDuplicate(node)
                }
            }
        } else {
            const index =
                treeData.value.findIndex(
                    (child) =>
                        child?.attributes.name === name &&
                        child?.typeName === 'AtlasGlossaryCategory'
                ) ?? 0
            nameExists = index > -1
        }

        return nameExists
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
        nodeToParentKeyMap,
        allKeys,
        checkDuplicateCategoryNames,
        dragStart,
    }
}

export default useGlossaryTree
