import { Components } from '~/types/atlas/client'

interface BaseAttributes {
    __createdBy: string
    __guid: string
    __modificationTimestamp: Number
    __modifiedBy: string
    __state: string
    __timestamp: Number
}
export interface RelatedEntity {
    guid: string
    typeName: string
    uniqueAttributes: {
        qualifiedName: string
    },
    attributes?: {
        name
    }
}

// GTC Entity Attributes
interface GlossaryAttributes extends BaseAttributes {
    qualifiedName: string
    name: string
    shortDescription?: string
    description?: string
    longDescription?: string
    certificateStatus?: 'DRAFT' | 'VERIFIED' | 'ISSUE'
    assetStatusMessage: string
    certificateUpdatedBy?: string
    certificateUpdatedAt?: 0
    ownerUsers?: string[]
    ownerGroups?: string[]
    terms?: RelatedEntity[]
    categories?: RelatedEntity[]
}
type CategoryAttributes = Omit<GlossaryAttributes, 'categories'> & {
    parentCategory: RelatedEntity
    anchor: RelatedEntity
    childrenCategories: RelatedEntity[]
}
type TermAttributes = Omit<GlossaryAttributes, 'terms'> & {
    synonyms?: RelatedEntity
    antonyms?: RelatedEntity
    preferredTerms?: RelatedEntity
    preferredToTerms?: RelatedEntity
    replacementTerms?: RelatedEntity
    replacedBy?: RelatedEntity
    translationTerms?: RelatedEntity
    translatedTerms?: RelatedEntity
    isA?: RelatedEntity
    classifies?: RelatedEntity
    validValues?: RelatedEntity
    validValuesFor?: RelatedEntity
    seeAlso?: RelatedEntity
    assignedEntities?: RelatedEntity[]
    anchor: RelatedEntity
}

// GTC Entity types
export type Glossary = Omit<
    Components.Schemas.AtlasEntityHeader,
    'attributes' | 'typeName'
> & {
    attributes: GlossaryAttributes
    typeName: 'AtlasGlossary'
}
export type Category = Omit<
    Components.Schemas.AtlasEntityHeader,
    'attributes' | 'typeName'
> & {
    attributes: CategoryAttributes
    typeName: 'AtlasGlossaryCategory'
}
export type Term = Omit<
    Components.Schemas.AtlasEntityHeader,
    'attributes' | 'typeName'
> & {
    attributes: TermAttributes
    typeName: 'AtlasGlossaryTerm'
}
