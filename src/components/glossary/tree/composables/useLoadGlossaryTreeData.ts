import { Ref, ref } from 'vue'

import { Glossary, Category, Term } from '~/types/glossary/glossary.interface'
import { BasicSearchResponse } from '~/types/common/atlasSearch.interface'
import { projection } from '~/api/atlas/utils'

import { useAPIPromise } from '~/services/api/useAPI'
import { KeyMaps } from '~/api/keyMap'
import { BaseAttributes, BasicSearchAttributes } from '~/constant/projection'

const attributes = [
    ...projection,
    'database',
    'atlanSchema',
    'metadata',
    'certificateStatus',
    'shortDescription',
    'parentCategory',
    'categories',
    'terms',
    'childrenCategories',
    'pageviewCount',
    'anchor',
    'ownerUsers',
    'ownerGroups',
    'readme',
    'assignedEntities',
    ...BaseAttributes,
    ...BasicSearchAttributes,
];

const useLoadGlossaryTreeData = () => {
    const defaultLimit = 10;

    const getRootCategories = async (glossaryQualifiedName: Ref<string>, offset?: number) => {
        const body = {
            dsl: {
                size: defaultLimit,
                from: offset ?? 0,
                query: {
                    bool: {
                        filter: [
                            {
                                wildcard: {
                                    qualifiedName: `*${glossaryQualifiedName}`
                                }
                            },
                            {
                                term: {
                                    "__typeName.keyword":  "AtlasGlossaryCategory"
                                }
                            }
                        ],
                        must_not: [
                            {
                                exists: {
                                    field: "__categories"
                                }
                            }
                        ]
                    }
                }
            },
            attributes
        }
        return useAPIPromise(KeyMaps.insights.BASIC_SEARCH(), 'POST', {
            body,
        }) as Promise<BasicSearchResponse<Category>>
    }
    const getRootTerms = async (glossaryQualifiedName: Ref<string>, offset?: number) => {
        const body = {
            dsl: {
                size: defaultLimit,
                from: offset ?? 0,
                query: {
                    bool: {
                        filter: [
                            {
                                wildcard: {
                                    qualifiedName: `*${glossaryQualifiedName}`
                                }
                            },
                            {
                                term: {
                                    "__typeName.keyword": "AtlasGlossaryTerm"
                                }
                            }
                        ],
                        must_not: [
                            {
                                exists: {
                                    field: "__categories"
                                }
                            }
                        ]
                    }
                }
            },
            attributes
        }
        return useAPIPromise(KeyMaps.insights.BASIC_SEARCH(), 'POST', {
            body,
        }) as Promise<BasicSearchResponse<Term>>
    }
    const getSubCategories = async (categoryQualifiedName: Ref<string>, offset?: number) => {
        const body = {
            dsl: {
                size: defaultLimit,
                from: offset ?? 0,
                query: {
                    bool: {
                        filter: [
                            {
                                term: {
                                    "__typeName.keyword": "AtlasGlossaryCategory"
                                }
                            },
                            {
                                terms: {
                                    __categories: [
                                        categoryQualifiedName.value
                                    ]
                                }
                            }
                        ],
                    }
                }
            },
            attributes
        }
        return useAPIPromise(KeyMaps.insights.BASIC_SEARCH(), 'POST', {
            body,
        }) as Promise<BasicSearchResponse<Category>>
    }
    const getSubTerms = async (categoryQualifiedName: Ref<string>, offset?: number) => {
        const body = {
            dsl: {
                size: defaultLimit,
                from: offset ?? 0,
                query: {
                    bool: {
                        filter: [
                            {
                                term: {
                                    "__typeName.keyword": "AtlasGlossaryTerm"
                                }
                            },
                            {
                                terms: {
                                    __categories: [
                                        categoryQualifiedName.value
                                    ]
                                }
                            }
                        ],
                    }
                }
            },
            attributes
        }
        return useAPIPromise(KeyMaps.insights.BASIC_SEARCH(), 'POST', {
            body,
        }) as Promise<BasicSearchResponse<Term>>
    }
   
    return {
        getRootCategories,
        getRootTerms,
        getSubCategories,
        getSubTerms
    }
}

export default useLoadGlossaryTreeData
