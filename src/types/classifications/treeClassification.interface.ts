import { classificationInterface } from '~/types/classifications/classification.interface'

export interface treeClassificationInterface {
    data: classificationInterface
    key: string
    name: string
    title: string
    children: Array<any>
}
