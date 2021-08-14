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
    guid: String,
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
    parentCategories: RelatedEntity[]
}
type TermAttributes = Omit<GlossaryAttributes, 'terms'>

// GTC Entity types
export type Glossary = Omit<Components.Schemas.AtlasEntityHeader, 'attributes'> & {
    attributes: GlossaryAttributes
}
export type Category = Omit<Components.Schemas.AtlasEntityHeader, 'attributes'> & {
    attributes: CategoryAttributes
}
export type Term = Omit<Components.Schemas.AtlasEntityHeader, 'attributes'> & {
    attributes: TermAttributes
}