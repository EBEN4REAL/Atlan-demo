export interface State {
    classifications: any;
    classificationTree: any;
    filteredClassificationTree: any;
    fetchClassificationsStatus: string;
    selectedClassification: string;
}

export const state: State = {
    classifications: [],
    classificationTree: [],
    filteredClassificationTree: [],
    fetchClassificationsStatus: '',
    selectedClassification: '',
};
