import { classificationInterface } from '~/types/classifications/classification.interface'

export interface typedefsInterface {
    businessMetadataDefs: Array<any>
    classificationDefs: classificationInterface[]
    entityDefs: Array<any>
    enumDefs: Array<any>
    relationshipDefs: Array<any>
    structDefs: Array<any>
}
