import { ClassificationInterface } from '~/types/classifications/classification.interface'

export interface TypedefsInterface {
    businessMetadataDefs: Array<any>
    classificationDefs: ClassificationInterface[]
    entityDefs: Array<any>
    enumDefs: Array<any>
    relationshipDefs: Array<any>
    structDefs: Array<any>
}
