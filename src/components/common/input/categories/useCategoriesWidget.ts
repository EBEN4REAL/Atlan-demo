import { ref } from 'vue'
import { TreeDataItem } from 'ant-design-vue/lib/tree/Tree'

import { useBody } from '~/composables/discovery/useBody'
import useIndexSearch from '~/composables/discovery/useIndexSearch'

import {
    AssetAttributes,
    InternalAttributes,
    GlossaryAttributes,
} from '~/constant/projection'
import {
    Category,
} from '~/types/glossary/glossary.interface'

interface Params {
    parentGlossaryQf: string
}

const useCategoriesWidget = ({
    parentGlossaryQf
}: Params) => {
    // Initialisations
    const limit = ref(20)
    const offset = ref(0)

    const attributes = ref([
        ...InternalAttributes,
        ...AssetAttributes,
        ...GlossaryAttributes,
        'childrenCategories'
    ])
    const relationAttributes = ref(['name', 'categories'])
    const preference = ref({
        sort: 'name.keyword-asc',
    })
    const dependentKey = ref(null)
    const facets = ref({
        typeNames: ['AtlasGlossaryCategory'],
        glossary: parentGlossaryQf,
        isRootCategory: true,
        parentCategory: '',
    })

    const treeData = ref<TreeDataItem[]>([])
    const body = ref({})
    const generateBody = () => {
        const dsl = useBody(
            '',
            offset?.value,
            limit?.value,
            facets?.value,
            {},
            [],
            preference?.value
        )
        body.value = {
            dsl,
            attributes: attributes?.value,
            relationAttributes: relationAttributes?.value,
        }
    }

    const { data, mutate, isLoading, error, isReady } =
    useIndexSearch<Category>(
        body,
        dependentKey,
        false,
        false,
        1
    )

    const initCategories = async () => {
        facets.value = {
            typeNames: ['AtlasGlossaryCategory'],
            glossary: parentGlossaryQf,
            isRootCategory: true,
        }
        generateBody()
        try {
            await mutate()
            treeData.value = []
            if (data.value?.entities) {
                treeData.value = data.value?.entities.map((category) => ({
                    ...category,
                    key: category.guid,
                    value: category.guid,
                    title: category.displayText,
                    isLeaf: category.attributes?.childrenCategories?.length ? false : true,
                    checkable: true,
                }))
            }
        } catch (e) {
            console.log(e)
            treeData.value = []
        }
    }

    const onLoadData = async (treeNode) => {
        facets.value = {
            typeNames: ['AtlasGlossaryCategory'],
            glossary: parentGlossaryQf,
            parentCategory: treeNode.dataRef.attributes?.qualifiedName as string,
            isRootCategory: false
        }

        generateBody()

        try {
            await mutate()
            if (error.value) {
                treeNode.dataRef.isLoading = false
                treeNode.dataRef.isError = error
            } else {
                if (!treeNode.dataRef.children) {
                    treeNode.dataRef.children = []
                }
                if (data.value?.entities) {
                    data.value?.entities?.forEach((category) => {
                        treeNode.dataRef.children.push({
                            ...category,
                            value: category.guid,
                            key: category.guid,
                            title: category.displayText,
                            isLeaf: category.attributes?.childrenCategories?.length ? false : true,
                            checkable:true,
                        })
                    })

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

    return {
        treeData,
        initCategories,
        onLoadData,
    }
}

export default useCategoriesWidget;