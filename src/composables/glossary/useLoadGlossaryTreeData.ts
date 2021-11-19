import { Ref, ref } from 'vue'

import { Glossary, Category, Term } from '~/types/glossary/glossary.interface'
import { BasicSearchResponse } from '~/types/common/atlasSearch.interface'

import { Search } from '~/services/meta/search'
import { useAPIPromise } from '~/services/api/useAPIPromise'
import { map } from '~/services/meta/search/key'
import { InternalAttributes, AssetAttributes } from '~/constant/projection'

const attributes = [
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
    ...InternalAttributes,
    ...AssetAttributes,
];

interface AdditionalParams {
    offset?: number;
    limit?: number;
}

const useLoadGlossaryTreeData = () => {
    const defaultLimit = 2;

    const getRootCategories = async (glossaryQualifiedName: Ref<string>, { limit, offset }: AdditionalParams) => {
        const body = {
            dsl: {
                size: limit ?? defaultLimit,
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
        return Search.IndexSearchPromise<Category>(body)
    }
    const getAllCategories = async (glossaryQualifiedName: string, { limit, offset }: AdditionalParams) => {
        const body = {
            dsl: {
                size: 100,
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
                        ]
                    }
                }
            },
            attributes
        }
        return Search.IndexSearchPromise<Category>(body)
    }
    const getRootTerms = async (glossaryQualifiedName: string, { limit, offset }: AdditionalParams) => {
        const body = {
            dsl: {
                size: limit ?? defaultLimit,
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
        return Search.IndexSearchPromise<Term>(body)
    }
    const getSubCategories = async (categoryQualifiedName: string, { limit, offset }: AdditionalParams) => {
        const body = {
            dsl: {
                size: limit ?? defaultLimit,
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
                                        categoryQualifiedName
                                    ]
                                }
                            }
                        ],
                    }
                }
            },
            attributes
        }
        return Search.IndexSearchPromise<Category>(body)
    }
    const getSubTerms = async (categoryQualifiedName: string, { limit, offset }: AdditionalParams) => {
        const body = {
            dsl: {
                size: limit ?? defaultLimit,
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
                                        categoryQualifiedName
                                    ]
                                }
                            }
                        ],
                    }
                }
            },
            attributes
        }
        return Search.IndexSearchPromise<Term>(body)
    }
   
    return {
        getRootCategories,
        getRootTerms,
        getSubCategories,
        getSubTerms,
        getAllCategories
    }
}

export default useLoadGlossaryTreeData
