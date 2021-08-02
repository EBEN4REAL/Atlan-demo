import { classificationInterface } from '~/types/classifications/classification.interface'
import { treeClassificationInterface } from '~/types/classifications/treeClassification.interface'

export interface State {
    classifications: classificationInterface[]
    classificationTree: treeClassificationInterface[]
    filteredClassificationTree: treeClassificationInterface[]
    fetchClassificationsStatus: string
    selectedClassification: string
}

export const state: State = {
    classifications: [],
    classificationTree: [],
    filteredClassificationTree: [],
    fetchClassificationsStatus: '',
    selectedClassification: '',
}
