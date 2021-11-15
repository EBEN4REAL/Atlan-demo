import { watch, ref, Ref, onMounted } from 'vue'
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
    const relationAttributes = ref([])
    const preference = ref({
        sort: 'name.keyword-asc',
    })

    const loadedKeys = ref<string[]>([])

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

    const { data, mutate } = useIndexSearch<assetInterface>(
        defaultBody,
        dependentKey,
        false,
        false,
        1
    )

    const onLoadData = async (treeNode: any) => {
        treeNode.dataRef.isOpen = true

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
                if (!treeNode.dataRef.children) {
                    treeNode.dataRef.children = []
                }

                let map = data.value?.entities.map((i) => ({
                    ...i,
                    id: `${treeNode.attributes?.qualifiedName}_${i.attributes?.qualifiedName}`,
                    key: `${treeNode.attributes?.qualifiedName}_${i.attributes?.qualifiedName}`,
                    isLeaf: i.typeName === 'AtlasGlossaryTerm',
                }))
                if (map) {
                    treeNode.dataRef.children.push(...map)
                    loadedKeys.value.push(treeNode.dataRef.key)
                }
            } catch (e) {
                console.log(e)
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
                if (!treeNode.dataRef.children) {
                    treeNode.dataRef.children = []
                }

                if (data.value?.entities) {
                    let map = data.value?.entities?.map((i) => ({
                        ...i,
                        id: i.attributes?.qualifiedName,
                        key: i.attributes?.qualifiedName,
                        isLeaf: i.typeName === 'AtlasGlossaryTerm',
                    }))
                    if (map) {
                        treeNode.dataRef.children.push(...map)
                        loadedKeys.value.push(treeNode.dataRef.key)
                    }
                } else {
                    treeNode.dataRef.children = null
                    treeNode.dataRef.isLeaf = true
                }
            } catch (e) {
                console.log(e)
            }
        }
    }

    // watch(data, () => {
    //     console.log(data.value?.entities)
    //     if (data.value?.entities) {
    //         let map = data.value?.entities.map((i) => ({
    //             ...i,
    //             id: i.attributes?.qualifiedName,
    //             key: i.guid,

    //             isLeaf: false,
    //         }))
    //         baseTreeData.value.push(...map)
    //     }

    //     baseTreeData.value = [...baseTreeData.value]

    //     console.log(baseTreeData)
    //     // if (offset?.value > 0) {
    //     //     if (data.value?.entities) {
    //     //         list.value.push(...data.value?.entities)
    //     //     }
    //     // } else {
    //     //     if (data.value?.entities) {
    //     //         list.value = [...data?.value?.entities]
    //     //     } else {
    //     //         list.value = []
    //     //     }
    //     // }
    // })

    return {
        onLoadData,

        generateBody,
        data,
        loadedKeys,
    }
}

export default useGlossaryTree
