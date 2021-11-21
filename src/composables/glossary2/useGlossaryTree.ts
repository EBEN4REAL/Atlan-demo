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
import { AssetAttributes, InternalAttributes } from '~/constant/projection'
import { useBody } from '../discovery/useBody'
import useIndexSearch from '../discovery/useIndexSearch'
import { assetInterface } from '~/types/assets/asset.interface'
import useAssetInfo from '~/composables/discovery/useAssetInfo'

interface UseTreeParams {
    emit?: any
    parentGlossaryGuid?: Ref<string | undefined>
    optimisticUpdate?: boolean
    filterMode?: boolean
    cacheKey?: string
    isAccordion?: boolean
    nodesKey?: 'qualifiedName' | 'guid'
}

const useGlossaryTree = ({
    emit,
    optimisticUpdate = true,
    filterMode = false,
    cacheKey,
    isAccordion,
    parentGlossaryGuid,
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
    const attributes = ref([...InternalAttributes, ...AssetAttributes])
    const relationAttributes = ref(['name'])
    const preference = ref({
        sort: 'name.keyword-asc',
    })

    const loadedKeys = ref<string[]>([])
    const expandedKeys = ref<string[]>([])
    const selectedKeys = ref<string[]>([])
    const treeData = ref<TreeDataItem[]>([])

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
                    }))
                    if (map) {
                        treeNode.dataRef.children.push(...map)
                        loadedKeys.value.push(treeNode.dataRef.key)
                    } else {
                        loadedKeys.value.push(treeNode.dataRef.key)
                    }
                    treeNode.dataRef.isLoading = false
                    treeNode.dataRef.isError = null
                }
            } catch (e) {
                console.log('dd')
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
                        }))
                        if (map) {
                            treeNode.dataRef.children.push(...map)
                            loadedKeys.value.push(treeNode.dataRef.key)
                        } else {
                            loadedKeys.value.push(treeNode.dataRef.key)
                        }
                    } else {
                        treeNode.dataRef.children = null
                        treeNode.dataRef.isLeaf = true
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
        console.log('select')
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
                        treeData.value = data.value?.entities.map((i) => ({
                            ...i,
                            id: `${defaultGlossaryQf}_${i.attributes?.qualifiedName}`,
                            key: `${defaultGlossaryQf}_${i.attributes?.qualifiedName}`,
                            isLeaf: i.typeName === 'AtlasGlossaryTerm',
                        }))
                    }
                } catch (e) {
                    console.log(e)
                    treeData.value = []
                }
            }
        } else {
            treeData.value = glossaryList.value.map((i) => {
                let isLeafFlag = false
                if (i.termsCount === 0 && i.categoryCount === 0) {
                    isLeafFlag = true
                }
                return {
                    ...i,
                    id: i.attributes?.qualifiedName,
                    key: i.attributes?.qualifiedName,
                    isLeaf: isLeafFlag,
                }
            })
        }
    }

    const { getAnchorQualifiedName } = useAssetInfo()

    const addNode = (asset): TreeDataItem => {
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
    }
}

export default useGlossaryTree
