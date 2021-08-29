import { Components } from "~/api/atlas/client";

interface BaseAttributes {
    __createdBy: String;
    __guid: String;
    __modificationTimestamp: Number;
    __modifiedBy: String
    __state: String
    __timestamp: Number
}
interface RelatedEntity {
    guid: string,
    typeName: String,
    uniqueAttributes: {
        qualifiedName: String
    }
}

// GTC Entity Attributes
interface GlossaryAttributes extends BaseAttributes {
    qualifiedName: String,
    name: String,
    shortDescription?: String,
    assetStatus?: "draft" | "verified" | "issue",
    assetStatusUpdatedBy?: String,
    assetStatusUpdatedAt?: 0,
    ownerUsers?: String
    ownerGroups?: String
    terms?: RelatedEntity[],
    categories?: RelatedEntity[],
}
type CategoryAttributes = Omit<GlossaryAttributes, 'categories'> & {
    parentCategory: RelatedEntity;
    anchor: RelatedEntity;
}
type TermAttributes = Omit<GlossaryAttributes, 'terms'> & {
    synonyms?: RelatedEntity;
    antonyms?: RelatedEntity;
    preferredTerms?: RelatedEntity;
    preferredToTerms?: RelatedEntity;
    replacementTerms?: RelatedEntity;
    replacedBy?: RelatedEntity;
    translationTerms?: RelatedEntity;
    translatedTerms?: RelatedEntity;
    isA?: RelatedEntity;
    classifies?: RelatedEntity;
    validValues?: RelatedEntity;
    validValuesFor?: RelatedEntity;
    seeAlso?: RelatedEntity;
    assignedEntities?: RelatedEntity[];
    anchor: RelatedEntity;
}

// GTC Entity types
export type Glossary = Omit<Components.Schemas.AtlasEntityHeader, 'attributes' | 'typeName'> & {
    attributes: GlossaryAttributes;
    typeName: 'AtlasGlossary';
}
export type Category = Omit<Components.Schemas.AtlasEntityHeader, 'attributes' | 'typeName'> & {
    attributes: CategoryAttributes;
    typeName: 'AtlasGlossaryCategory';
}
export type Term = Omit<Components.Schemas.AtlasEntityHeader, 'attributes' | 'typeName'> & {
    attributes: TermAttributes;
    typeName: 'AtlasGlossaryTerm';
}